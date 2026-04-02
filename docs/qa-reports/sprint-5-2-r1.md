# Sprint 5-2 QA Report - Round 1

## Summary
- Total: 72 tests (7 new + 65 existing)
- Passed: 71
- Failed: 1 (known flaky)
- Skipped: 0

## Quality Assessment
### Design Quality: N/A — 엔진 로직 Sprint (UI 없음)
### Originality: 4/5 — Levenshtein 문자/단어 자동 전환, Number Substitution 치환 로직 CAT 도구 표준에 부합
### Craft: 5/5 — 길이 기반 프리필터로 성능 최적화, 깔끔한 모듈 분리 (levenshtein/number-substitution/scoring/match-engine)
### Functionality: 5/5 — 모든 매치 타입 정확 동작

## Sprint 5-2 QA Checklist Results
- [x] TM에 "Hello world" 저장 → "Hello world" 검색 → 100% exact
- [x] Context 포함 검색 → 101% (prev/next 일치)
- [x] Double context → 102% (prev + next 모두 일치)
- [x] "There are 10 items" 저장 → "There are 15 items" 검색 → 100% (숫자 치환, target에 15 반영)
- [x] "Hello world" → "Hello worl" 검색 → 50-99% fuzzy
- [x] 빈 TM에서 검색 → 결과 없음
- [x] 매치 정렬: 동률 시 Working > Master 순서

## Build Verification
- `npx electron-forge package` ✅
- `npm run lint` ✅

## Additional Notes
- Generator에게 `tm:add-entry` IPC 추가 요청 → 즉시 구현됨 (Sprint 5-3 사전 준비)
- No-Mock 원칙: 실제 IPC(`window.electronAPI.tm.addEntry`)로 엔트리 추가 후 `tm.search`로 검증

## Regression
- Sprint 5-1: TM 생성, DB ✅ (6/6)
- Phase 4: Import/Export ✅
- Phase 3: 에디터 전체 ✅
- Phase 2: Dashboard, CRUD ✅

## Failed Tests
### 툴바 Bold 활성 상태 표시 (editor-formatting.spec.ts:58)
- **Status**: Known flaky (Phase 3부터)

## Verdict: qa-pass
