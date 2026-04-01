# Sprint 3-7: 세그먼트 상태 시스템 + Change Status 다이얼로그

## Scope

9종 세그먼트 상태의 전체 시스템을 확립한다. Change Status 다이얼로그로 범위 기반 일괄 상태 변경, 세그먼트 잠금/해제(Ctrl+Shift+L), CSS 변수 기반 상태 색상 체계를 구현한다.

### 생성/수정할 파일

```
src/renderer/components/editor/ChangeStatusDialog.tsx  # 상태 변경 다이얼로그
src/renderer/components/editor/StatusBoxRenderer.tsx   # (수정) 더블클릭 → 다이얼로그 열기
src/renderer/hooks/useSegmentStatus.ts                 # 상태 관리 훅
src/renderer/views/TranslationEditor.tsx               # (수정) 잠금/상태 변경 통합
src/renderer/styles/editor.css                         # (수정) 상태별 CSS 변수
src/renderer/components/editor/EditPanel.tsx           # (수정) locked 세그먼트 편집 차단
```

## 주요 동작 흐름

### 1. Status Box 더블클릭 → Change Status 다이얼로그

```
입력: StatusBox 셀 더블클릭
출력: Change Status 다이얼로그
  범위: Active document (현재는 전체 세그먼트)
  필터: 변경할 상태 체크박스 (9종)
  대상 상태: 변경할 목표 상태 드롭다운
  "Apply" / "Cancel"

입력: 범위=Selected, 대상=confirmed → Apply
과정:
  1. 선택된 세그먼트들의 status → 'confirmed'
  2. confirmedBy/At 갱신
  3. Grid + StatusBar 갱신
출력: 선택 세그먼트 일괄 상태 변경
```

### 2. 세그먼트 잠금 (Ctrl+Shift+L)

```
입력: 세그먼트 선택 후 Ctrl+Shift+L
출력:
  - locked=false → locked=true:
    - StatusBox: #9ca3af + 자물쇠 아이콘
    - Grid 행 배경: var(--color-segment-locked-bg, #f3f4f6)
    - EditPanel Target: 읽기전용 (TipTap editable=false)
    - Ctrl+Enter 무시
  - locked=true → locked=false:
    - 이전 status 복원
    - 편집 가능

멀티 선택 시: 모든 선택 세그먼트에 토글 적용
```

### 3. 상태 색상 CSS 변수 체계

```css
:root {
  /* 세그먼트 상태 색상 — memoQ 기반 */
  --color-segment-not-started: #d1d5db;
  --color-segment-edited: #f9a8d4;
  --color-segment-pre-translated: #93c5fd;
  --color-segment-assembled: #c4b5fd;
  --color-segment-confirmed: #86efac;
  --color-segment-r1-confirmed: #4ade80;
  --color-segment-r2-confirmed: #22c55e;
  --color-segment-locked: #9ca3af;
  --color-segment-rejected: #fca5a5;

  /* 세그먼트 행 배경 */
  --color-segment-locked-bg: #f3f4f6;
  --color-segment-active-bg: #eff6ff;
}
```

## 시각적 스펙

### Change Status 다이얼로그

```
오버레이: rgba(0, 0, 0, 0.4)
다이얼로그: width 480px, bg var(--color-bg-primary), border-radius 12px, padding var(--spacing-xl)

제목: "Change Segment Status" (18px, 600)

범위 선택: 드롭다운
  - Active document (전체)
  - Selected segments
  - From cursor to end

필터 (현재 상태): 9개 체크박스 (2열 그리드)
  각 항목: 색상 원 12px + 상태명

대상 상태: 드롭다운 (9개 옵션, 색상 원 포함)

하단: "Apply" (primary) + "Cancel" (secondary)
```

## Acceptance Criteria

- [ ] StatusBox 더블클릭 → Change Status 다이얼로그 열림
- [ ] 범위 + 필터 + 대상 상태 설정 → Apply → 일괄 변경
- [ ] Ctrl+Shift+L → 잠금 토글 (단일/멀티)
- [ ] locked 세그먼트: 편집 불가, Ctrl+Enter 무시
- [ ] 모든 상태별 CSS 변수 정의, StatusBox 색상 정확
- [ ] 상태 변경 시 StatusBar 카운트 갱신

## QA Checklist

- [ ] StatusBox 더블클릭 → 다이얼로그 열림
- [ ] Selected segments → confirmed → Apply → 선택 세그먼트 초록
- [ ] Ctrl+Shift+L → 잠금 (배경 회색, 편집 불가) → 다시 → 해제
- [ ] locked 세그먼트에서 타이핑 → 입력 안 됨
- [ ] CSS 변수 9종 색상 확인

## Regression Checklist

- [ ] Sprint 3-6: StatusBar, 필터/정렬
- [ ] Sprint 3-5: 서식
- [ ] Sprint 3-4: Ctrl+Enter 확인

## Dependencies

- Sprint 3-6 완료 필수

## Out of Scope

- 언어 감지 자동 잠금 (Phase 13)
- Pre-translated 매치율 % 표시 (Phase 5)
