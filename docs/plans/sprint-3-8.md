# Sprint 3-8: E2E 에디터 테스트

## Scope

Phase 3 Editor Core 전체에 대한 Playwright E2E 테스트를 작성한다. 세그먼트 이동, TipTap 편집, 확인, 서식, 상태 변경, 필터/정렬의 통합 플로우를 검증한다.

### 생성/수정할 파일

```
tests/e2e/editor-basic.spec.ts              # 에디터 기본: 진입, 그리드, EditPanel
tests/e2e/editor-navigation.spec.ts         # 키보드 네비게이션
tests/e2e/editor-confirmation.spec.ts       # 확인 로직
tests/e2e/editor-formatting.spec.ts         # 서식 + 텍스트 조작
tests/e2e/editor-status.spec.ts             # 상태 시스템 + 잠금
tests/e2e/editor-filter-sort.spec.ts        # 필터 + 정렬
tests/e2e/helpers/selectors.ts              # (수정) 에디터 셀렉터 추가
tests/e2e/helpers/test-utils.ts             # (수정) 에디터 헬퍼 함수
src/renderer/**/*.tsx                       # (수정) 누락 data-testid 추가
```

## E2E 테스트 시나리오

### editor-basic.spec.ts (5개)

```
테스트 1: "에디터 진입 — 세그먼트 그리드 표시"
테스트 2: "세그먼트 클릭 → EditPanel Source/Target 표시"
테스트 3: "Target 편집 → Grid 실시간 반영"
테스트 4: "빈 세그먼트 → placeholder 표시"
테스트 5: "← → Dashboard 복귀"
```

### editor-navigation.spec.ts (5개)

```
테스트 6: "Arrow Down → 다음 세그먼트 이동"
테스트 7: "Ctrl+Home → 첫 세그먼트 / Ctrl+End → 마지막"
테스트 8: "Tab → 다음 세그먼트"
테스트 9: "Page Down → 10개 이동"
테스트 10: "멀티 선택: Shift+Click"
```

### editor-confirmation.spec.ts (4개)

```
테스트 11: "Ctrl+Enter → 확인 + 다음 이동"
테스트 12: "빈 Target에서 Ctrl+Enter → 무시"
테스트 13: "locked 세그먼트에서 Ctrl+Enter → 무시"
테스트 14: "연속 Ctrl+Enter → 여러 세그먼트 확인"
```

### editor-formatting.spec.ts (4개)

```
테스트 15: "Ctrl+B → Bold 적용/해제"
테스트 16: "Ctrl+I → Italic"
테스트 17: "Ctrl+Shift+S → Source→Target 복사"
테스트 18: "Shift+F3 → 대소문자 순환"
```

### editor-status.spec.ts (3개)

```
테스트 19: "StatusBox 더블클릭 → Change Status 다이얼로그"
테스트 20: "Ctrl+Shift+L → 잠금/해제 토글"
테스트 21: "locked 세그먼트 → 편집 불가"
```

### editor-filter-sort.spec.ts (3개)

```
테스트 22: "Source 필터 → 일치 세그먼트만 표시"
테스트 23: "정렬: Alphabetical(Source)"
테스트 24: "StatusBar 카운트 정확성"
```

## Acceptance Criteria

- [ ] `npm run test:e2e` → Phase 1 + 2 + 3 E2E 전체 통과
- [ ] Phase 3 E2E 24개 전체 PASS
- [ ] 총 E2E: Phase 1(7) + Phase 2(16) + Phase 3(24) = 47개
- [ ] 모든 에디터 인터랙션 요소에 data-testid 부여
- [ ] `npm run lint` + `npm run format:check` 통과

## QA Checklist

- [ ] `npm run test:e2e` → 47개 전체 PASS
- [ ] `npm run lint` → 에러 0
- [ ] `npm run format:check` → 위반 0
- [ ] 실패 시 스크린샷 생성 확인

## Regression Checklist

- [ ] Phase 1 E2E 7개
- [ ] Phase 2 E2E 16개
- [ ] Phase 3 Sprint 3-1~3-7 기능

## Dependencies

- Sprint 3-1~3-7 전체 완료 필수

## Out of Scope

- 성능 벤치마크 (Phase 14)
- 인라인 태그 테스트 (Phase 8)
