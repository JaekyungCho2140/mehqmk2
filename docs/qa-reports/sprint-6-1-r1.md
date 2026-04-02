# Sprint 6-1 QA Report - Round 1

## Summary
- Total: 5 new tests
- Passed: 4
- Failed: 1
- Skipped: 0

## Quality Assessment
### Design Quality: 4/5 — 3단 레이아웃 깔끔, F12 토글, 리사이즈 핸들
### Originality: 4/5 — memoQ Results Pane 패턴 충실
### Craft: 3/5 — 삽입 기능 미동작 (더블클릭/Ctrl+1)
### Functionality: 3/5 — 삽입 기능 실패

## Sprint 6-1 QA Checklist Results
- [x] 에디터 레이아웃: Grid+EditPanel(좌) + ResultsPane(우)
- [x] TM 매치 표시 → 결과 클릭 → Compare + Meta 갱신
- [ ] 삽입 (더블클릭, Ctrl+1) → Target 반영 ❌ 실패
- [x] F12 → Pane 토글
- [x] Results 없을 때 → "매치 없음" 메시지

## Failed Tests
### 삽입: Ctrl+1 → Target 반영
- **Expected**: ResultItem 더블클릭 또는 Ctrl+1 → TipTap에 매치 target 삽입
- **Actual**: TipTap textContent 빈 문자열
- **Root Cause**: ResultItem의 더블클릭 핸들러가 useTmIntegration.insertMatch()에 연결되지 않은 것으로 추정
- **Suggested Fix**: ResultsPane에서 onInsert prop을 통해 insertMatch 연결 확인

## Verdict: qa-fail
