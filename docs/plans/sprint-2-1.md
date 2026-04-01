# Sprint 2-1: DB 스키마 + Project CRUD + New Project Wizard

## Scope

프로젝트와 문서를 관리하기 위한 DB 스키마를 생성하고, Project CRUD API를 구현하며, New Project Wizard(Details 단계 + Finish)를 만든다. Phase 2의 기초가 되는 데이터 레이어와 프로젝트 생성 UI를 확립한다.

### 생성/수정할 파일

```
src/db/migrations/002-projects.ts           # projects + documents 테이블
src/db/repositories/projects.ts             # Project CRUD
src/db/repositories/documents.ts            # Document CRUD (빈 골격)
src/shared/types/project.ts                 # Project, Document 타입
src/shared/types/ipc.ts                     # (수정) 프로젝트 IPC 채널 추가
src/main/ipc/projects.ts                    # 프로젝트 IPC 핸들러
src/main/ipc/index.ts                       # (수정) projects 핸들러 등록
src/preload/index.ts                        # (수정) project API 추가
src/renderer/views/Dashboard.tsx            # (수정) "+ New Project" 버튼 활성화
src/renderer/views/NewProjectWizard.tsx     # New Project Wizard 컨테이너
src/renderer/views/wizard/ProjectDetails.tsx # Step 1: 프로젝트 상세 입력
src/renderer/styles/project-wizard.css      # Wizard 스타일
src/renderer/hooks/useProjects.ts           # projects IPC 래퍼 훅
```

## Technical Prerequisites (Planner 확인)

- [x] Sprint 1-2의 마이그레이션 시스템으로 002-projects 추가 가능
- [x] Sprint 1-2의 Typed IPC 패턴을 확장하여 프로젝트 채널 추가
- [x] SQLite의 datetime('now') 함수로 타임스탬프 관리

## 핵심 데이터 모델

### projects 테이블

```sql
CREATE TABLE projects (
  id            TEXT PRIMARY KEY,  -- UUID v4
  name          TEXT NOT NULL,
  source_lang   TEXT NOT NULL,     -- ISO 639-1 (예: 'en', 'ko', 'ja')
  target_lang   TEXT NOT NULL,     -- ISO 639-1
  client        TEXT DEFAULT '',
  domain        TEXT DEFAULT '',
  subject       TEXT DEFAULT '',
  description   TEXT DEFAULT '',
  directory     TEXT NOT NULL,     -- 프로젝트 파일 저장 경로
  deadline      TEXT DEFAULT NULL, -- ISO 8601 (예: '2026-04-15T00:00:00Z')
  status        TEXT NOT NULL DEFAULT 'not-started',
  -- status 값: 'not-started', 'in-progress', 'translation-done', 'r1-done', 'r2-done', 'completed'
  created_by    TEXT NOT NULL,     -- user_settings.user_name에서
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  last_accessed TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(name)
);
```

### documents 테이블 (Phase 4에서 본격 사용, 골격만)

```sql
CREATE TABLE documents (
  id          TEXT PRIMARY KEY,
  project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,         -- 원본 파일명
  format      TEXT NOT NULL,         -- 'xliff', 'po', 'tmx' 등
  file_path   TEXT NOT NULL,         -- 임포트된 파일 경로
  seg_count   INTEGER DEFAULT 0,     -- 세그먼트 수
  progress    REAL DEFAULT 0.0,      -- 완성도 (0.0 ~ 1.0)
  imported_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### TypeScript 타입

```typescript
// src/shared/types/project.ts
export type ProjectStatus =
  | 'not-started'
  | 'in-progress'
  | 'translation-done'
  | 'r1-done'
  | 'r2-done'
  | 'completed';

export interface Project {
  id: string;
  name: string;
  source_lang: string;
  target_lang: string;
  client: string;
  domain: string;
  subject: string;
  description: string;
  directory: string;
  deadline: string | null;
  status: ProjectStatus;
  created_by: string;
  created_at: string;
  last_accessed: string;
}

export interface CreateProjectInput {
  name: string;
  source_lang: string;
  target_lang: string;
  client?: string;
  domain?: string;
  subject?: string;
  description?: string;
  directory?: string;   // 미지정 시 work_directory/프로젝트명
  deadline?: string | null;
}

export interface Document {
  id: string;
  project_id: string;
  name: string;
  format: string;
  file_path: string;
  seg_count: number;
  progress: number;
  imported_at: string;
}
```

### IPC 채널 추가

```typescript
// src/shared/types/ipc.ts에 추가
PROJECT_LIST:       'project:list',        // → Project[]
PROJECT_GET:        'project:get',         // { id } → Project | null
PROJECT_CREATE:     'project:create',      // CreateProjectInput → Project
PROJECT_UPDATE:     'project:update',      // { id, ...Partial<Project> } → Project
PROJECT_DELETE:     'project:delete',      // { id } → void
PROJECT_OPEN:       'project:open',        // { id } → Project (last_accessed 갱신)
```

## 주요 동작 흐름

### 1. New Project Wizard 열기

```
입력: Dashboard에서 "+ New Project" 버튼 클릭
출력:
  1. Dashboard → NewProjectWizard 뷰 전환
  2. ProjectDetails 폼 표시 (Step 1)
  3. Name 필드에 포커스
```

### 2. 프로젝트 생성 (Finish 클릭)

```
입력: ProjectDetails 폼에서 Name, Source/Target Language 입력 후 "Finish" 클릭
검증:
  - Name: 필수, 빈 문자열 불가, 중복 이름 불가 → "이 이름의 프로젝트가 이미 존재합니다" 에러
  - Source language: 필수 드롭다운 선택
  - Target language: 필수 드롭다운 선택, Source와 동일 불가
  - Client/Domain/Subject/Description: 선택
  - Deadline: 선택, 날짜 선택 시 오늘 이전 불가
과정:
  1. window.electronAPI.project.create(input) 호출
  2. main: UUID 생성, directory = work_directory + '/' + name
  3. main: fs.mkdirSync(directory, { recursive: true })
  4. main: INSERT INTO projects → Project 객체 반환
  5. renderer: Dashboard로 복귀, 새 프로젝트가 목록에 표시
출력: 생성된 Project 객체
```

### 3. Cancel

```
입력: "Cancel" 클릭
출력: Dashboard로 복귀, 프로젝트 미생성
```

## 시각적 스펙

### New Project Wizard — ProjectDetails

```
레이아웃: 전체 화면 (Dashboard 대체)
상단 바: "New Project" 제목 (font-size: 20px, font-weight: 600, padding: var(--spacing-lg))
         우측: "Cancel" 텍스트 버튼

폼 영역: max-width 640px, 수평 중앙, padding var(--spacing-xl)
  - 각 필드: 라벨(font-size: var(--font-size-sm), font-weight: 500, color: var(--color-text-secondary))
              + 입력 필드(width: 100%, height: 40px, border: 1px solid var(--color-border-default), border-radius: 6px)
              + 필드 간 간격: var(--spacing-md) (16px)

  Name*: TextInput (필수 표시 * 빨간색)
  Source Language*: 드롭다운 (검색 가능)
  Target Language*: 드롭다운 (검색 가능)
  ---구분선--- (1px solid var(--color-border-default), margin: var(--spacing-lg) 0)
  Client: TextInput
  Domain: TextInput
  Subject: TextInput
  Description: Textarea (height: 80px, resize: vertical)
  Deadline: DatePicker (type="date" input, 선택)

하단 버튼: "Finish" 버튼 우측 정렬 (Sprint 1-3과 동일 스타일)
```

### 언어 드롭다운

```
주요 언어 목록 (Phase 2에서 지원할 언어):
  en - English
  ko - 한국어
  ja - 日本語
  zh - 中文
  de - Deutsch
  fr - Français
  es - Español
  pt - Português
  it - Italiano
  ru - Русский
  ar - العربية
  th - ภาษาไทย
  vi - Tiếng Việt
  id - Bahasa Indonesia
  nl - Nederlands
  pl - Polski
  tr - Türkçe
  sv - Svenska

드롭다운 스타일:
  - height: 40px, border와 동일 스타일
  - 검색: 상단에 텍스트 필터 (타이핑 시 목록 필터)
  - 선택 시 "ko - 한국어" 형태로 표시
```

## Acceptance Criteria

- [ ] `npm start` 후 DB에 projects, documents 테이블 존재
- [ ] Dashboard에서 "+ New Project" 클릭 → New Project Wizard 표시
- [ ] Name, Source/Target Language 입력 후 Finish → 프로젝트 생성, Dashboard 복귀
- [ ] 생성된 프로젝트가 Dashboard 목록에 표시 (현재는 간단한 리스트)
- [ ] 중복 이름 → 에러 메시지 표시
- [ ] Source = Target 언어 → 에러 메시지
- [ ] Cancel → Dashboard 복귀, 프로젝트 미생성
- [ ] 프로젝트 디렉토리가 파일시스템에 생성됨
- [ ] TypeScript 컴파일 에러 없음

## QA Checklist

- [ ] "+ New Project" → Wizard 표시
- [ ] 필수 필드 미입력 시 Finish 비활성 또는 에러
- [ ] 정상 입력 후 Finish → 프로젝트 생성, Dashboard 목록에 표시
- [ ] 중복 이름 → 에러 메시지
- [ ] Cancel → Dashboard 복귀
- [ ] 프로젝트 디렉토리 생성 확인 (파일 시스템)
- [ ] 앱 재시작 후 프로젝트 목록 유지 (DB 영속)

## Regression Checklist

- [ ] Phase 1: Welcome Wizard 정상 동작 (최초 실행)
- [ ] Phase 1: 설정 저장/복원
- [ ] Phase 1: E2E 테스트 전체 통과

## Known Gaps (memoQ 대비)

- memoQ의 New Project Wizard는 5단계 (Details, Documents, TMs, TBs, Finish). Phase 2에서는 Details+Finish만 구현
- Documents 단계는 Phase 4 (Document Import)에서 추가
- TM/TB 선택은 Phase 5/7에서 추가
- 템플릿 기반 생성은 제외
- Record version history 옵션은 Phase 8 (Track Changes)에서 구현

## Verification Questions (Generator가 구현 전에 확인)

- [ ] UUID 생성: `crypto.randomUUID()`가 Electron main에서 사용 가능한가?
- [ ] 프로젝트 디렉토리 생성 시 권한 문제가 있을 수 있는가?

## Dependencies

- Phase 1 전체 완료 (Sprint 1-1 ~ 1-4)

## Out of Scope

- Documents Import (Phase 4)
- TM/TB 연결 (Phase 5/7)
- AG Grid 기반 프로젝트 목록 (Sprint 2-2)
- 프로젝트 삭제 확인 다이얼로그 (Sprint 2-3)
- Project Home (Sprint 2-4)
