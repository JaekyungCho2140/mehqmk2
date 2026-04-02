# Sprint 5-6: E2E TM 통합 테스트

## Scope

Phase 5 TM 전체에 대한 E2E 테스트. TM 생성 → 번역 확인 → TM 저장 → TM 매치 표시 → 삽입 → Import/Export round-trip.

### 생성/수정할 파일

```
tests/e2e/tm-basic.spec.ts              # TM 생성, 프로젝트 연결
tests/e2e/tm-matching.spec.ts           # TM 매치 + 삽입
tests/e2e/tm-editor.spec.ts             # TM Editor 편집
tests/e2e/tm-import-export.spec.ts      # TM Import/Export
tests/e2e/helpers/selectors.ts          # (수정) TM 셀렉터
tests/e2e/helpers/test-utils.ts         # (수정) TM 헬퍼 함수
```

## E2E 테스트 시나리오 (12개)

```
tm-basic.spec.ts (3):
  1. TM 생성 → 목록에 표시
  2. 프로젝트에 TM 연결
  3. Wizard Step 3에서 TM 생성 + 연결

tm-matching.spec.ts (4):
  4. Ctrl+Enter → Working TM에 저장 확인
  5. 같은 source 세그먼트 → TM 100% 매치 표시
  6. 매치 더블클릭 → Target에 삽입
  7. Ctrl+Shift+Enter → TM 저장 안 됨 확인

tm-editor.spec.ts (3):
  8. TM Editor 열기 → 엔트리 표시
  9. 엔트리 편집 → Save → DB 반영
  10. Find&Replace 동작

tm-import-export.spec.ts (2):
  11. TMX Import → 엔트리 추가
  12. TMX Export → 파일 생성
```

## Acceptance Criteria

- [ ] `npm run test:e2e` → Phase 1~5 전체 통과
- [ ] Phase 5 E2E 12개 PASS
- [ ] 총 E2E: 59 + 12 = 71개
- [ ] lint + format 통과

## QA Checklist

- [ ] `npm run test:e2e` → 71개 전체 PASS
- [ ] TM 저장 → 매치 → 삽입 전체 플로우 검증

## Regression Checklist

- [ ] Phase 1~4 E2E 59개

## 완료 시 앱 상태

> TM 연동 완성: 확인 시 TM 저장, 세그먼트 이동 시 TM 매치 표시, TM Editor로 직접 편집.
