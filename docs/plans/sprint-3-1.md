# Sprint 3-1: AG Grid 세그먼트 그리드 + 편집 패널 셸

## Scope

번역 에디터의 핵심인 세그먼트 그리드를 AG Grid로 구현한다. 세그먼트 번호, Source(읽기전용), Target(읽기전용 표시), Status 박스 4열 구조. 그리드 아래에 편집 패널 셸(Source 읽기 + Target 편집 영역)을 배치한다. Phase 4까지 실제 문서가 없으므로 하드코딩된 샘플 세그먼트를 사용한다.

> **아키텍처 결정**: memoQ 패턴을 따라 **셀 외부 편집 패널** 방식을 채택. 그리드는 읽기 전용, 그리드 아래에 현재 세그먼트의 Source/Target을 표시하는 편집 패널을 배치. 이유: (1) memoQ 사용자에게 익숙한 UX (2) AG Grid와 TipTap 포커스 충돌 없음 (3) TipTap 인스턴스 1개만 유지하므로 성능 우수.

### 생성/수정할 파일

```
src/renderer/views/TranslationEditor.tsx           # 에디터 메인 뷰 (Grid + EditPanel + StatusBar)
src/renderer/components/editor/SegmentGrid.tsx     # AG Grid 세그먼트 그리드 (읽기전용)
src/renderer/components/editor/EditPanel.tsx       # 편집 패널 셸 (Source 읽기 + Target 편집 영역)
src/renderer/components/editor/columns.ts          # 세그먼트 그리드 컬럼 정의
src/renderer/components/editor/renderers/
  SegmentNumberRenderer.tsx                        # 세그먼트 번호 셀
  StatusBoxRenderer.tsx                            # Status 박스 셀
  SourceCellRenderer.tsx                           # Source 텍스트 셀 (읽기전용)
  TargetCellRenderer.tsx                           # Target 텍스트 셀 (읽기전용, 활성 행 하이라이트)
src/renderer/styles/editor.css                     # 에디터 전체 스타일
src/shared/types/segment.ts                        # Segment 타입 정의
src/renderer/App.tsx                               # (수정) editor 뷰 추가
src/renderer/views/project/GeneralTab.tsx          # (수정) "Open in Editor" 버튼 추가
tests/fixtures/sample-segments.ts                  # 하드코딩 샘플 세그먼트 (20개)
```

## Technical Prerequisites (Planner 확인)

- [x] AG Grid Community v35.2.0 이미 설치됨 (Phase 2)
- [x] AG Grid의 `rowSelection`, `onRowClicked` 등으로 행 선택 이벤트 사용 가능
- [x] 가상 스크롤은 AG Grid 기본 기능 (rowBuffer 조절로 성능 최적화)

## 핵심 데이터 모델

### Segment 타입

```typescript
// src/shared/types/segment.ts
export type SegmentStatus =
  | 'not-started'     // 미시작 (회색)
  | 'edited'          // 편집됨 (분홍)
  | 'pre-translated'  // 사전 번역 (파랑)
  | 'assembled'       // 조립됨 (보라)
  | 'confirmed'       // 번역자 확인 (초록)
  | 'r1-confirmed'    // R1 확인 (초록+)
  | 'r2-confirmed'    // R2 확인 (초록++)
  | 'locked'          // 잠금 (회색+자물쇠)
  | 'rejected';       // 거부 (빨강)

export interface Segment {
  id: string;
  index: number;         // 1-based 세그먼트 번호
  source: string;        // Source 텍스트 (HTML)
  target: string;        // Target 텍스트 (HTML)
  status: SegmentStatus;
  locked: boolean;
  matchRate: number | null;  // TM 매치율 (0-102), null이면 미매칭
  modified: boolean;     // 편집 여부
  confirmedBy: string | null;
  confirmedAt: string | null;
}
```

### 샘플 세그먼트 (tests/fixtures/sample-segments.ts)

```typescript
// 20개 세그먼트: 다양한 상태, 한국어↔영어 혼합
export const SAMPLE_SEGMENTS: Segment[] = [
  { id: 's1', index: 1, source: 'Hello, world!', target: '', status: 'not-started', locked: false, ... },
  { id: 's2', index: 2, source: 'Welcome to mehQ.', target: 'mehQ에 오신 것을 환영합니다.', status: 'confirmed', locked: false, ... },
  { id: 's3', index: 3, source: 'File menu', target: '파일 메뉴', status: 'edited', locked: false, ... },
  // ... 20개, 상태 다양 (not-started, edited, pre-translated, confirmed, locked 등)
];
```

## 주요 동작 흐름

### 1. 에디터 진입

```
입력: Project Home에서 "Open in Editor" 버튼 클릭 (또는 문서 더블클릭, Phase 4+)
과정:
  1. AppView → { type: 'editor', projectId, documentId }
  2. TranslationEditor 마운트
  3. 샘플 세그먼트 로드 (Phase 4까지 하드코딩)
  4. AG Grid에 세그먼트 렌더링
  5. 첫 번째 세그먼트 자동 선택 → EditPanel에 Source/Target 표시
출력: 3분할 레이아웃 (Grid + EditPanel + StatusBar)
```

### 2. 세그먼트 선택

```
입력: AG Grid에서 행 클릭
출력:
  1. 선택된 행 하이라이트 (배경색 변경)
  2. EditPanel의 Source 영역: 선택된 세그먼트의 source 텍스트 (읽기전용)
  3. EditPanel의 Target 영역: 선택된 세그먼트의 target 텍스트 (편집 가능, 이 Sprint에서는 textarea)
  4. Target 영역에 자동 포커스
```

### 3. Target 편집 (기본)

```
입력: EditPanel의 Target 영역에서 텍스트 입력/수정
출력:
  1. 입력한 텍스트가 실시간으로 AG Grid의 해당 행 Target 셀에도 반영
  2. 세그먼트 status가 'not-started'이면 → 'edited'로 자동 변경
  3. 세그먼트 modified = true

참고: Sprint 3-2에서 textarea를 TipTap 에디터로 교체
```

### 4. Dashboard로 복귀

```
입력: 상단 ← 버튼 또는 Breadcrumb "Dashboard" 클릭
출력: Dashboard로 전환 (변경사항은 메모리에 유지, Phase 4부터 DB 저장)
```

## 시각적 스펙

### TranslationEditor 레이아웃

```
전체 화면, 수직 3분할:

  상단 바 (height: 44px, border-bottom: 1px solid var(--color-border-default)):
    좌측: ← 버튼 + Breadcrumb "Dashboard / {프로젝트명} / Editor"
    우측: (Phase 4+에서 Save/Export 버튼)

  세그먼트 그리드 (flex: 1, min-height: 200px):
    AG Grid, 4열 구조

  편집 패널 (height: 180px, border-top: 2px solid var(--color-accent-primary)):
    Source 영역 (상단 절반, 88px)
    Target 영역 (하단 절반, 88px)
    리사이즈 핸들 (패널 높이 조절, 선택)

  Status Bar (height: 28px, border-top: 1px solid var(--color-border-default)):
    (Sprint 3-6에서 내용 추가, 현재는 빈 바)
```

### AG Grid 세그먼트 컬럼

```typescript
const columnDefs: ColDef<Segment>[] = [
  {
    field: 'index',
    headerName: '#',
    width: 52,
    cellRenderer: 'segmentNumberRenderer',
    sortable: false,
    resizable: false,
    pinned: 'left',
  },
  {
    field: 'status',
    headerName: '',
    width: 32,
    cellRenderer: 'statusBoxRenderer',
    sortable: false,
    resizable: false,
  },
  {
    field: 'source',
    headerName: 'Source',
    flex: 1,
    cellRenderer: 'sourceCellRenderer',
    sortable: false,
  },
  {
    field: 'target',
    headerName: 'Target',
    flex: 1,
    cellRenderer: 'targetCellRenderer',
    sortable: false,
  },
];
```

### 셀 렌더러 스타일

```
SegmentNumberRenderer:
  - 텍스트: 세그먼트 번호 (font-size: var(--font-size-sm), color: var(--color-text-muted))
  - 중앙 정렬

StatusBoxRenderer:
  - 12x12px 사각형 (border-radius: 2px)
  - 상태별 색상:
    not-started: #d1d5db (회색)
    edited: #f9a8d4 (분홍)
    pre-translated: #93c5fd (파랑)
    assembled: #c4b5fd (보라)
    confirmed: #86efac (초록)
    r1-confirmed: #4ade80 (진한 초록)
    r2-confirmed: #22c55e (더 진한 초록)
    locked: #9ca3af + 자물쇠 아이콘 (4px)
    rejected: #fca5a5 (빨강)
  - 더블클릭: Change Status 다이얼로그 (Sprint 3-7)

SourceCellRenderer:
  - 텍스트 왼쪽 정렬, padding: 0 8px
  - font-family: var(--font-family-ui)
  - color: var(--color-text-primary)
  - 배경: var(--color-bg-secondary) (Source는 항상 약간 어두운 배경)
  - overflow: hidden, text-overflow: ellipsis, white-space: nowrap

TargetCellRenderer:
  - 동일 스타일, 배경: var(--color-bg-primary)
  - 빈 Target: 이탤릭 + var(--color-text-muted)로 "(empty)" 표시
  - 활성 행: 좌측 border 3px solid var(--color-accent-primary)
```

### EditPanel 스타일

```
배경: var(--color-bg-primary)
border-top: 2px solid var(--color-accent-primary)

Source 영역:
  라벨: "Source" (font-size: 11px, font-weight: 600, color: var(--color-text-muted), padding: 4px 12px)
  텍스트: padding 8px 12px, font-size: 15px, line-height: 1.5
  배경: var(--color-bg-secondary) (읽기전용 느낌)
  선택 가능하지만 편집 불가

Target 영역:
  라벨: "Target" (동일)
  텍스트 영역: padding 8px 12px, font-size: 15px, line-height: 1.5
  배경: var(--color-bg-primary) (편집 가능 느낌)
  border: none, outline: none (깔끔한 편집 경험)
  포커스 시: 좌측에 2px solid var(--color-accent-primary) 인디케이터

구분선: Source와 Target 사이 1px solid var(--color-border-default)
```

## Acceptance Criteria

- [ ] Project Home에서 "Open in Editor" → TranslationEditor 뷰 표시
- [ ] AG Grid에 20개 샘플 세그먼트 렌더링 (번호/상태/Source/Target 4열)
- [ ] 세그먼트 클릭 → EditPanel에 Source/Target 표시
- [ ] EditPanel Target에서 텍스트 입력 → AG Grid 해당 행 실시간 반영
- [ ] 미시작 세그먼트 편집 시 상태 자동 'edited' 변경 + 분홍색 StatusBox
- [ ] 상태별 StatusBox 색상 9종 올바르게 렌더링
- [ ] Source 셀은 읽기전용 (클릭해도 편집 불가)
- [ ] ← → Dashboard 복귀

## QA Checklist

- [ ] Editor 진입 → 20개 세그먼트 표시, 첫 세그먼트 선택
- [ ] 행 클릭 → EditPanel Source/Target 갱신
- [ ] Target 편집 → Grid 실시간 반영
- [ ] 상태 색상 9종 확인 (샘플에 다양한 상태 포함)
- [ ] Source 셀 클릭 → 편집 불가
- [ ] ← → Dashboard 복귀
- [ ] 스크롤 동작 (20개이지만 가상 스크롤 구조 확인)

## Regression Checklist

- [ ] Phase 2: Dashboard, Project Home, CRUD, E2E 23개
- [ ] Phase 1: Welcome Wizard, 설정

## Known Gaps (memoQ 대비)

- memoQ는 실제 문서에서 세그먼트를 로드. Phase 4까지 하드코딩 세그먼트 사용
- Translation Results Pane(우측)은 Phase 6에서 추가
- View Pane(하단)은 Phase 12에서 추가
- 레이아웃 프리셋(F11)은 Phase 14에서

## Verification Questions (Generator가 구현 전에 확인)

- [ ] AppView에 `{ type: 'editor', projectId: string }` 추가 시 기존 뷰 전환 로직과 충돌 없는가?
- [ ] AG Grid의 `getRowId`로 세그먼트 ID를 지정하면 행 업데이트 시 전체 리렌더 방지 가능한가?

## Dependencies

- Phase 2 전체 완료 필수

## Out of Scope

- TipTap 리치 텍스트 편집 (Sprint 3-2)
- 키보드 네비게이션 (Sprint 3-3)
- 번역 확인 로직 (Sprint 3-4)
- 서식 (Sprint 3-5)
