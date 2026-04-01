# Sprint 2-2: Dashboard AG Grid 프로젝트 목록

## Scope

Dashboard에 AG Grid Community를 도입하여 프로젝트 목록을 전문적인 데이터 그리드로 표시한다. Two-row view, 정렬, 검색 필터를 구현한다.

### 생성/수정할 파일

```
src/renderer/views/Dashboard.tsx              # (수정) AG Grid 프로젝트 목록
src/renderer/components/grid/ProjectGrid.tsx  # AG Grid 래퍼 컴포넌트
src/renderer/components/grid/columns.ts       # 컬럼 정의
src/renderer/components/grid/renderers/       # 커스텀 셀 렌더러 디렉토리
  StatusRenderer.tsx                          # 상태 아이콘 셀
  ProgressRenderer.tsx                        # 진행률 바 셀
  DeadlineRenderer.tsx                        # 마감일 + 경고 셀
  LanguageRenderer.tsx                        # 소스→타겟 언어 셀
src/renderer/components/SearchFilter.tsx      # 검색 필터 입력
src/renderer/styles/grid.css                  # AG Grid 커스텀 테마
```

## Technical Prerequisites (Planner 확인)

- [ ] ⚠️ 미확인: AG Grid Community v35의 정확한 npm 패키지명과 React 래퍼 → Generator가 npm 레지스트리에서 확인
  - 예상: `ag-grid-community` + `ag-grid-react`
- [x] AG Grid Community는 정렬, 필터, 커스텀 셀 렌더러 지원 (Enterprise 기능 불필요)

## 핵심 데이터 모델

Sprint 2-1의 `Project` 타입 재사용. 추가 모델 없음.

### AG Grid 컬럼 정의

```typescript
// memoQ Dashboard 컬럼을 mehQ에 맞게 조정
const columnDefs: ColDef<Project>[] = [
  { field: 'status',       headerName: '',         width: 40,  cellRenderer: 'statusRenderer', sortable: false },
  { field: 'name',         headerName: 'Name',     flex: 2,    sortable: true, filter: true },
  { field: 'source_lang',  headerName: 'Languages', width: 120, cellRenderer: 'languageRenderer' },
  { field: 'client',       headerName: 'Client',   flex: 1,    sortable: true },
  { field: 'domain',       headerName: 'Domain',   flex: 1,    sortable: true },
  { field: 'deadline',     headerName: 'Deadline',  width: 140, cellRenderer: 'deadlineRenderer', sortable: true },
  { field: 'created_at',   headerName: 'Created',   width: 140, sortable: true },
  { field: 'last_accessed', headerName: 'Last Accessed', width: 140, sortable: true },
];
```

## 주요 동작 흐름

### 1. Dashboard 로드

```
입력: Dashboard 뷰 마운트
과정:
  1. window.electronAPI.project.list() 호출
  2. AG Grid에 프로젝트 배열 바인딩
출력:
  - 프로젝트 있음 → AG Grid 테이블 표시
  - 프로젝트 없음 → 빈 상태 메시지 ("프로젝트가 없습니다. 새 프로젝트를 생성하세요.")
```

### 2. 프로젝트 목록 표시

```
입력: Project[] 배열
출력: AG Grid 행 렌더링
  - 각 행: 상태 아이콘 | 이름 | 언어(ko → en) | Client | Domain | 마감일 | 생성일 | 최근 접근
  - 기본 정렬: last_accessed 내림차순 (최근 사용 프로젝트 상단)
```

### 3. 정렬

```
입력: 컬럼 헤더 클릭
출력:
  - 1번 클릭: 오름차순 (▲)
  - 2번 클릭: 내림차순 (▼)
  - 3번 클릭: 정렬 해제
```

### 4. 검색 필터

```
입력: 검색 필드에 텍스트 입력
출력: 프로젝트 이름, Client, Domain 중 하나라도 포함하는 행만 필터
  - 실시간 필터 (debounce 300ms)
  - 빈 문자열 → 전체 표시
```

### 5. 프로젝트 더블클릭 (열기)

```
입력: 프로젝트 행 더블클릭
과정:
  1. project.open(id) 호출 → last_accessed 갱신
  2. Project Home 뷰로 전환 (Sprint 2-4에서 구현, 현재는 빈 셸)
출력: Project Home 표시
```

### 6. 프로젝트 우클릭 컨텍스트 메뉴

```
입력: 프로젝트 행 우클릭
출력: 컨텍스트 메뉴 표시
  - Open
  - Clone (Sprint 2-3에서 기능 연결)
  - Delete → 확인 다이얼로그 (Sprint 2-3)
  - 구분선
  - Properties (Sprint 2-4)
```

## 시각적 스펙

### Dashboard 레이아웃

```
전체 화면, 수직 분할:
  상단 바 (height: 56px):
    좌측: "mehQ" 로고 텍스트 (font-size: 18px, font-weight: 700, color: var(--color-accent-primary))
    중앙: SearchFilter (width: 360px, height: 36px)
    우측: "+ New Project" 버튼 (var(--color-accent-primary) 배경, 흰색 텍스트, height: 36px, border-radius: 6px)
  
  메인 영역 (flex: 1):
    AG Grid 프로젝트 목록 (padding: 0 var(--spacing-lg))
```

### AG Grid 테마 커스텀

```css
/* memoQ 스타일 참고 — 클린한 비즈니스 그리드 */
.ag-theme-mehq {
  --ag-header-height: 36px;
  --ag-row-height: 44px;
  --ag-header-background-color: var(--color-bg-secondary);
  --ag-header-foreground-color: var(--color-text-secondary);
  --ag-header-cell-hover-background-color: var(--color-bg-tertiary);
  --ag-odd-row-background-color: var(--color-bg-primary);
  --ag-row-hover-color: #f0f4ff;
  --ag-selected-row-background-color: #e0eaff;
  --ag-range-selection-background-color: rgba(37, 99, 235, 0.1);
  --ag-font-family: var(--font-family-ui);
  --ag-font-size: var(--font-size-base);
  --ag-border-color: var(--color-border-default);
  --ag-row-border-color: #f0f0f0;
}
```

### 커스텀 셀 렌더러

```
StatusRenderer:
  - not-started: 빈 원 (border: 2px solid #9ca3af, 16x16px)
  - in-progress: 반쯤 채운 원 (#f59e0b)
  - translation-done: 채운 원 (#3b82f6)
  - r1-done: 체크 원 (#22c55e)
  - r2-done: 이중 체크 원 (#16a34a)
  - completed: 별 (#16a34a)

ProgressRenderer:
  - 가로 바 (width: 100%, height: 6px, border-radius: 3px)
  - 배경: var(--color-bg-tertiary)
  - 채움: gradient 기반 (0-30% #ef4444, 30-70% #f59e0b, 70-100% #22c55e)
  - 바 우측에 "45%" 텍스트 (font-size: var(--font-size-sm))

DeadlineRenderer:
  - 날짜 표시: "2026-04-15" 형태
  - 마감 3일 이내: color #f59e0b (경고)
  - 마감 초과: color #ef4444 + ⚠ 아이콘
  - 마감 없음: "—" 표시

LanguageRenderer:
  - "ko → en" 형태, → 기호 color var(--color-text-muted)
```

## Acceptance Criteria

- [ ] AG Grid가 Dashboard에 렌더링됨
- [ ] 프로젝트 목록이 DB에서 조회되어 그리드에 표시
- [ ] 모든 컬럼 헤더 클릭 시 정렬 동작 (오름/내림/해제)
- [ ] 검색 필터 입력 시 실시간 필터링 (name, client, domain)
- [ ] 프로젝트 더블클릭 → Project Home 전환 (빈 셸이라도)
- [ ] 우클릭 컨텍스트 메뉴 표시
- [ ] 프로젝트 없을 때 빈 상태 메시지 표시
- [ ] AG Grid 커스텀 테마 적용 (CSS 변수 사용)
- [ ] 커스텀 셀 렌더러 4종 동작

## QA Checklist

- [ ] 프로젝트 생성 후 Dashboard → 그리드에 새 프로젝트 표시
- [ ] 컬럼 정렬: Name 클릭 → 알파벳순, Created 클릭 → 날짜순
- [ ] 검색: "test" 입력 → 이름에 "test" 포함된 프로젝트만 표시
- [ ] 검색 지우기 → 전체 표시
- [ ] 더블클릭 → Project Home 전환
- [ ] 우클릭 → 컨텍스트 메뉴 (Open/Clone/Delete/Properties)
- [ ] 빈 상태: 프로젝트 없을 때 적절한 메시지

## Regression Checklist

- [ ] Sprint 2-1: New Project Wizard 정상 동작
- [ ] Phase 1: Welcome Wizard, 설정 저장/복원

## Known Gaps (memoQ 대비)

- memoQ의 Two-row view (Sub/Dom/Cli/Pro 서브 행)는 간소화 — 필요 시 Phase 13에서 추가
- memoQ의 Size 컬럼(Characters/Segments/Words)은 Phase 4 Document Import 후 추가
- 프로젝트 그룹핑/카테고리 기능은 제외

## Verification Questions (Generator가 구현 전에 확인)

- [ ] `ag-grid-community`와 `ag-grid-react`의 최신 안정 버전? React 19 호환?
- [ ] AG Grid Community에서 커스텀 셀 렌더러(React 컴포넌트)가 정상 동작하는가?

## Dependencies

- Sprint 2-1 완료 필수 (Project CRUD + DB)

## Out of Scope

- Details Pane (Sprint 2-3)
- 상태 아이콘 7단계 애니메이션 (Sprint 2-3)
- Clone/Delete 기능 (Sprint 2-3)
- Project Home 내용 (Sprint 2-4)
