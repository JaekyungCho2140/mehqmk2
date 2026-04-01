# Sprint 2-4: Project Home 셸 + Project Settings 기본

## Scope

프로젝트를 열었을 때 표시되는 Project Home 뷰를 구현한다. 탭 구조(General / Reports / Settings)의 기본 셸을 만들고, Project Settings에서 기본 정보를 편집할 수 있게 한다. 앱의 전체 네비게이션(Dashboard ↔ Project Home)을 확립한다.

### 생성/수정할 파일

```
src/renderer/views/ProjectHome.tsx             # Project Home 메인 뷰
src/renderer/views/project/GeneralTab.tsx      # General 탭 (프로젝트 요약)
src/renderer/views/project/ReportsTab.tsx      # Reports 탭 (빈 셸, Phase 12)
src/renderer/views/project/SettingsTab.tsx     # Settings 탭 (기본 정보 편집)
src/renderer/components/TabBar.tsx             # 재사용 탭 바 컴포넌트
src/renderer/components/Breadcrumb.tsx         # 네비게이션 경로 표시
src/renderer/styles/project-home.css           # Project Home 스타일
src/renderer/App.tsx                           # (수정) 라우팅: Dashboard / ProjectHome / Wizard 분기
src/shared/types/ipc.ts                        # (수정) project:update 채널
src/main/ipc/projects.ts                       # (수정) update 핸들러
```

## Technical Prerequisites (Planner 확인)

- [x] Sprint 2-1의 Project CRUD (update) API 사용
- [x] React useState로 탭 전환 관리 (라우터 불필요)

## 핵심 데이터 모델

기존 Project 타입 재사용. 추가 모델 없음.

앱 전체 뷰 상태:

```typescript
type AppView =
  | { type: 'wizard' }
  | { type: 'dashboard' }
  | { type: 'project-home'; projectId: string }
  | { type: 'new-project' };
```

## 주요 동작 흐름

### 1. 프로젝트 열기 → Project Home 전환

```
입력: Dashboard에서 프로젝트 더블클릭 또는 Details Pane > "Open"
과정:
  1. project.open(id) 호출 → last_accessed 갱신
  2. App 뷰 상태 → { type: 'project-home', projectId: id }
  3. ProjectHome 컴포넌트 렌더링
출력: Project Home 표시 (General 탭 기본)
```

### 2. General 탭

```
표시 내용:
  - 프로젝트 이름 (큰 제목)
  - 상태 아이콘 + 텍스트
  - 언어: Source → Target
  - 마감일 (설정된 경우)
  - 문서 목록 (Phase 4까지 "문서가 없습니다. Phase 4에서 Import 기능이 추가됩니다." 메시지)
  - 생성 정보: Created by, Created at
```

### 3. Settings 탭

```
입력: Settings 탭 클릭
출력: 프로젝트 설정 편집 폼 (New Project Wizard와 유사)
  - Name: TextInput (편집 가능)
  - Source Language: 드롭다운 (편집 가능, 주의: 문서가 있으면 변경 위험)
  - Target Language: 드롭다운
  - Client / Domain / Subject / Description
  - Deadline: DatePicker
  - "Save" 버튼

입력: 필드 편집 후 "Save"
과정:
  1. project.update({ id, ...변경된 필드 }) 호출
  2. main: UPDATE projects SET ... WHERE id = ?
출력: "저장되었습니다" 토스트 메시지 (2초 후 자동 사라짐)

검증: 이름 비어있음/중복 에러 처리 (Sprint 2-1과 동일)
```

### 4. Reports 탭 (빈 셸)

```
출력: "리포트 기능은 Phase 12에서 추가됩니다." 메시지
```

### 5. Dashboard로 돌아가기

```
입력: Breadcrumb에서 "Dashboard" 클릭 또는 좌측 상단 ← 버튼
출력: App 뷰 상태 → { type: 'dashboard' }, Dashboard 표시
```

## 시각적 스펙

### Project Home 레이아웃

```
전체 화면, 수직 분할:
  상단 바 (height: 56px):
    좌측: ← 버튼 (24x24px, color: var(--color-text-secondary), hover: var(--color-text-primary))
          + Breadcrumb "Dashboard / {프로젝트명}"
    우측: (비어있음, Phase 4+에서 Import/Export 버튼 추가)

  탭 바 (height: 44px, border-bottom: 2px solid var(--color-bg-tertiary)):
    탭 항목: "General" | "Reports" | "Settings"
    활성 탭: color var(--color-accent-primary), border-bottom 2px solid var(--color-accent-primary)
    비활성 탭: color var(--color-text-secondary), hover: color var(--color-text-primary)
    탭 간 간격: var(--spacing-lg) (24px)
    좌측 패딩: var(--spacing-lg)

  탭 내용 (flex: 1, padding: var(--spacing-xl)):
    General / Reports / Settings 내용
```

### General 탭

```
프로젝트 이름: font-size: 24px, font-weight: 700
상태 배지: StatusIcon + 텍스트 (인라인, 이름 옆)
  - 예: ○ Not Started / ◑ In Progress 등

정보 카드: border: 1px solid var(--color-border-default), border-radius: 8px, padding: var(--spacing-lg)
  2열 그리드 (grid-template-columns: 1fr 1fr, gap: var(--spacing-md))
    Languages: "ko → en"
    Deadline: "2026-04-15" 또는 "—"
    Client: "Acme Corp" 또는 "—"
    Domain: "IT" 또는 "—"
    Created by: "홍길동"
    Created at: "2026-04-01"

문서 섹션:
  제목: "Documents" (font-size: 16px, font-weight: 600, margin-top: var(--spacing-xl))
  내용: "문서가 없습니다." (color: var(--color-text-muted), text-align: center, padding: var(--spacing-xl))
```

### Settings 탭

```
Sprint 2-1 New Project Wizard의 ProjectDetails 폼과 동일 레이아웃 재사용.
하단에 "Save" 버튼 (primary 스타일) + "Cancel" (secondary, 변경 취소)
```

### Toast 메시지

```
위치: 화면 하단 중앙, bottom: var(--spacing-lg)
배경: #1a1a2e (어두운), color: #ffffff
padding: 12px 24px, border-radius: 8px
font-size: var(--font-size-base)
애니메이션: fade-in 200ms → 2초 유지 → fade-out 200ms
```

## Acceptance Criteria

- [ ] 프로젝트 더블클릭 → Project Home 표시
- [ ] General 탭에 프로젝트 정보 표시
- [ ] Settings 탭에서 Name/Language/Client 등 편집 가능
- [ ] Save → DB 업데이트, 토스트 "저장되었습니다" 표시
- [ ] 이름 중복/빈 값 에러 처리
- [ ] Reports 탭은 빈 셸 메시지 표시
- [ ] ← 버튼 또는 Breadcrumb → Dashboard 복귀
- [ ] TabBar 탭 전환 동작
- [ ] AppView 상태 관리로 Wizard / Dashboard / ProjectHome / NewProject 전환

## QA Checklist

- [ ] Dashboard에서 프로젝트 더블클릭 → Project Home 표시
- [ ] General 탭 정보가 올바름
- [ ] Settings 탭 → 이름 변경 → Save → Dashboard에서 변경 확인
- [ ] Reports 탭 → 빈 셸 메시지
- [ ] ← → Dashboard 복귀
- [ ] 탭 전환 (General / Reports / Settings) 정상

## Regression Checklist

- [ ] Sprint 2-3: Details Pane, Clone, Delete
- [ ] Sprint 2-2: AG Grid 정렬, 검색
- [ ] Sprint 2-1: New Project Wizard
- [ ] Phase 1: E2E 전체 통과

## Known Gaps (memoQ 대비)

- memoQ의 PM 뷰 vs Translator 뷰 구분은 제외 (mehQ는 단일 사용자 앱)
- memoQ의 Project Home에는 Translations/Assignments/Quality 탭이 있으나 현재는 General/Reports/Settings만
- 문서 목록은 Phase 4에서 추가

## Dependencies

- Sprint 2-3 완료 필수

## Out of Scope

- E2E 테스트 (Sprint 2-5)
- 문서 Import/Export (Phase 4)
- Reports 내용 (Phase 12)
