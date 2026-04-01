# Sprint 3-4: 번역 확인 로직 (Confirmation)

## Scope

Ctrl+Enter로 번역을 확인하고 다음 세그먼트로 이동하는 핵심 워크플로우를 구현한다. 상태 전이 로직, 자동 저장, 확인 변형(Ctrl+Shift+Enter 등)을 포함한다.

### 생성/수정할 파일

```
src/renderer/hooks/useConfirmation.ts              # 확인 로직 훅
src/renderer/components/editor/TipTapEditor.tsx    # (수정) Ctrl+Enter 핸들링
src/renderer/components/editor/SegmentGrid.tsx     # (수정) 상태 변경 반영
src/renderer/views/TranslationEditor.tsx           # (수정) 확인 로직 통합
src/shared/types/segment.ts                        # (수정) 확인 메타데이터
```

## 주요 동작 흐름

### 1. Ctrl+Enter: 번역 확인 + 다음 이동

```
입력: TipTap 에디터에서 Ctrl+Enter
과정:
  1. 현재 세그먼트의 target을 editor.getHTML()로 가져옴
  2. target이 빈 문자열이면 → 확인 불가 (무시)
  3. 세그먼트 상태 → 'confirmed'
  4. confirmedBy = user_settings.user_name
  5. confirmedAt = 현재 시각 (ISO 8601)
  6. AG Grid 행 갱신 (status, confirmedBy, confirmedAt)
  7. 다음 세그먼트로 이동 (Sprint 3-3 네비게이션 재사용)
  8. TipTap에 다음 세그먼트 target 로드 + 포커스
출력:
  - 현재 세그먼트 StatusBox → 초록(confirmed)
  - 다음 세그먼트가 EditPanel에 표시
  - TM 저장: Phase 5에서 구현 (현재는 상태 전이만)

Edge cases:
  - 마지막 세그먼트에서 Ctrl+Enter → 확인만, 이동 안 함
  - locked 세그먼트에서 Ctrl+Enter → 무시
  - 이미 confirmed 세그먼트에서 Ctrl+Enter → 상태 유지, 다음 이동
```

### 2. Ctrl+Shift+Enter: 번역 확인 (TM 저장 없이)

```
입력: Ctrl+Shift+Enter
동작: Ctrl+Enter와 동일하되 Phase 5의 TM 저장 단계를 건너뜀
현재: Ctrl+Enter와 동일 동작 (TM 미구현이므로)
구분 이유: Phase 5에서 TM 연동 시 분기 필요
```

### 3. Unconfirm (Ctrl+Shift+Enter on confirmed segment)

```
입력: confirmed 상태 세그먼트에서 Ctrl+Shift+Enter
출력: status → 'edited' (확인 해제), confirmedBy/At 초기화
```

### 4. 자동 저장 (Auto-save)

```
트리거: 세그먼트 전환 시 (이동, 확인 등)
과정: 현재 세그먼트의 target 값을 메모리 배열에 저장
Phase 4+: SQLite segments 테이블에 저장
현재: 메모리 내 세그먼트 배열 업데이트
```

## Acceptance Criteria

- [ ] Ctrl+Enter → 현재 세그먼트 confirmed + 다음 이동
- [ ] 빈 Target에서 Ctrl+Enter → 무시
- [ ] locked 세그먼트에서 Ctrl+Enter → 무시
- [ ] 확인 시 StatusBox 초록으로 변경
- [ ] confirmedBy에 사용자 이름 기록
- [ ] 마지막 세그먼트에서 Ctrl+Enter → 확인만, 이동 없음
- [ ] 이미 confirmed에서 Ctrl+Enter → 다음 이동만
- [ ] 세그먼트 전환 시 편집 내용 자동 저장 (메모리)

## QA Checklist

- [ ] 세그먼트 1 편집 → Ctrl+Enter → StatusBox 초록, 세그먼트 2로 이동
- [ ] 빈 세그먼트에서 Ctrl+Enter → 아무 변화 없음
- [ ] locked 세그먼트 → Ctrl+Enter → 아무 변화 없음
- [ ] 세그먼트 20(마지막)에서 Ctrl+Enter → confirmed, 이동 없음
- [ ] 여러 세그먼트 연속 Ctrl+Enter → 하나씩 확인되며 이동

## Regression Checklist

- [ ] Sprint 3-3: 키보드 네비게이션 전체
- [ ] Sprint 3-2: TipTap 편집, 동기화

## Dependencies

- Sprint 3-3 완료 필수

## Out of Scope

- TM 저장 (Phase 5)
- Auto-propagation (Phase 8)
- Confirm and Update Rows (Phase 8)
