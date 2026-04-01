import type { Segment } from '../../../shared/types/segment';
import { TipTapEditor } from './TipTapEditor';
import { SourceDisplay } from './SourceDisplay';

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
        <div className="edit-panel-label">Target</div>
        <TipTapEditor
          content={segment.target}
          segmentId={segment.id}
          disabled={segment.locked}
          onUpdate={(html) => onTargetChange(segment.id, html)}
          onKeyDown={onEditorKeyDown}
        />
      </div>
    </div>
  );
}
