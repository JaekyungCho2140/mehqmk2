import { useState, useCallback } from 'react';
import type { Editor } from '@tiptap/react';
import type { Segment } from '../../../shared/types/segment';
import { TipTapEditor } from './TipTapEditor';
import { SourceDisplay } from './SourceDisplay';
import { EditorToolbar } from './EditorToolbar';
import { useTextManipulation } from '../../hooks/useTextManipulation';

interface EditPanelProps {
  readonly segment: Segment | null;
  readonly onTargetChange: (segmentId: string, newTarget: string) => void;
  readonly onEditorKeyDown?: (e: KeyboardEvent) => boolean;
}

export function EditPanel({
  segment,
  onTargetChange,
  onEditorKeyDown,
}: EditPanelProps): React.ReactElement {
  const [editor, setEditor] = useState<Editor | null>(null);

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
        <div className="edit-panel-label">Source</div>
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
    </div>
  );
}
