import { useRef, useEffect } from 'react';
import type { Segment } from '../../../shared/types/segment';

interface EditPanelProps {
  readonly segment: Segment | null;
  readonly onTargetChange: (segmentId: string, newTarget: string) => void;
}

export function EditPanel({ segment, onTargetChange }: EditPanelProps): React.ReactElement {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 세그먼트 변경 시 textarea에 포커스
  useEffect(() => {
    if (segment && textareaRef.current) {
      textareaRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment?.id]);

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
        <div className="edit-panel-text edit-panel-text--readonly" data-testid="edit-panel-source">
          {segment.source}
        </div>
      </div>
      <div className="edit-panel-divider" />
      <div className="edit-panel-target">
        <div className="edit-panel-label">Target</div>
        <textarea
          ref={textareaRef}
          className="edit-panel-textarea"
          value={segment.target}
          onChange={(e) => onTargetChange(segment.id, e.target.value)}
          disabled={segment.locked}
          data-testid="edit-panel-target"
        />
      </div>
    </div>
  );
}
