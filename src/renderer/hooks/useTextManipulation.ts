import { useCallback } from 'react';
import type { Editor } from '@tiptap/react';

interface UseTextManipulationOptions {
  readonly editor: Editor | null;
  readonly sourceHtml: string;
}

interface UseTextManipulationResult {
  readonly copySourceToTarget: () => void;
  readonly cycleCase: () => void;
  readonly handleKeyDown: (e: KeyboardEvent) => boolean;
}

function getCaseType(text: string): 'lower' | 'initial' | 'upper' {
  if (text === text.toUpperCase()) return 'upper';
  if (text === toInitialCaps(text)) return 'initial';
  return 'lower';
}

function toInitialCaps(text: string): string {
  return text.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function useTextManipulation({
  editor,
  sourceHtml,
}: UseTextManipulationOptions): UseTextManipulationResult {
  const copySourceToTarget = useCallback(() => {
    if (!editor) return;
    editor.commands.setContent(sourceHtml, { emitUpdate: true });
    editor.commands.focus('end');
  }, [editor, sourceHtml]);

  const cycleCase = useCallback(() => {
    if (!editor) return;

    const { from, to, empty } = editor.state.selection;

    // 선택 영역 없으면 현재 단어 선택
    if (empty) {
      // 현재 단어의 범위를 찾음
      const resolved = editor.state.doc.resolve(from);
      const text = resolved.parent.textContent;
      const offset = resolved.parentOffset;

      // 단어 경계 찾기
      let start = offset;
      let end = offset;
      while (start > 0 && /\w/.test(text[start - 1])) start--;
      while (end < text.length && /\w/.test(text[end])) end++;

      if (start === end) return;

      const word = text.slice(start, end);
      const caseType = getCaseType(word);

      let newWord: string;
      if (caseType === 'lower') newWord = toInitialCaps(word);
      else if (caseType === 'initial') newWord = word.toUpperCase();
      else newWord = word.toLowerCase();

      const nodeStart = resolved.start();
      editor
        .chain()
        .focus()
        .deleteRange({ from: nodeStart + start, to: nodeStart + end })
        .insertContentAt(nodeStart + start, newWord)
        .run();
      return;
    }

    // 선택 영역의 텍스트
    const selectedText = editor.state.doc.textBetween(from, to);
    if (!selectedText) return;

    const caseType = getCaseType(selectedText);

    let newText: string;
    if (caseType === 'lower') newText = toInitialCaps(selectedText);
    else if (caseType === 'initial') newText = selectedText.toUpperCase();
    else newText = selectedText.toLowerCase();

    editor.chain().focus().deleteRange({ from, to }).insertContentAt(from, newText).run();
  }, [editor]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): boolean => {
      // Ctrl+Shift+S: Source → Target 복사
      if (e.key === 'S' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        copySourceToTarget();
        return true;
      }

      // Shift+F3: 대소문자 순환
      if (e.key === 'F3' && e.shiftKey) {
        e.preventDefault();
        cycleCase();
        return true;
      }

      return false;
    },
    [copySourceToTarget, cycleCase],
  );

  return { copySourceToTarget, cycleCase, handleKeyDown };
}
