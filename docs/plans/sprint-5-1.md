# Sprint 5-1: TM DB 스키마 + CRUD + 생성 다이얼로그

## Scope

Translation Memory의 DB 스키마(translation_memories, translation_units, context_pairs)를 생성하고, TM CRUD API를 구현하며, TM 생성 다이얼로그를 만든다.

### 생성/수정할 파일

```
src/db/migrations/004-tm.ts                    # TM 관련 테이블
src/db/repositories/tm.ts                      # TM CRUD
src/db/repositories/tm-entries.ts              # TM 엔트리 CRUD
src/shared/types/tm.ts                         # TM 타입 정의
src/shared/types/ipc.ts                        # (수정) TM IPC 채널
src/main/ipc/tm.ts                             # TM IPC 핸들러
src/main/ipc/index.ts                          # (수정) 등록
src/preload/index.ts                           # (수정) TM API
src/renderer/components/CreateTmDialog.tsx      # TM 생성 다이얼로그
src/renderer/views/NewProjectWizard.tsx         # (수정) Step 3: TM 선택 (선택적)
```

## 핵심 데이터 모델

### translation_memories 테이블

```sql
CREATE TABLE translation_memories (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL UNIQUE,
  source_lang     TEXT NOT NULL,
  target_lang     TEXT NOT NULL,
  description     TEXT DEFAULT '',
  role            TEXT NOT NULL DEFAULT 'working',  -- 'working', 'master', 'reference'
  allow_multiple  INTEGER DEFAULT 1,   -- 동일 source에 다중 번역 허용
  allow_reverse   INTEGER DEFAULT 0,   -- 역방향 조회 허용
  entry_count     INTEGER DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### translation_units 테이블

```sql
CREATE TABLE translation_units (
  id              TEXT PRIMARY KEY,
  tm_id           TEXT NOT NULL REFERENCES translation_memories(id) ON DELETE CASCADE,
  source          TEXT NOT NULL,
  target          TEXT NOT NULL,
  prev_source     TEXT DEFAULT NULL,    -- 이전 세그먼트 source (context)
  next_source     TEXT DEFAULT NULL,    -- 다음 세그먼트 source (context)
  context_id      TEXT DEFAULT NULL,    -- resname 등
  created_by      TEXT DEFAULT '',
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  modified_by     TEXT DEFAULT '',
  modified_at     TEXT NOT NULL DEFAULT (datetime('now')),
  document_name   TEXT DEFAULT '',
  project_name    TEXT DEFAULT '',
  client          TEXT DEFAULT '',
  domain          TEXT DEFAULT '',
  flagged         INTEGER DEFAULT 0,
  UNIQUE(tm_id, source, prev_source, next_source, context_id)
);
```

### project_tms 테이블 (프로젝트↔TM 연결)

```sql
CREATE TABLE project_tms (
  project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tm_id       TEXT NOT NULL REFERENCES translation_memories(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'working',  -- 프로젝트 내 역할
  rank        INTEGER DEFAULT 0,                -- 우선순위
  PRIMARY KEY (project_id, tm_id)
);
```

### TypeScript 타입

```typescript
// src/shared/types/tm.ts
export type TmRole = 'working' | 'master' | 'reference';

export interface TranslationMemory {
  id: string;
  name: string;
  source_lang: string;
  target_lang: string;
  description: string;
  role: TmRole;
  allow_multiple: boolean;
  allow_reverse: boolean;
  entry_count: number;
  created_at: string;
  updated_at: string;
}

export interface TranslationUnit {
  id: string;
  tm_id: string;
  source: string;
  target: string;
  prev_source: string | null;
  next_source: string | null;
  context_id: string | null;
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
  document_name: string;
  project_name: string;
  flagged: boolean;
}

export interface CreateTmInput {
  name: string;
  source_lang: string;
  target_lang: string;
  description?: string;
  role?: TmRole;
}
```

### IPC 채널

```typescript
TM_LIST:        'tm:list',         // → TranslationMemory[]
TM_CREATE:      'tm:create',       // CreateTmInput → TranslationMemory
TM_DELETE:      'tm:delete',       // { id } → void
TM_GET:         'tm:get',          // { id } → TranslationMemory
PROJECT_TM_LINK:   'project-tm:link',    // { projectId, tmId, role } → void
PROJECT_TM_UNLINK: 'project-tm:unlink',  // { projectId, tmId } → void
PROJECT_TM_LIST:   'project-tm:list',    // { projectId } → TranslationMemory[]
```

## 주요 동작 흐름

### 1. TM 생성 다이얼로그

```
입력: New Project Wizard Step 3 또는 Resource Console(Phase 9)에서 "Create TM" 클릭
출력: 다이얼로그
  - Name*: TextInput (필수)
  - Source Language*: 드롭다운 (프로젝트 언어 기본 선택)
  - Target Language*: 드롭다운
  - Role: Working(기본) / Master / Reference
  - Description: Textarea
  - "Create" / "Cancel"

입력: 필드 입력 후 "Create"
과정:
  1. tm.create(input) → TM 생성
  2. 프로젝트에서 호출 시 project_tms에도 연결
출력: 생성된 TM 반환
```

### 2. New Project Wizard Step 3: TM 선택

```
Wizard 확장: Step 1(Details) → Step 2(Documents) → Step 3(TM, 선택적) → Finish

Step 3 UI:
  - 기존 TM 목록 (체크박스 선택)
  - "Create New TM" 버튼
  - 선택한 TM의 Role 설정 (Working/Master/Reference)
  - 어느 단계에서든 Finish 가능 (TM 없이도 프로젝트 생성)
```

## 시각적 스펙

### TM 생성 다이얼로그

```
Sprint 2-3 CloneProjectDialog와 동일 스타일 (오버레이 + 중앙 400px)
필드 레이아웃: Sprint 2-1 New Project Wizard와 동일
Role 선택: 라디오 버튼 3개 (Working/Master/Reference)
  - Working: "확인 시 번역이 저장됩니다" 설명
  - Master: "최종 승인된 번역 저장소" 설명
  - Reference: "참조용 (저장 안 됨)" 설명
```

## Acceptance Criteria

- [ ] DB에 translation_memories, translation_units, project_tms 테이블 생성
- [ ] TM 생성 다이얼로그 → TM 생성 성공
- [ ] 중복 이름 에러 처리
- [ ] 프로젝트에 TM 연결/해제 동작
- [ ] New Project Wizard Step 3에서 TM 선택 가능
- [ ] TM 없이도 프로젝트 생성 가능 (Finish 어느 단계에서든)
- [ ] 앱 재시작 후 TM 목록 유지

## QA Checklist

- [ ] TM 생성 → 성공, 목록에 표시
- [ ] 중복 이름 → 에러
- [ ] Wizard Step 3 → TM 선택 → Finish → 프로젝트에 TM 연결 확인
- [ ] Wizard Step 2에서 Finish → TM 없이 프로젝트 생성
- [ ] 앱 재시작 → TM 유지

## Regression Checklist

- [ ] Phase 4: Import/Export, E2E 59개
- [ ] Phase 3: 에디터 전체
- [ ] Phase 2: Dashboard, CRUD

## Known Gaps (memoQ 대비)

- Custom Fields (최대 20개)는 제외
- TM Repair 마법사는 제외
- 서버 TM/동기화는 범위 밖

## Dependencies

- Phase 4 전체 완료 필수

## Out of Scope

- Match Scoring 엔진 (Sprint 5-2)
- 에디터 연동 (Sprint 5-3)
- TM Editor (Sprint 5-4)
