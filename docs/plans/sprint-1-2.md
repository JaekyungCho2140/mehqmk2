# Sprint 1-2: SQLite 연결 + IPC 통신 레이어

## Scope

better-sqlite3로 SQLite DB를 연결하고, user_settings 스키마를 생성하며, main↔renderer 간 Typed IPC 통신 패턴을 확립한다. DB 마이그레이션 시스템의 기초도 이 Sprint에서 구축한다.

### 생성/수정할 파일

```
src/db/database.ts              # SQLite 연결 관리 (싱글턴)
src/db/migrations/index.ts      # 마이그레이션 러너
src/db/migrations/001-init.ts   # 최초 스키마: user_settings
src/db/repositories/settings.ts # user_settings CRUD
src/main/ipc/index.ts           # IPC 핸들러 등록 진입점
src/main/ipc/settings.ts        # settings 관련 IPC 핸들러
src/main/index.ts               # (수정) DB 초기화 + IPC 등록 추가
src/preload/index.ts            # (수정) contextBridge API 추가
src/shared/types/ipc.ts         # (수정) IPC 채널명 + 요청/응답 타입
src/shared/types/settings.ts    # UserSettings 타입 정의
```

## Technical Prerequisites (Planner 확인 — 2026-04-01 조사 완료)

- [x] better-sqlite3 v12.8.0은 동기 API 제공 → main 프로세스에서 직접 호출 가능
- [x] `@electron/rebuild` v4.0.3이 현재 권장 (기존 `electron-rebuild` v3.x는 deprecated wrapper)
- [x] contextBridge + ipcRenderer.invoke/ipcMain.handle 패턴 사용 (보안 권장)

### 네이티브 모듈 리빌드 설정

```bash
npm install better-sqlite3
npm install -D @electron/rebuild
```

**package.json postinstall** (개발 중 자동 리빌드):
```json
"scripts": {
  "postinstall": "electron-rebuild"
}
```

**forge.config.ts packageAfterPrune 훅** (패키징 시 리빌드):
```typescript
import { execSync } from 'child_process';

hooks: {
  packageAfterPrune: async (_config, buildPath) => {
    execSync('npx @electron/rebuild -f -m .', {
      cwd: buildPath,
      stdio: 'inherit',
    });
  },
},
```

## 핵심 데이터 모델

### user_settings 테이블

```sql
CREATE TABLE IF NOT EXISTS user_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL  -- JSON 직렬화된 값
);
```

초기 설정 키:

| key | value 타입 | 기본값 | 용도 |
|-----|-----------|--------|------|
| `user_name` | string | "" | 사용자 이름 (TM, Track Changes 등에 사용) |
| `work_directory` | string | "~/Documents/mehQ" | 프로젝트 기본 저장 경로 |
| `ui_language` | string | "en" | 인터페이스 언어 |
| `wizard_completed` | boolean | false | Welcome Wizard 완료 여부 |

### TypeScript 타입

```typescript
// src/shared/types/settings.ts
export interface UserSettings {
  user_name: string;
  work_directory: string;
  ui_language: string;
  wizard_completed: boolean;
}

export type SettingsKey = keyof UserSettings;

export const DEFAULT_SETTINGS: UserSettings = {
  user_name: '',
  work_directory: '', // 런타임에 os.homedir()/Documents/mehQ로 결정
  ui_language: 'en',
  wizard_completed: false,
};
```

### IPC 타입

```typescript
// src/shared/types/ipc.ts
export const IPC_CHANNELS = {
  SETTINGS_GET: 'settings:get',
  SETTINGS_GET_ALL: 'settings:get-all',
  SETTINGS_SET: 'settings:set',
  SETTINGS_SET_BULK: 'settings:set-bulk',
  DIALOG_SELECT_DIRECTORY: 'dialog:select-directory',
} as const;

// 요청/응답 타입 매핑
export interface IpcRequestMap {
  [IPC_CHANNELS.SETTINGS_GET]: { key: SettingsKey };
  [IPC_CHANNELS.SETTINGS_GET_ALL]: void;
  [IPC_CHANNELS.SETTINGS_SET]: { key: SettingsKey; value: unknown };
  [IPC_CHANNELS.SETTINGS_SET_BULK]: Partial<UserSettings>;
  [IPC_CHANNELS.DIALOG_SELECT_DIRECTORY]: { defaultPath?: string };
}

export interface IpcResponseMap {
  [IPC_CHANNELS.SETTINGS_GET]: unknown;
  [IPC_CHANNELS.SETTINGS_GET_ALL]: UserSettings;
  [IPC_CHANNELS.SETTINGS_SET]: void;
  [IPC_CHANNELS.SETTINGS_SET_BULK]: void;
  [IPC_CHANNELS.DIALOG_SELECT_DIRECTORY]: string | null;
}
```

## 주요 동작 흐름

### 1. 앱 시작 시 DB 초기화

```
입력: Electron app 'ready' 이벤트
출력:
  1. SQLite DB 파일 생성 (app.getPath('userData')/mehq.db)
  2. 마이그레이션 실행 (001-init → user_settings 테이블 생성)
  3. IPC 핸들러 등록 (settings:get, settings:get-all, settings:set, settings:set-bulk, dialog:select-directory)
  4. BrowserWindow 생성 (기존 Sprint 1-1 로직)
```

### 2. 설정 조회 (renderer → main)

```
입력: renderer에서 window.electronAPI.settings.getAll() 호출
과정:
  1. preload의 contextBridge가 ipcRenderer.invoke('settings:get-all') 호출
  2. main의 ipcMain.handle('settings:get-all') 수신
  3. SettingsRepository.getAll() → SQLite 쿼리 → JSON 파싱
  4. 결과를 renderer에 반환
출력: UserSettings 객체
```

### 3. 설정 저장 (renderer → main)

```
입력: renderer에서 window.electronAPI.settings.setBulk({ user_name: '홍길동', wizard_completed: true })
과정:
  1. preload의 contextBridge가 ipcRenderer.invoke('settings:set-bulk', data) 호출
  2. main의 ipcMain.handle('settings:set-bulk') 수신
  3. SettingsRepository.setBulk() → SQLite INSERT OR REPLACE (트랜잭션)
출력: void (성공 시), Error throw (실패 시)
```

### 4. 디렉토리 선택 다이얼로그

```
입력: renderer에서 window.electronAPI.dialog.selectDirectory({ defaultPath: '~/Documents' })
과정:
  1. preload → ipcRenderer.invoke('dialog:select-directory', { defaultPath })
  2. main에서 dialog.showOpenDialog({ properties: ['openDirectory'], defaultPath })
  3. 선택된 경로 또는 null 반환
출력: string(선택된 경로) | null(취소 시)
```

## DB 마이그레이션 시스템

```typescript
// src/db/migrations/index.ts
interface Migration {
  version: number;
  name: string;
  up: (db: Database) => void;
}

// 마이그레이션 테이블 자동 생성
// CREATE TABLE IF NOT EXISTS _migrations (
//   version INTEGER PRIMARY KEY,
//   name    TEXT NOT NULL,
//   applied_at TEXT NOT NULL DEFAULT (datetime('now'))
// );

// 실행 로직:
// 1. _migrations 테이블에서 마지막 적용 버전 조회
// 2. 미적용 마이그레이션을 순서대로 실행 (트랜잭션)
// 3. 각 마이그레이션 적용 후 _migrations에 기록
```

## preload API 구조

```typescript
// src/preload/index.ts
// contextBridge.exposeInMainWorld('electronAPI', { ... })

// renderer에서 사용할 수 있는 API:
// window.electronAPI.settings.get(key) → Promise<unknown>
// window.electronAPI.settings.getAll() → Promise<UserSettings>
// window.electronAPI.settings.set(key, value) → Promise<void>
// window.electronAPI.settings.setBulk(settings) → Promise<void>
// window.electronAPI.dialog.selectDirectory(options?) → Promise<string | null>
```

## Acceptance Criteria

- [ ] `npm start` 후 `app.getPath('userData')/mehq.db` 파일이 생성됨
- [ ] DB에 `user_settings`와 `_migrations` 테이블이 존재
- [ ] renderer에서 `window.electronAPI.settings.getAll()` 호출 시 기본값 반환
- [ ] renderer에서 `window.electronAPI.settings.set('user_name', '테스트')` 후 `get('user_name')` → '테스트' 반환
- [ ] `window.electronAPI.dialog.selectDirectory()` → macOS 폴더 선택 다이얼로그 열림
- [ ] 앱 재시작 후 저장된 설정이 유지됨 (DB 영속)
- [ ] TypeScript 타입 에러 없음, IPC 채널명이 타입 안전
- [ ] better-sqlite3 네이티브 모듈이 Electron에서 정상 로드 (import 에러 없음)

## QA Checklist

- [ ] `npm start` → DB 파일 생성 확인 (파일 존재 검증)
- [ ] DevTools 콘솔에서 `await window.electronAPI.settings.getAll()` 실행 → 기본 설정 객체 반환
- [ ] DevTools에서 설정 저장 → 앱 종료 → 재시작 → 저장값 유지 확인
- [ ] `selectDirectory()` → 다이얼로그 열림, 폴더 선택 시 경로 문자열 반환, 취소 시 null
- [ ] 콘솔에 SQLite 관련 에러 없음
- [ ] Sprint 1-1의 모든 QA 항목이 여전히 통과

## Regression Checklist

- [ ] Sprint 1-1: `npm start` → 창 열림, 제목 "mehQ", 창 크기 제한
- [ ] Sprint 1-1: React HMR 동작
- [ ] Sprint 1-1: CSS 변수 적용

## Known Gaps (memoQ 대비)

- memoQ의 옵션 체계는 훨씬 복잡 (수십 개 카테고리). 현재는 4개 핵심 설정만 저장
- 설정 Import/Export는 Phase 13에서 구현

## Verification Questions (Generator가 구현 전에 확인)

- [ ] `npm install better-sqlite3` 후 `npm start`에서 네이티브 모듈 로드 성공하는가?
- [ ] 실패 시 `npx electron-rebuild` 또는 Forge config에 rebuild 훅 추가로 해결 가능한가?
- [ ] `app.getPath('userData')`가 개발 모드에서 어떤 경로를 반환하는가?

## Dependencies

- Sprint 1-1 완료 필수 (Electron + Vite + React 프로젝트 구조)

## Out of Scope

- Welcome Wizard UI (Sprint 1-3)
- UI에서 설정을 편집하는 폼 (Sprint 1-3)
- 프로젝트 DB 스키마 (Phase 2)
- TM/TB 관련 DB 스키마 (Phase 5/7)
