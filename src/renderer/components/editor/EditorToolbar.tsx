import type { Editor } from '@tiptap/react';
import '../../styles/toolbar.css';

interface EditorToolbarProps {
  readonly editor: Editor | null;
}

interface ToolbarButtonProps {
  readonly label: string;
  readonly active: boolean;
  readonly onClick: () => void;
  readonly 'data-testid'?: string;
}

function ToolbarButton({ label, active, onClick, 'data-testid': testId }: ToolbarButtonProps) {
  return (
    <button
      className={`toolbar-btn ${active ? 'toolbar-btn--active' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      onMouseDown={(e) => e.preventDefault()}
      data-testid={testId}
      title={label}
    >
      {label}
    </button>
  );
}

export function EditorToolbar({ editor }: EditorToolbarProps): React.ReactElement | null {
  if (!editor) return null;

  return (
    <div className="editor-toolbar-format" data-testid="editor-format-toolbar">
      <ToolbarButton
        label="B"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        data-testid="toolbar-bold"
      />
      <ToolbarButton
        label="I"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        data-testid="toolbar-italic"
      />
      <ToolbarButton
        label="U"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        data-testid="toolbar-underline"
      />
      <div className="toolbar-divider" />
      <ToolbarButton
        label="↶"
        active={false}
        onClick={() => editor.chain().focus().undo().run()}
        data-testid="toolbar-undo"
      />
      <ToolbarButton
        label="↷"
        active={false}
        onClick={() => editor.chain().focus().redo().run()}
        data-testid="toolbar-redo"
      />
    </div>
  );
}
