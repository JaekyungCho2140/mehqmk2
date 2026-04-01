# Sprint 3-2 QA Report - Round 1

## Summary
- Total: 6 QA checklist + 3 regression
- Passed: 7
- Failed: 1 (MEDIUM)
- Skipped: 1

## Quality Assessment
### Design Quality: 4/5 — TipTap 에디터 영역 깔끔, placeholder "번역을 입력하세요..." 적절. Source 읽기전용 표시 명확.
### Originality: 4/5 — TipTap 통합으로 리치 텍스트 기반 편집 가능. memoQ 패턴 유지.
### Craft: 3/5 — TipTap 편집 자체는 우수하나, Grid Target 셀에 HTML 태그가 raw로 노출되는 버그.
### Functionality: 4/5 — 편집, 세그먼트 전환, 콘텐츠 유지 동작하나, Grid 표시 버그로 감점.

## QA Checklist
- [x] TipTap 에디터에서 영어 입력 정상 ("TipTap test input")
- [x] 세그먼트 1 편집 → 세그먼트 2 클릭 → 세그먼트 1 다시 클릭 → 편집 내용 유지
- [x] 빈 세그먼트 선택 → placeholder "번역을 입력하세요..." 보임 → 타이핑 시작 → placeholder 사라짐
- [ ] ⏭ Ctrl+Z/Y Undo/Redo — TipTap StarterKit History 포함이므로 동작 가정 (computer-use에서 Cmd+Z가 select-all로 동작하여 정확한 검증 어려움)
- [x] 미시작 세그먼트 편집 → StatusBox 분홍으로 변경 (Sprint 3-1에서 검증 완료, 로직 동일)
- [x] **FAIL** — AG Grid Target 셀이 HTML raw 텍스트로 표시됨 (`<p>TipTap test input</p>`)

## MEDIUM Bug: Grid Target 셀 HTML raw 표시

### 증상
- TipTap 에디터에서 텍스트 입력 시, Grid의 Target 셀에 `<p>텍스트</p>` 형태로 HTML 태그가 그대로 표시됨
- 빈 세그먼트: `<p></p>` 표시
- 편집된 세그먼트: `<p>TipTap test input</p>` 표시

### 원인
- TipTap은 내부적으로 HTML을 사용 (`editor.getHTML()` → `<p>텍스트</p>`)
- Grid의 TargetCellRenderer가 이 HTML 문자열을 텍스트로 렌더링 (innerHTML이 아닌 textContent)

### Suggested Fix
TargetCellRenderer에서 HTML을 strip하거나 innerHTML로 렌더링:
```typescript
// 옵션 1: HTML strip (간단)
const text = html.replace(/<[^>]*>/g, '');

// 옵션 2: innerHTML 사용 (서식 유지)
<span dangerouslySetInnerHTML={{ __html: value }} />
```

## Regression Checklist
- [x] Sprint 3-1: 세그먼트 그리드 표시, 행 선택, EditPanel Source 표시
- [x] Phase 2: E2E 23/23 PASS, Dashboard/CRUD/Project Home
- [x] Phase 1: E2E 포함

## Build & Automation
- `tsc --noEmit`: 3프로세스 통과 ✅
- `npm run test:e2e`: 23/23 PASS ✅
- `npm run lint`: 에러 0, 경고 2 ✅
- `npm run format:check`: 100% ✅
- `npx electron-forge package`: 성공 ✅

## Verdict: qa-fail

**MEDIUM**: Grid Target 셀에 HTML 태그가 raw로 표시됨. Generator가 TargetCellRenderer를 수정하여 HTML을 적절히 처리한 후 재검증 필요.
