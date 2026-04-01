import { useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { createExtensions } from './extensions';
import '../../styles/tiptap.css';

interface TipTapEditorProps {
  readonly content: string;
  readonly segmentId: string;
  readonly disabled: boolean;
  readonly onUpdate: (html: string) => void;
  readonly onKeyDown?: (e: KeyboardEvent) => boolean;
  readonly onEditorReady?: (editor: ReturnType<typeof useEditor>) => void;
}

export function TipTapEditor({
  content,
  segmentId,
  disabled,
  onUpdate,
  onKeyDown,
  onEditorReady,
}: TipTapEditorProps): React.ReactElement {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;
  const onKeyDownRef = useRef(onKeyDown);
  onKeyDownRef.current = onKeyDown;

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

  // 마운트 시 포커스 + editor 콜백
  useEffect(() => {
    if (editor && !disabled) {
      editor.commands.focus('end');
    }
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  // TipTap DOM에 keydown 리스너 등록 (Tab 등 인터셉트)
  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom;
    const handler = (e: KeyboardEvent) => {
      if (onKeyDownRef.current?.(e)) {
        // 이벤트가 소비됨 — TipTap에 전달하지 않음
      }
    };
    dom.addEventListener('keydown', handler);
    return () => dom.removeEventListener('keydown', handler);
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
