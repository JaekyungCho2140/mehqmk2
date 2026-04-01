# Sprint 3-2: TipTap(ProseMirror) 편집 패널 통합

## Scope

EditPanel의 Target 영역을 textarea에서 TipTap 리치 텍스트 에디터로 교체한다. 기본 텍스트 입력, 포커스 관리, AG Grid와의 데이터 동기화를 구현한다. 이 Sprint에서 서식(B/I/U)은 아직 추가하지 않으며, 순수 텍스트 편집의 안정성을 먼저 확보한다.

> **기술 결정**: TipTap v3 (@tiptap/react + @tiptap/starter-kit) 사용. ProseMirror를 직접 사용하지 않고 TipTap으로 래핑. 필요 시 `editor.view`로 ProseMirror에 직접 접근 가능.

### 생성/수정할 파일

```
src/renderer/components/editor/EditPanel.tsx       # (수정) TipTap 에디터로 교체
src/renderer/components/editor/TipTapEditor.tsx    # TipTap 에디터 래퍼 컴포넌트
src/renderer/components/editor/SourceDisplay.tsx   # Source 읽기전용 표시 (HTML 렌더)
src/renderer/components/editor/extensions/         # TipTap 커스텀 확장 디렉토리
  index.ts                                         # 확장 목록 내보내기 (Phase 3 진행하며 추가)
src/renderer/styles/tiptap.css                     # TipTap 에디터 스타일
package.json                                       # (수정) TipTap 의존성 추가
```

## Technical Prerequisites (Planner 확인 — 2026-04-01 조사 완료)

- [x] TipTap v3.22.0: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/core`
- [x] `@tiptap/extension-underline` (StarterKit에 미포함, Sprint 3-5에서 추가)
- [x] TipTap의 `useEditor` 훅으로 React 통합
- [x] 외부 패널 패턴이므로 AG Grid와 포커스 충돌 없음
- [x] TipTap 인스턴스 1개만 상시 유지 (세그먼트 전환 시 content 교체)

### 설치

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/core @tiptap/pm
```

## 핵심 데이터 모델

Segment 타입의 `source`, `target` 필드는 HTML 문자열. TipTap은 HTML ↔ ProseMirror 문서를 자동 변환한다.

## 주요 동작 흐름

### 1. TipTap 에디터 초기화

```
입력: TranslationEditor 마운트
과정:
  1. useEditor({ extensions: [StarterKit.configure({ ... })], content: '' }) 호출
  2. TipTap EditorView 생성 (1회)
  3. 첫 세그먼트 선택 시 editor.commands.setContent(segment.target) 호출
출력: EditPanel Target 영역에 TipTap 에디터 렌더링
```

### 2. 세그먼트 전환 시 에디터 내용 교체

```
입력: AG Grid에서 다른 행 클릭
과정:
  1. 현재 세그먼트의 target을 editor.getHTML()로 저장
  2. 새 세그먼트의 target을 editor.commands.setContent(newSegment.target)로 로드
  3. 커서를 텍스트 끝으로 이동 (editor.commands.focus('end'))
출력:
  - EditPanel Source: 새 세그먼트의 source 표시
  - EditPanel Target: 새 세그먼트의 target으로 TipTap 내용 교체
  - 포커스: TipTap 에디터에 유지

주의:
  - setContent 전에 현재 내용 반드시 저장 (데이터 손실 방지)
  - 빈 target → 빈 에디터, placeholder "번역을 입력하세요..." 표시
```

### 3. 실시간 그리드 동기화

```
입력: TipTap 에디터에서 텍스트 입력/수정
과정:
  1. editor.on('update') 이벤트 리스너
  2. debounce 100ms로 AG Grid의 해당 행 target 값 갱신
  3. AG Grid api.refreshCells({ rowNodes: [currentNode], columns: ['target'] })
출력: AG Grid의 Target 셀이 실시간 업데이트
```

### 4. 세그먼트 상태 자동 변경

```
입력: 미시작(not-started) 세그먼트에서 첫 글자 입력
출력: status → 'edited', StatusBox 색상 분홍으로 변경
조건: status가 'not-started'일 때만 자동 변경. 이미 'edited' 이상이면 유지.
```

### 5. Undo/Redo

```
TipTap StarterKit에 History 확장 포함 → Ctrl+Z(Undo), Ctrl+Y(Redo) 자동 동작
범위: 현재 세그먼트 내에서만 (세그먼트 전환 시 history 초기화)
```

## 시각적 스펙

### TipTap 에디터 스타일

```css
/* EditPanel Target 영역 내 TipTap */
.tiptap-editor {
  padding: 8px 12px;
  font-size: 15px;
  line-height: 1.6;
  font-family: var(--font-family-ui);
  color: var(--color-text-primary);
  min-height: 60px;
  outline: none;
  cursor: text;
}

.tiptap-editor:focus {
  /* 포커스 인디케이터는 EditPanel 컨테이너에서 처리 */
}

/* Placeholder */
.tiptap-editor p.is-editor-empty:first-child::before {
  content: '번역을 입력하세요...';
  color: var(--color-text-muted);
  font-style: italic;
  pointer-events: none;
  float: left;
  height: 0;
}
```

### Source 표시 영역

```
HTML 직접 렌더링 (dangerouslySetInnerHTML 또는 sanitized HTML)
선택 가능 (Ctrl+C 복사 용도), 편집 불가
font-size: 15px, line-height: 1.6
color: var(--color-text-primary)
background: var(--color-bg-secondary)
padding: 8px 12px
user-select: text (선택 허용)
```

## Acceptance Criteria

- [ ] EditPanel Target에 TipTap 에디터 렌더링 (textarea 아님)
- [ ] 텍스트 입력/삭제/수정이 정상 동작
- [ ] 세그먼트 전환 시 에디터 내용이 올바르게 교체
- [ ] 이전 세그먼트의 편집 내용이 보존됨 (전환 후 돌아왔을 때 유지)
- [ ] 빈 Target에 placeholder 표시
- [ ] 실시간 그리드 동기화 (debounce 100ms)
- [ ] Ctrl+Z/Y Undo/Redo 동작
- [ ] TipTap 에디터에 자동 포커스 (세그먼트 선택 시)
- [ ] Source 영역: 텍스트 선택 가능, 편집 불가

## QA Checklist

- [ ] TipTap 에디터에서 한국어/영어/일본어 입력 정상
- [ ] 세그먼트 1 편집 → 세그먼트 2 클릭 → 세그먼트 1 다시 클릭 → 편집 내용 유지
- [ ] 빈 세그먼트 선택 → placeholder 보임 → 타이핑 시작 → placeholder 사라짐
- [ ] Ctrl+Z → 직전 입력 취소 / Ctrl+Y → 재실행
- [ ] AG Grid Target 셀이 편집에 맞춰 실시간 갱신
- [ ] 미시작 세그먼트 편집 → StatusBox 분홍으로 변경

## Regression Checklist

- [ ] Sprint 3-1: 세그먼트 그리드 표시, 행 선택, EditPanel Source 표시
- [ ] Phase 2: Dashboard, Project Home, CRUD
- [ ] Phase 1: E2E 전체 통과

## Known Gaps (memoQ 대비)

- B/I/U 서식은 Sprint 3-5에서 추가
- 인라인 태그 표시/편집은 Phase 8에서
- Source 편집(F2)은 Phase 8에서

## Verification Questions (Generator가 구현 전에 확인)

- [ ] `@tiptap/react`의 `useEditor` 훅이 `setContent` 호출 시 에디터를 파괴하지 않고 내용만 교체하는가?
- [ ] TipTap의 `onUpdate` 콜백에서 `editor.getHTML()`이 성능에 문제가 없는가? (매 키입력마다 호출)

## Dependencies

- Sprint 3-1 완료 필수

## Out of Scope

- B/I/U 서식 (Sprint 3-5)
- 키보드 네비게이션 (Sprint 3-3)
- 인라인 태그 (Phase 8)
- Track Changes (Phase 8)
