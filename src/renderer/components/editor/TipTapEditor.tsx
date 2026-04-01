import { useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { createExtensions } from './extensions';
import '../../styles/tiptap.css';

interface TipTapEditorProps {
  readonly content: string;
  readonly segmentId: string;
  readonly disabled: boolean;
  readonly onUpdate: (html: string) => void;
}

export function TipTapEditor({
  content,
  segmentId,
  disabled,
  onUpdate,
}: TipTapEditorProps): React.ReactElement {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const editor = useEditor({
    extensions: createExtensions(),
    content,
    editable: !disabled,
    onUpdate: ({ editor: e }) => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onUpdateRef.current(e.getHTML());
      }, 100);
    },
  });

  // 세그먼트 전환 시 content 교체
  const prevSegmentIdRef = useRef(segmentId);
  useEffect(() => {
    if (!editor || prevSegmentIdRef.current === segmentId) return;
    prevSegmentIdRef.current = segmentId;

    // 새 세그먼트의 content로 교체 (history 초기화)
    editor.commands.setContent(content, { emitUpdate: false });
    editor.commands.focus('end');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentId, editor]);

  // disabled 변경 시 editable 업데이트
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  // 마운트 시 포커스
  useEffect(() => {
    if (editor && !disabled) {
      editor.commands.focus('end');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  // 클린업
  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
    };
  }, []);

  const handleClick = useCallback(() => {
    if (editor && !disabled) {
      editor.commands.focus();
    }
  }, [editor, disabled]);

  return (
    <div
      className={`tiptap-wrapper ${disabled ? 'tiptap-wrapper--disabled' : ''}`}
      onClick={handleClick}
      data-testid="tiptap-editor"
    >
      <EditorContent editor={editor} />
    </div>
  );
}
