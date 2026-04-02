import { useState, useCallback, useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import type { Segment } from '../../../shared/types/segment';
import { TipTapEditor } from './TipTapEditor';
import { SourceDisplay } from './SourceDisplay';
import { EditorToolbar } from './EditorToolbar';
import { MatchIndicator } from './MatchIndicator';
import { AutoPickMenu } from './AutoPickMenu';
import { recognizeItems, type RecognizedItem } from '../../../main/autopick/recognizer';
import { useTextManipulation } from '../../hooks/useTextManipulation';
import '../../styles/match.css';

interface EditPanelProps {
  readonly segment: Segment | null;
  readonly onTargetChange: (segmentId: string, newTarget: string) => void;
  readonly onEditorKeyDown?: (e: KeyboardEvent) => boolean;
  readonly bestMatchRate?: number | null;
  readonly insertContent?: string | null;
  readonly onInsertHandled?: () => void;
}

export function EditPanel({
  segment,
  onTargetChange,
  onEditorKeyDown,
  bestMatchRate = null,
  insertContent = null,
  onInsertHandled,
}: EditPanelProps): React.ReactElement {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [autoPickItems, setAutoPickItems] = useState<RecognizedItem[]>([]);
  const [autoPickPos, setAutoPickPos] = useState({ x: 0, y: 0 });
  const ctrlAloneRef = useRef(false);

  // AutoPick: detect Ctrl-only keyup
  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Meta') {
        ctrlAloneRef.current = true;
      } else {
        ctrlAloneRef.current = false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if ((e.key === 'Control' || e.key === 'Meta') && ctrlAloneRef.current && segment) {
        ctrlAloneRef.current = false;
        const sourceText = segment.source.replace(/<[^>]*>/g, '').trim();
        const items = recognizeItems(sourceText);
        if (items.length > 0) {
          const rect = dom.getBoundingClientRect();
          setAutoPickItems(items);
          setAutoPickPos({ x: rect.left + 20, y: rect.bottom + 4 });
        }
      }
    };

    dom.addEventListener('keydown', handleKeyDown);
    dom.addEventListener('keyup', handleKeyUp);
    return () => {
      dom.removeEventListener('keydown', handleKeyDown);
      dom.removeEventListener('keyup', handleKeyUp);
    };
  }, [editor, segment]);

  const handleAutoPickSelect = useCallback(
    (value: string) => {
      if (editor) {
        editor.commands.insertContent(value);
      }
      setAutoPickItems([]);
    },
    [editor],
  );

  // Handle external content insertion into TipTap
  useEffect(() => {
    if (insertContent === null || !editor || !segment) return;
    editor.commands.setContent(insertContent, { emitUpdate: false });
    onTargetChange(segment.id, insertContent);
    onInsertHandled?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insertContent]);

  const textManip = useTextManipulation({
    editor,
    sourceHtml: segment?.source ?? '',
  });

  // 키 이벤트 병합: textManip → 외부 onEditorKeyDown
  const handleKeyDown = useCallback(
    (e: KeyboardEvent): boolean => {
      if (textManip.handleKeyDown(e)) return true;
      return onEditorKeyDown?.(e) ?? false;
    },
    [textManip, onEditorKeyDown],
  );

  if (!segment) {
    return (
      <div className="edit-panel edit-panel--empty" data-testid="edit-panel">
        <p className="edit-panel-placeholder">세그먼트를 선택하세요</p>
      </div>
    );
  }

  return (
    <div className="edit-panel" data-testid="edit-panel">
      <div className="edit-panel-source">
        <div className="edit-panel-label-row">
          <span className="edit-panel-label">Source</span>
          <MatchIndicator matchRate={bestMatchRate} />
        </div>
        <SourceDisplay html={segment.source} />
      </div>
      <div className="edit-panel-divider" />
      <div className="edit-panel-target">
        <div className="edit-panel-label-row">
          <span className="edit-panel-label">Target</span>
          <EditorToolbar editor={editor} />
        </div>
        <TipTapEditor
          content={segment.target}
          segmentId={segment.id}
          disabled={segment.locked}
          onUpdate={(html) => onTargetChange(segment.id, html)}
          onKeyDown={handleKeyDown}
          onEditorReady={setEditor}
        />
      </div>
      {autoPickItems.length > 0 && (
        <AutoPickMenu
          items={autoPickItems}
          position={autoPickPos}
          onSelect={handleAutoPickSelect}
          onClose={() => setAutoPickItems([])}
        />
      )}
    </div>
  );
}
