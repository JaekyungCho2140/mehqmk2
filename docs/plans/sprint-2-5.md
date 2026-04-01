# Sprint 2-5: E2E 프로젝트 CRUD 전체 플로우

## Scope

Phase 2 전체 기능에 대한 Playwright E2E 테스트를 작성한다. 프로젝트 생성 → Dashboard 목록 → Details Pane → Clone → Delete → Project Home → Settings 편집의 전체 플로우를 검증한다. 기존 Sprint 1-4의 E2E 인프라를 확장한다.

### 생성/수정할 파일

```
tests/e2e/project-crud.spec.ts          # 프로젝트 생성/조회/수정/삭제
tests/e2e/dashboard-grid.spec.ts        # AG Grid 정렬, 검색, 컨텍스트 메뉴
tests/e2e/project-home.spec.ts          # Project Home 탭 전환, Settings 편집
tests/e2e/helpers/selectors.ts          # (수정) Phase 2 셀렉터 추가
tests/e2e/helpers/test-utils.ts         # 공통 유틸: 프로젝트 생성 헬퍼 함수
src/renderer/**/*.tsx                   # (수정) 누락된 data-testid 추가
```

## Technical Prerequisites (Planner 확인)

- [x] Sprint 1-4의 Playwright Electron 인프라 재사용 (launch/close, DB 격리)
- [x] data-testid 기반 셀렉터 패턴 유지

## data-testid 추가 목록

```
# Dashboard
dashboard-new-project-btn
dashboard-search-input
dashboard-grid
dashboard-empty-message
dashboard-details-pane

# New Project Wizard
new-project-name-input
new-project-source-lang
new-project-target-lang
new-project-client-input
new-project-deadline-input
new-project-finish-btn
new-project-cancel-btn
new-project-name-error

# AG Grid 행 (row data attribute)
[data-project-id="{id}"]

# Details Pane
details-pane-name
details-pane-status
details-pane-languages
details-pane-open-btn
details-pane-clone-btn
details-pane-delete-btn

# Clone Dialog
clone-dialog
clone-name-input
clone-confirm-btn
clone-cancel-btn

# Confirm Dialog (Delete)
confirm-dialog
confirm-dialog-delete-btn
confirm-dialog-cancel-btn

# Project Home
project-home-container
project-home-back-btn
project-home-breadcrumb
project-home-tab-general
project-home-tab-reports
project-home-tab-settings

# Settings Tab
settings-name-input
settings-save-btn
settings-cancel-btn
toast-message
```

## E2E 테스트 시나리오

### project-crud.spec.ts

```
테스트 1: "프로젝트 생성 — 전체 필드"
  - "+ New Project" 클릭
  - Name: "테스트 프로젝트", Source: ko, Target: en, Client: "Acme", Deadline: 내일 날짜
  - Finish → Dashboard로 복귀
  - 그리드에 "테스트 프로젝트" 행 존재 확인

테스트 2: "프로젝트 생성 — 최소 필드"
  - Name: "최소 프로젝트", Source: en, Target: ko
  - Finish → 성공

테스트 3: "프로젝트 생성 — 중복 이름 에러"
  - 테스트 1에서 생성한 프로젝트와 동일 이름 입력
  - Finish → 에러 메시지 표시, Dashboard 전환 안 됨

테스트 4: "프로젝트 생성 — Cancel"
  - 폼 입력 후 Cancel
  - Dashboard 복귀, 새 프로젝트 없음

테스트 5: "프로젝트 Clone"
  - 프로젝트 행 우클릭 → Clone
  - 기본 이름 "{원본} - clone" 확인
  - Clone → 목록에 추가

테스트 6: "프로젝트 Delete"
  - 프로젝트 행 우클릭 → Delete
  - 확인 다이얼로그 → Delete
  - 목록에서 제거 확인

테스트 7: "프로젝트 Delete — Cancel"
  - Delete → 확인 다이얼로그 → Cancel
  - 프로젝트 여전히 존재

테스트 8: "프로젝트 영속성"
  - 프로젝트 생성 → 앱 종료 → 재시작
  - Dashboard에 프로젝트 표시
```

### dashboard-grid.spec.ts

```
테스트 9: "AG Grid 정렬 — Name 컬럼"
  - 프로젝트 3개 생성 (A, B, C)
  - Name 헤더 클릭 → A, B, C 순서 확인
  - 다시 클릭 → C, B, A 역순 확인

테스트 10: "검색 필터"
  - 프로젝트 3개 생성 (alpha, beta, gamma)
  - "alpha" 입력 → 1개만 표시
  - 검색 지우기 → 3개 모두 표시

테스트 11: "프로젝트 클릭 → Details Pane"
  - 프로젝트 클릭 → Details Pane 표시
  - 프로젝트 이름, 상태 등 확인
  - 다른 프로젝트 클릭 → Details Pane 내용 갱신

테스트 12: "프로젝트 더블클릭 → Project Home"
  - 프로젝트 더블클릭 → Project Home 표시
  - project-home-container 존재 확인
```

### project-home.spec.ts

```
테스트 13: "General 탭 정보 표시"
  - Project Home 진입
  - 프로젝트 이름, 언어, 생성 정보 확인

테스트 14: "탭 전환"
  - General → Reports → Settings 순서 클릭
  - 각 탭 내용 영역 변경 확인

테스트 15: "Settings 탭 — 이름 변경"
  - Settings 탭 → Name 필드 수정 → Save
  - toast-message "저장되었습니다" 표시
  - ← Dashboard 복귀 → 변경된 이름 확인

테스트 16: "← 버튼 → Dashboard 복귀"
  - Project Home에서 ← 클릭
  - Dashboard 표시 확인
```

## Acceptance Criteria

- [ ] `npm run test:e2e` 실행 시 Phase 1 + Phase 2 E2E 전체 통과
- [ ] 프로젝트 CRUD 전체 플로우 (생성/조회/수정/삭제/복제) 테스트 커버
- [ ] AG Grid 정렬, 검색, Details Pane 테스트 커버
- [ ] Project Home 탭 전환, Settings 편집 테스트 커버
- [ ] 테스트 간 DB 격리
- [ ] 누락된 data-testid 전부 추가

## QA Checklist

- [ ] `npm run test:e2e` → 모든 테스트 PASS (Phase 1 7개 + Phase 2 16개 = 23개)
- [ ] `npm run lint` → 에러 0
- [ ] `npm run format:check` → 포맷 위반 0
- [ ] 테스트 실패 시 스크린샷 생성 확인

## Regression Checklist

- [ ] Phase 1 E2E 7개 전체 통과
- [ ] Sprint 2-1~2-4 기능 E2E로 검증

## Known Gaps (memoQ 대비)

- Documents Import/Export 플로우는 Phase 4 E2E에서
- TM/TB 연동 플로우는 Phase 5/7 E2E에서

## Dependencies

- Sprint 2-1~2-4 전체 완료 필수

## Out of Scope

- 성능 테스트
- 비주얼 리그레션 테스트
- CI/CD 통합
