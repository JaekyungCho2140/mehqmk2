# Sprint 3-6: Status Bar + 필터링/정렬

## Scope

에디터 하단의 Status Bar에 완성도 %, 상태별 카운트를 표시한다. Source/Target 필터 박스와 정렬 기능을 추가하여 세그먼트를 효율적으로 탐색할 수 있게 한다.

### 생성/수정할 파일

```
src/renderer/components/editor/StatusBar.tsx       # Status Bar 컴포넌트
src/renderer/components/editor/FilterBar.tsx       # Source/Target 필터 바
src/renderer/components/editor/SegmentGrid.tsx     # (수정) 필터/정렬 통합
src/renderer/hooks/useSegmentStats.ts              # 세그먼트 통계 계산 훅
src/renderer/views/TranslationEditor.tsx           # (수정) StatusBar + FilterBar 통합
src/renderer/styles/statusbar.css                  # StatusBar 스타일
```

## 주요 동작 흐름

### Status Bar 표시

```
레이아웃 (좌→우):
  완성도: "45%" (confirmed+r1+r2 / 전체 * 100)
  구분선 |
  상태별 카운트: "TR:3 R1:1 R2:0 Ed:5 Rej:0 Empty:8 Pre:2 Frag:1"
    TR = confirmed, R1 = r1-confirmed, R2 = r2-confirmed
    Ed = edited, Rej = rejected, Empty = not-started
    Pre = pre-translated, Frag = assembled
  구분선 |
  현재 세그먼트: "Seg 3/20"

실시간 업데이트: 세그먼트 상태 변경 시 즉시 반영
```

### 필터

```
위치: AG Grid 상단에 필터 바

Source 필터: 텍스트 입력 → Source 열 필터
Target 필터: 텍스트 입력 → Target 열 필터
  - 실시간 필터 (debounce 200ms)
  - 대소문자 구분 토글 버튼 (Aa)
  - 정규식 토글 버튼 (.*)
  - Ctrl+Shift+F: 선택 텍스트로 필터 토글

필터 활성 시: Status Bar에 "필터: 5/20" 표시 (일치 수 / 전체)
```

### 정렬

```
정렬 메뉴 (FilterBar 우측 드롭다운):
  - No sorting (문서 순서, 기본)
  - Alphabetical (Source)
  - Alphabetical (Target)
  - Length (Source)
  - Row status
  - 오름차순/내림차순 토글

AG Grid의 내장 정렬 API 사용
```

## 시각적 스펙

### Status Bar

```
height: 28px
background: var(--color-bg-secondary)
border-top: 1px solid var(--color-border-default)
padding: 0 var(--spacing-md)
font-size: 12px
color: var(--color-text-secondary)

완성도: font-weight: 600, color: var(--color-text-primary)
구분선: 1px solid var(--color-border-default), height: 14px, margin: 0 12px
상태 카운트: 각 상태 약어 color는 해당 상태 색상 (TR=초록, Ed=분홍 등)
```

### FilterBar

```
height: 36px
background: var(--color-bg-primary)
border-bottom: 1px solid var(--color-border-default)

입력 필드: width: 200px, height: 28px, font-size: var(--font-size-sm)
  placeholder: "Source 필터..." / "Target 필터..."
토글 버튼: 20x20px, border-radius: 3px
정렬 드롭다운: width: 160px, 우측 정렬
```

## Acceptance Criteria

- [ ] Status Bar에 완성도 %, 상태별 카운트 표시
- [ ] 세그먼트 상태 변경 시 Status Bar 실시간 갱신
- [ ] Source/Target 필터 동작 (실시간)
- [ ] 대소문자 구분 토글
- [ ] 정렬 드롭다운 5개 옵션 동작
- [ ] 필터 시 "필터: N/M" 표시
- [ ] Ctrl+Shift+F 텍스트 필터 토글

## QA Checklist

- [ ] Status Bar 완성도 = (confirmed+r1+r2) / 전체 비율
- [ ] 세그먼트 Ctrl+Enter 확인 → Status Bar 카운트 갱신
- [ ] Source 필터 "Hello" → 해당 세그먼트만 표시
- [ ] 필터 지우기 → 전체 표시
- [ ] 정렬: Alphabetical(Source) → A-Z 순서
- [ ] No sorting → 원래 문서 순서 복원

## Regression Checklist

- [ ] Sprint 3-5: 서식 (B/I/U), 대소문자 변경
- [ ] Sprint 3-4: Ctrl+Enter 확인

## Dependencies

- Sprint 3-5 완료 필수

## Out of Scope

- Advanced Filters 4탭 (Phase 12)
- QA 에러 수 표시 (Phase 9)
- 편집 모드 표시 (Phase 8)
