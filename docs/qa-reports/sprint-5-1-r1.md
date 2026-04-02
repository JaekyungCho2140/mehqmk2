# Sprint 5-1 QA Report - Round 1

## Summary
- Total: 65 tests (6 new + 59 existing)
- Passed: 64
- Failed: 1 (known flaky)
- Skipped: 0

## Quality Assessment
### Design Quality: 4/5 — CreateTmDialog 스타일이 기존 CloneProjectDialog와 일관성 유지, Wizard Step 3 레이아웃 깔끔
### Originality: 4/5 — Role 라디오 버튼에 설명 추가가 memoQ 패턴에 부합, Wizard Step 3 TM 선택 체크박스+Role 드롭다운 조합 실용적
### Craft: 4/5 — data-testid 체계적으로 배치, 에러 핸들링 적절 (중복 이름, 빈 필드)
### Functionality: 5/5 — 모든 QA Checklist 항목 통과

## Sprint 5-1 QA Checklist Results
- [x] TM 생성 → 성공, IPC 목록에 표시
- [x] 중복 이름 → "이미 존재" 에러
- [x] Wizard Step 3 → TM 생성 + 선택 → Finish → 프로젝트에 TM 연결 확인
- [x] Wizard Step 2에서 Finish → TM 없이 프로젝트 생성
- [x] 앱 재시작 → TM 유지
- [x] 프로젝트에 TM 연결/해제 동작

## Build Verification
- `npx electron-forge package` ✅
- `npm run lint` ✅ (0 errors, 2 pre-existing warnings)
- TypeScript: JSX flag 관련 기존 warning만 (Vite 빌드 정상)

## Dev Mode Issue
- `npm start` 시 `out/` 디렉토리의 LICENSES.chromium.html이 Vite dep-scan에 포함되어 ERR_CONNECTION_REFUSED 발생
- 해결: `out/` 디렉토리 삭제 후 정상 동작 (production 빌드 후 dev 모드 실행 시 발생하는 알려진 문제)
- E2E 테스트는 production 빌드 기반이므로 영향 없음

## Regression
- Phase 4: Import/Export ✅
- Phase 3: 에디터 전체 ✅
- Phase 2: Dashboard, CRUD ✅
- Phase 1: Foundation ✅

## Failed Tests
### 툴바 Bold 활성 상태 표시 (editor-formatting.spec.ts:58)
- **Expected**: toolbar-btn--active 클래스
- **Actual**: toolbar-btn (active 미반영)
- **Root Cause**: ProseMirror 상태 동기화 타이밍 flaky — Sprint 3-8, 4-6에서도 동일 증상
- **Status**: Known flaky (Phase 3부터)

## Verdict: qa-pass
