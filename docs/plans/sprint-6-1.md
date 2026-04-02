# Sprint 6-1: Translation Results Pane — 3단 레이아웃

## Scope

에디터 우측에 Translation Results Pane을 배치한다. 3단 구조(결과 목록 + 비교 박스 + 메타 정보)를 구현하고, Sprint 5-3의 임시 MatchList를 이 Pane으로 대체한다. TM 매치 결과를 전문적인 UI로 표시한다.

### 생성/수정할 파일

```
src/renderer/components/results/ResultsPane.tsx       # Results Pane 메인 컨테이너
src/renderer/components/results/ResultsList.tsx        # 결과 목록 (상단)
src/renderer/components/results/CompareBox.tsx         # 비교 박스 (중단)
src/renderer/components/results/MetaInfo.tsx           # 메타 정보 (하단)
src/renderer/components/results/ResultItem.tsx         # 개별 결과 항목
src/renderer/views/TranslationEditor.tsx               # (수정) 레이아웃: Grid+EditPanel(좌) + ResultsPane(우)
src/renderer/components/editor/MatchList.tsx            # (삭제 또는 비활성) 임시 MatchList 제거
src/renderer/styles/results.css                        # Results Pane 스타일
```

## 주요 동작 흐름

### 1. 에디터 레이아웃 변경

```
변경 전 (Phase 3~5):
  [         Grid          ]
  [      EditPanel        ]
  [      StatusBar        ]

변경 후:
  [     Grid      ][ Results ]
  [   EditPanel   ][  Pane   ]
  [    StatusBar             ]

Results Pane:
  - 기본 width: 360px
  - 최소 width: 280px
  - 리사이즈 핸들 (좌측 테두리 드래그)
  - 접기/펼치기 토글 (F12 또는 View 메뉴)
```

### 2. Results Pane 3단 구조

```
상단 — 결과 목록 (flex: 1, min-height: 120px):
  각 항목: 번호(1~9) + 매치율 배지 + Source 미리보기 (1줄)
  선택 항목: 하이라이트 배경
  Ctrl+Up/Down: 결과 간 이동
  더블클릭 또는 Ctrl+1~9: 삽입

중단 — 비교 박스 (height: 140px):
  선택된 결과의 Source와 현재 세그먼트 Source 비교
  Traditional Compare: 검정=동일, 빨강=차이, 파랑=누락
  
하단 — 메타 정보 (height: 80px):
  TM 이름, 생성자, 수정일, 문서명, 프로젝트명
  Role 표시 (Working/Master/Reference)
```

### 3. 결과 삽입

```
입력: 결과 더블클릭, Ctrl+Space(최상위), Ctrl+1~9(번호)
과정:
  1. 선택된 TmMatch의 target을 TipTap에 setContent
  2. 세그먼트 status → 'pre-translated'
  3. match_rate 기록
출력: Target에 TM 번역 삽입
```

## 시각적 스펙

### Results Pane

```
배경: var(--color-bg-primary)
border-left: 1px solid var(--color-border-default)
padding: 0

상단 헤더: height 32px, "Translation Results" 텍스트 + 결과 수
  font-size: 12px, font-weight: 600, padding: 0 12px
  배경: var(--color-bg-secondary)
```

### ResultItem

```
height: 52px, padding: 8px 12px
border-bottom: 1px solid #f0f0f0
hover: background #f8f9fa

좌측: 번호 (14px, bold, color var(--color-text-muted), width: 20px)
중앙:
  1행: 매치율 배지 (인라인) + TM 이름 (font-size: 11px, color muted)
  2행: Source 미리보기 (font-size: 13px, overflow ellipsis)
매치율 배지:
  102%: bg #16a34a, 101%: bg #22c55e, 100%: bg #3b82f6
  85-99%: bg #60a5fa, 50-84%: bg #f59e0b
  padding: 1px 6px, border-radius: 3px, font-size: 11px, color #fff

선택 항목: background #eff6ff, border-left: 3px solid var(--color-accent-primary)
```

### CompareBox

```
border-top: 1px solid var(--color-border-default)
padding: 8px 12px
font-size: 14px, line-height: 1.5

차이 표시:
  동일 텍스트: color var(--color-text-primary)
  차이(변경/추가): color #ef4444, background #fef2f2
  누락(삭제): color #3b82f6, text-decoration line-through
```

### MetaInfo

```
border-top: 1px solid var(--color-border-default)
padding: 8px 12px
font-size: 12px, color var(--color-text-muted)

2열 그리드:
  TM: "My TM (Working)"
  Created: "홍길동, 2026-04-01"
  Modified: "2026-04-02"
  Document: "sample.xliff"
```

## Acceptance Criteria

- [ ] Results Pane이 에디터 우측에 표시
- [ ] 세그먼트 이동 → TM 매치 결과가 ResultsList에 표시
- [ ] 결과 클릭 → CompareBox에 비교, MetaInfo에 상세
- [ ] Ctrl+Up/Down → 결과 간 이동
- [ ] 더블클릭/Ctrl+1~9 → Target에 삽입
- [ ] Ctrl+Space → 최상위 결과 삽입
- [ ] F12 → Results Pane 접기/펼치기
- [ ] 리사이즈 핸들 동작
- [ ] 임시 MatchList 제거

## QA Checklist

- [ ] 에디터 레이아웃: Grid+EditPanel(좌) + ResultsPane(우)
- [ ] TM 매치 표시 → 결과 클릭 → Compare + Meta 갱신
- [ ] 삽입 (더블클릭, Ctrl+1, Ctrl+Space) → Target 반영
- [ ] F12 → Pane 토글
- [ ] Results 없을 때 → "매치 없음" 메시지

## Regression Checklist

- [ ] Phase 5: TM 전체 (매칭, Editor, Import/Export)
- [ ] Phase 3~4: 에디터, Import/Export

## Dependencies

- Phase 5 전체 완료 필수

## Out of Scope

- 색상 코딩 7종 (Sprint 6-2)
- 램프 표시 (Sprint 6-2)
- Automatic Lookup (Sprint 6-3)
- AutoPick (Sprint 6-4)
- Concordance (Sprint 6-5)
