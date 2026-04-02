# Sprint 6-7: E2E Results & Lookup 통합 테스트

## Scope

Phase 6 전체에 대한 E2E 테스트. Results Pane 표시 → 삽입 → AutoPick → Concordance 통합 검증.

### 생성/수정할 파일

```
tests/e2e/results-pane.spec.ts           # Results Pane 표시, 삽입, Compare
tests/e2e/auto-lookup.spec.ts            # Automatic Lookup + Auto-insert
tests/e2e/autopick.spec.ts              # AutoPick 메뉴
tests/e2e/concordance.spec.ts           # Concordance 검색
tests/e2e/fragment-assembly.spec.ts     # Fragment Assembly
tests/e2e/helpers/selectors.ts          # (수정) Phase 6 셀렉터
```

## E2E 테스트 시나리오 (14개)

```
results-pane.spec.ts (4):
  1. Results Pane 표시 + 3단 구조
  2. 결과 클릭 → CompareBox + MetaInfo
  3. 더블클릭 삽입
  4. Ctrl+1~9 삽입

auto-lookup.spec.ts (3):
  5. 세그먼트 이동 → Results 자동 갱신
  6. Auto-insert ON → 빈 Target에 자동 삽입
  7. Auto-insert ON + 편집된 Target → 삽입 안 됨

autopick.spec.ts (3):
  8. Ctrl 단독 → AutoPick 메뉴
  9. 숫자 인식 + 삽입
  10. Source 비어있음 → 메뉴 안 열림

concordance.spec.ts (2):
  11. Ctrl+K → Concordance 검색 + KWIC
  12. 와일드카드 검색

fragment-assembly.spec.ts (2):
  13. Fragment 결과 보라색 표시
  14. 커버리지 임계값 미달 → 결과 제외
```

## Acceptance Criteria

- [ ] Phase 6 E2E 14개 PASS
- [ ] Phase 1~6 전체 E2E 통과
- [ ] lint + format 통과

## 완료 시 앱 상태

> 세그먼트 이동 시 TM/Fragment 결과 자동 표시, 삽입, AutoPick, Concordance 검색. 전문 번역가 워크플로우의 핵심 기능 완성.
