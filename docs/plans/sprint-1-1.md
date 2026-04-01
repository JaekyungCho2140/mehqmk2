# Sprint 1-1: Electron Forge + Vite + React 보일러플레이트

## Scope

Electron Forge + Vite + React + TypeScript 프로젝트를 초기화하고, main/preload/renderer 3프로세스 구조를 확립한다. 이 Sprint 완료 후 `npm start`로 빈 Electron 창이 열리고 React 컴포넌트가 렌더링되어야 한다.

### 생성/수정할 파일

```
package.json                    # Electron Forge + 의존성
tsconfig.json                   # 공통 TS 설정 (base)
tsconfig.main.json              # main 프로세스 TS 설정
tsconfig.preload.json           # preload TS 설정
tsconfig.renderer.json          # renderer TS 설정
forge.config.ts                 # Electron Forge 설정
vite.main.config.ts             # Vite main 프로세스 빌드
vite.preload.config.ts          # Vite preload 빌드
vite.renderer.config.ts         # Vite renderer 빌드 (React HMR)
src/main/index.ts               # Electron main 프로세스 진입점
src/main/window.ts              # BrowserWindow 생성 함수
src/preload/index.ts            # contextBridge API 노출
src/renderer/index.html         # HTML 진입점
src/renderer/index.tsx          # React DOM 렌더 진입점
src/renderer/App.tsx            # 루트 React 컴포넌트 (빈 셸)
src/renderer/app.css            # 글로벌 CSS (CSS 변수 정의)
src/shared/types/ipc.ts         # IPC 채널명 상수 + 타입 (빈 골격)
.gitignore                      # node_modules, out, .vite 등
```

## Technical Prerequisites (Planner 확인 — 2026-04-01 조사 완료)

- [x] Electron Forge v7.11.1 + Electron v41.1.0 + `@electron-forge/plugin-vite` v7.11.1 호환 확인
- [x] Vite에서 React HMR을 위해 `@vitejs/plugin-react` 수동 추가 필요 (Forge 템플릿 기본 미포함)
- [x] 3프로세스 구조(main/preload/renderer)는 Forge Vite 플러그인이 기본 제공
- [x] TypeScript 5.x + strict mode 사용
- [x] tsconfig 분리 권장: main(CommonJS) + renderer(ESNext, jsx: react-jsx)

### 초기화 방법 (기존 .git 디렉토리 고려)

```bash
# 옵션 A: 임시 디렉토리에 생성 후 파일 복사 (권장 — 기존 .git 보존)
cd /tmp && npx create-electron-app@latest mehq-init --template=vite-typescript
# 생성된 파일을 프로젝트 루트로 복사 (package.json, forge.config.ts, vite.*.config.ts, src/ 등)
# .git은 복사하지 않음

# React 추가
npm install react react-dom
npm install -D @vitejs/plugin-react @types/react @types/react-dom
```

### vite.renderer.config.ts React 플러그인 설정

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### forge.config.ts VitePlugin 구조

```typescript
plugins: [
  new VitePlugin({
    build: [
      { entry: 'src/main/index.ts', config: 'vite.main.config.ts' },
      { entry: 'src/preload/index.ts', config: 'vite.preload.config.ts' },
    ],
    renderer: [
      { name: 'main_window', config: 'vite.renderer.config.ts' },
    ],
  }),
],
```

## 핵심 데이터 모델

이 Sprint에서는 데이터 모델 없음. `src/shared/types/ipc.ts`에 IPC 타입 골격만 생성:

```typescript
// src/shared/types/ipc.ts
// Phase 1-2에서 구체적인 채널을 추가할 예정
export const IPC_CHANNELS = {} as const;

export type IpcChannels = typeof IPC_CHANNELS;
```

## 주요 동작 흐름

### 1. 앱 시작 (npm start)

```
입력: 사용자가 터미널에서 `npm start` 실행
출력:
  1. Vite dev server 시작 (renderer)
  2. Electron main 프로세스 시작
  3. BrowserWindow 생성 (1200x800, 최소 800x600)
  4. renderer의 index.html 로드
  5. React App 컴포넌트 렌더링 ("mehQ" 텍스트 표시)
  6. DevTools 자동 열림 (개발 모드에서만)
```

### 2. 창 닫기

```
입력: 사용자가 창을 닫음 (macOS: Cmd+Q, Windows: Alt+F4)
출력:
  - macOS: app.quit() 호출 (모든 창 닫기)
  - 다른 OS: 마지막 창 닫히면 app.quit()
```

### 3. React HMR

```
입력: 개발 중 renderer 코드 수정 후 저장
출력: Electron 재시작 없이 React 컴포넌트 핫 리로드
```

## 시각적 스펙

### BrowserWindow 기본 설정

| 속성 | 값 |
|------|-----|
| width | 1200 |
| height | 800 |
| minWidth | 800 |
| minHeight | 600 |
| title | mehQ |
| backgroundColor | #ffffff |
| webPreferences.preload | preload/index.js |
| webPreferences.contextIsolation | true |
| webPreferences.nodeIntegration | false |

### App.tsx 초기 렌더링

```
- 배경색: var(--color-bg-primary, #ffffff)
- 텍스트: "mehQ" 중앙 정렬
- 폰트: system-ui, -apple-system, sans-serif
- 텍스트 색상: var(--color-text-primary, #1a1a2e)
```

### CSS 변수 초기 정의 (app.css — 크로스커팅)

```css
:root {
  /* 배경 */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-bg-tertiary: #e8e8e8;

  /* 텍스트 */
  --color-text-primary: #1a1a2e;
  --color-text-secondary: #4a4a5a;
  --color-text-muted: #8a8a9a;

  /* 강조 */
  --color-accent-primary: #2563eb;
  --color-accent-hover: #1d4ed8;

  /* 테두리 */
  --color-border-default: #d1d5db;
  --color-border-focus: #2563eb;

  /* 폰트 */
  --font-family-ui: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;

  /* 간격 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family-ui);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  overflow: hidden;
}
```

## Acceptance Criteria

- [ ] `npm start` 실행 시 Electron 창이 열리고 React 컴포넌트가 렌더링됨
- [ ] 창 제목이 "mehQ"
- [ ] 창 크기: 1200x800, 최소 800x600 제한 적용
- [ ] 개발 모드에서 DevTools 자동 열림
- [ ] `contextIsolation: true`, `nodeIntegration: false` 설정 확인
- [ ] preload 스크립트가 정상 로드됨 (콘솔 에러 없음)
- [ ] React HMR 동작: App.tsx 텍스트 변경 시 재시작 없이 반영
- [ ] CSS 변수가 :root에 정의되어 있고, App.tsx에서 사용됨
- [ ] TypeScript strict mode 활성, 빌드 에러 없음
- [ ] `npm run make` 실행 시 플랫폼 바이너리 생성 성공

## QA Checklist

- [ ] `npm start` → Electron 창 열림, "mehQ" 텍스트 보임
- [ ] `npm run make` → out/ 디렉토리에 바이너리 생성
- [ ] 창 리사이즈: 800x600 미만으로 줄어들지 않음
- [ ] macOS에서 Cmd+Q → 앱 완전 종료
- [ ] DevTools 열림 확인 (개발 모드)
- [ ] 콘솔에 에러/경고 없음 (React, preload 관련)
- [ ] TypeScript 컴파일 에러 없음

## Regression Checklist

- 첫 Sprint이므로 회귀 대상 없음

## Known Gaps (memoQ 대비)

- memoQ의 리본 UI, 메뉴 시스템은 Phase 2~3에서 구현
- 윈도우 상태 저장/복원 (위치, 크기)은 Phase 13 Options에서 구현
- 멀티 윈도우는 범위 밖 (memoQ는 MDI)

## Verification Questions (Generator가 구현 전에 확인)

- [ ] `npx create-electron-app mehqmk2 --template=vite-typescript`가 현재 경로에서 동작하는가? (이미 .git이 있으므로 기존 디렉토리에서 초기화 방법 확인)
- [ ] Electron Forge의 Vite 플러그인이 React JSX/TSX를 기본 지원하는가, 아니면 `@vitejs/plugin-react` 추가가 필요한가?
- [ ] tsconfig 분리 시 Forge의 빌드 파이프라인과 충돌하지 않는가?

## Dependencies

- 선행 Sprint 없음 (Phase 1 첫 Sprint)

## Out of Scope

- SQLite 연결 (Sprint 1-2)
- IPC 통신 구현 (Sprint 1-2)
- Welcome Wizard UI (Sprint 1-3)
- ESLint/Prettier 설정 (Sprint 1-4)
- Playwright E2E 설정 (Sprint 1-4)
- 어떤 비즈니스 로직도 포함하지 않음
