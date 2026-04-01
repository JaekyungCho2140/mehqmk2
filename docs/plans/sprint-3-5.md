# Sprint 3-5: 서식 + 텍스트 조작

## Scope

TipTap 에디터에 Bold/Italic/Underline 서식을 추가하고, Source→Target 복사, Undo/Redo, 대소문자 변경 등 텍스트 조작 기능을 구현한다.

### 생성/수정할 파일

```
src/renderer/components/editor/TipTapEditor.tsx    # (수정) 서식 키 핸들링
src/renderer/components/editor/EditorToolbar.tsx   # 서식 툴바 (B/I/U 버튼)
src/renderer/components/editor/extensions/index.ts # (수정) Underline 확장 추가
src/renderer/hooks/useTextManipulation.ts          # 텍스트 조작 로직 훅
src/renderer/views/TranslationEditor.tsx           # (수정) 텍스트 조작 통합
src/renderer/styles/toolbar.css                    # 툴바 스타일
package.json                                       # (수정) @tiptap/extension-underline 추가
```

## Technical Prerequisites

- [x] TipTap StarterKit에 Bold, Italic, History(Undo/Redo) 포함
- [ ] ⚠️ `@tiptap/extension-underline` 별도 설치 필요

### 설치

```bash
npm install @tiptap/extension-underline
```

## 주요 동작 흐름

### 서식 단축키

```
Ctrl+B: Bold 토글 (선택 영역 또는 다음 입력)
Ctrl+I: Italic 토글
Ctrl+U: Underline 토글
Ctrl+Z: Undo
Ctrl+Y: Redo
```

### 서식 툴바

```
EditPanel Target 영역 상단에 작은 툴바:
  [B] [I] [U] | [↶ Undo] [↷ Redo]
  
각 버튼:
  - 활성 상태: background var(--color-accent-primary), color #ffffff
  - 비활성 상태: background transparent, color var(--color-text-secondary)
  - 현재 커서 위치의 서식에 따라 자동 활성/비활성
```

### Source→Target 복사

```
Ctrl+Shift+S: Source 전체를 Target으로 복사
  입력: Ctrl+Shift+S
  과정:
    1. 현재 세그먼트의 source HTML을 가져옴
    2. editor.commands.setContent(source) → Target 전체 교체
  출력: Target이 Source와 동일한 내용으로 교체
  주의: 기존 Target 내용은 덮어씀 (Undo로 복구 가능)

Ctrl+Shift+T: Source 선택 부분을 Target 커서 위치에 삽입
  현재 Phase에서는 미구현 (Source 영역의 선택 텍스트 가져오기 어려움)
  → Source 영역에서 Ctrl+C 후 Target에서 Ctrl+V로 대체
```

### 대소문자 변경

```
Shift+F3: 대소문자 순환
  입력: 텍스트 선택 후 Shift+F3
  동작: lowercase → Initial Capitals → ALL CAPITALS → lowercase (순환)
  
  예시:
    "hello world" → "Hello World" → "HELLO WORLD" → "hello world"
  
  선택 영역 없으면 현재 단어에 적용
```

## 시각적 스펙

### 서식 툴바

```
위치: EditPanel Target 라벨 옆 (같은 행)
높이: 28px
버튼: 24x24px, border-radius: 4px, margin: 0 2px
아이콘: 텍스트 기반 ("B" bold, "I" italic, "U" underline)
구분선: 1px solid var(--color-border-default), height: 16px, margin: 0 6px
Undo/Redo 아이콘: ↶ / ↷ (font-size: 14px)
```

## Acceptance Criteria

- [ ] Ctrl+B/I/U로 서식 토글 동작
- [ ] 서식 툴바 버튼 클릭으로도 서식 적용
- [ ] 툴바 버튼이 현재 커서 위치 서식에 따라 활성/비활성
- [ ] 서식이 AG Grid Target 셀에도 반영 (HTML)
- [ ] Ctrl+Shift+S → Source 전체를 Target으로 복사
- [ ] Shift+F3 → 대소문자 순환 (3단계)
- [ ] Ctrl+Z/Y → Undo/Redo 정상 동작 (서식 포함)

## QA Checklist

- [ ] 텍스트 선택 → Ctrl+B → Bold 적용 확인 (Grid 셀에서도 볼드)
- [ ] Ctrl+I → Italic / Ctrl+U → Underline
- [ ] 툴바 B 버튼 클릭 → Bold 적용
- [ ] 커서가 Bold 텍스트 안에 있을 때 → 툴바 B 활성 상태
- [ ] Ctrl+Shift+S → Target이 Source와 동일
- [ ] "hello" 선택 → Shift+F3 → "Hello" → "HELLO" → "hello"
- [ ] Ctrl+Z → 서식 변경 취소

## Regression Checklist

- [ ] Sprint 3-4: Ctrl+Enter 확인 로직
- [ ] Sprint 3-3: 키보드 네비게이션
- [ ] Sprint 3-2: TipTap 기본 편집

## Dependencies

- Sprint 3-4 완료 필수

## Out of Scope

- Superscript/Subscript (Phase 8)
- 인라인 태그 (Phase 8)
- 드래그 앤 드롭 (Phase 8)
