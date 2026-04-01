# Sprint 4-6: E2E Import→편집→Export Round-trip

## Scope

Phase 4 전체에 대한 E2E 테스트를 작성한다. XLIFF Import → 에디터에서 편집 → 확인 → Export → 재Import round-trip의 통합 검증.

### 생성/수정할 파일

```
tests/e2e/import-xliff.spec.ts          # XLIFF Import + 에디터 연동
tests/e2e/import-po.spec.ts             # PO Import
tests/e2e/export-roundtrip.spec.ts      # Export + 재Import round-trip
tests/e2e/import-wizard.spec.ts         # Wizard Documents 단계
tests/e2e/helpers/selectors.ts          # (수정) Phase 4 셀렉터
tests/e2e/helpers/test-utils.ts         # (수정) Import 헬퍼 함수
```

## E2E 테스트 시나리오 (12개)

```
import-xliff.spec.ts (3):
  1. XLIFF 1.2 Import → 에디터에 세그먼트 표시
  2. XLIFF 2.0 Import → 에디터에 세그먼트 표시
  3. Import 후 앱 재시작 → 세그먼트 유지 (DB 영속)

import-po.spec.ts (2):
  4. PO Import → 에디터에 세그먼트 표시
  5. PO 복수형 → 별도 세그먼트

export-roundtrip.spec.ts (4):
  6. XLIFF Import → 편집 → Export → 파일 존재 확인
  7. XLIFF Export → 재Import → Source 일치
  8. PO Export → 재Import → Source 일치
  9. confirmed 세그먼트 → Export 시 상태 반영

import-wizard.spec.ts (3):
  10. Wizard Step 2 → 드래그앤드롭/Import → Finish → 프로젝트+세그먼트 생성
  11. 지원하지 않는 형식 → 경고
  12. Import Settings 다이얼로그 → 필터 수동 선택
```

## Acceptance Criteria

- [ ] `npm run test:e2e` → Phase 1+2+3+4 전체 통과
- [ ] Phase 4 E2E 12개 PASS
- [ ] 총 E2E: 47 + 12 = 59개
- [ ] lint + format 통과

## QA Checklist

- [ ] `npm run test:e2e` → 59개 전체 PASS
- [ ] Round-trip 무손실 검증 (자동화)
- [ ] Import → 편집 → Export 전체 플로우

## Regression Checklist

- [ ] Phase 1+2+3 E2E 47개

## Dependencies

- Sprint 4-1~4-5 전체 완료 필수

## 완료 시 앱 상태

> **최소 CAT 도구 완성**: XLIFF/PO Import → 번역 편집 → 확인 → Export.
> 이 시점부터 실제 번역 작업에 사용 가능한 수준.
