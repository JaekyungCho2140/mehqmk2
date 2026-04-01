# Sprint 3-3: 키보드 네비게이션

## Scope

AG Grid 세그먼트 그리드와 EditPanel 간의 키보드 네비게이션을 구현한다. 세그먼트 간 이동, 셀 간 포커스, 멀티 세그먼트 선택을 포함한다.

### 생성/수정할 파일

```
src/renderer/components/editor/SegmentGrid.tsx     # (수정) 키보드 이벤트 핸들링
src/renderer/components/editor/EditPanel.tsx       # (수정) 키보드 이벤트 핸들링
src/renderer/components/editor/TipTapEditor.tsx    # (수정) 에디터 내 키 이벤트 처리
src/renderer/hooks/useEditorNavigation.ts          # 네비게이션 로직 훅
src/renderer/views/TranslationEditor.tsx           # (수정) 네비게이션 상태 관리
```

## 주요 동작 흐름

### 키보드 단축키

```
세그먼트 간 이동:
  Arrow Up/Down (Grid 포커스 시): 이전/다음 세그먼트로 이동 → EditPanel 갱신
  Ctrl+Home: 문서 첫 세그먼트로 이동
  Ctrl+End: 문서 마지막 세그먼트로 이동
  Page Up/Down: 화면 단위(10개) 이동

EditPanel 내 이동:
  Tab: Source→Target 또는 Target→다음 세그먼트 Target으로 이동
  Shift+Tab: 이전 세그먼트 Target으로 이동
  Ctrl+Page Up: 현재 세그먼트 Target 텍스트 시작으로
  Ctrl+Page Down: 현재 세그먼트 Target 텍스트 끝으로

단어 단위 이동 (TipTap 내):
  Ctrl+Left/Right: 단어 단위 커서 이동 (TipTap 기본 동작)

멀티 세그먼트 선택:
  Shift+Click (세그먼트 번호 열): 범위 선택
  Ctrl+Shift+A: 전체 세그먼트 선택
  Ctrl+Shift+Home: 현재부터 첫 세그먼트까지 선택
  Ctrl+Shift+End: 현재부터 마지막 세그먼트까지 선택
```

### 핵심 동작 상세

```
Arrow Down (Grid 포커스 시):
  입력: 사용자가 Arrow Down 누름
  과정:
    1. 현재 세그먼트 target 저장 (editor.getHTML())
    2. 다음 세그먼트로 이동 (index+1)
    3. EditPanel 내용 교체
    4. TipTap 에디터에 포커스 + 커서 텍스트 끝
  출력: 다음 세그먼트의 Source/Target이 EditPanel에 표시
  Edge case: 마지막 세그먼트 → 무시 (이동 안 함)

Tab (EditPanel Target 포커스 시):
  입력: TipTap 에디터에서 Tab 누름
  과정:
    1. Tab의 기본 동작 방지 (preventDefault)
    2. 현재 target 저장
    3. 다음 세그먼트로 이동
    4. TipTap에 새 내용 로드 + 포커스
  출력: 다음 세그먼트 편집 시작
```

## Acceptance Criteria

- [ ] Arrow Up/Down으로 세그먼트 이동 + EditPanel 갱신
- [ ] Ctrl+Home/End로 첫/마지막 세그먼트 이동
- [ ] Page Up/Down으로 10개 단위 이동
- [ ] Tab으로 다음 세그먼트 이동
- [ ] Shift+Tab으로 이전 세그먼트 이동
- [ ] Shift+Click으로 범위 선택 (Grid 행 다중 하이라이트)
- [ ] Ctrl+Shift+A 전체 선택
- [ ] 첫/마지막 세그먼트 경계에서 이동 시 무시
- [ ] TipTap 내 Ctrl+Left/Right 단어 이동 정상 동작

## QA Checklist

- [ ] Arrow Down 연타 → 세그먼트 순서대로 이동
- [ ] Ctrl+Home → 세그먼트 1 선택 / Ctrl+End → 세그먼트 20 선택
- [ ] Tab → 다음 세그먼트, Shift+Tab → 이전 세그먼트
- [ ] 멀티 선택 → Grid에 다중 행 하이라이트
- [ ] TipTap 편집 중 Arrow Up/Down → 세그먼트 이동 (TipTap 내 커서 이동과 충돌 없음)

## Regression Checklist

- [ ] Sprint 3-2: TipTap 편집, 내용 동기화, Undo/Redo
- [ ] Sprint 3-1: Grid 표시, 행 선택

## Dependencies

- Sprint 3-2 완료 필수

## Out of Scope

- Go to Segment 다이얼로그 (Phase 12)
- 자동 점프 (확인 후 다음 세그먼트) → Sprint 3-4
