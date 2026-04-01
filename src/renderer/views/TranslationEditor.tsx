import { useState, useCallback } from 'react';
import type { Segment } from '../../shared/types/segment';
import { SAMPLE_SEGMENTS } from '../../../tests/fixtures/sample-segments';
import { SegmentGrid } from '../components/editor/SegmentGrid';
import { EditPanel } from '../components/editor/EditPanel';
import { Breadcrumb } from '../components/Breadcrumb';
import '../styles/editor.css';

interface TranslationEditorProps {
  readonly projectName: string;
  readonly onBack: () => void;
}

export function TranslationEditor({
  projectName,
  onBack,
}: TranslationEditorProps): React.ReactElement {
  const [segments, setSegments] = useState<Segment[]>(() => SAMPLE_SEGMENTS.map((s) => ({ ...s })));
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(segments[0]?.id ?? null);

  const activeSegment = segments.find((s) => s.id === activeSegmentId) ?? null;

  const handleSegmentSelect = useCallback((segment: Segment) => {
    setActiveSegmentId(segment.id);
  }, []);

  const handleTargetChange = useCallback((segmentId: string, newTarget: string) => {
    setSegments((prev) =>
      prev.map((s) => {
        if (s.id !== segmentId) return s;
        const newStatus = s.status === 'not-started' && newTarget ? 'edited' : s.status;
        return {
          ...s,
          target: newTarget,
          status: newStatus,
          modified: true,
        };
      }),
    );
  }, []);

  return (
    <div className="translation-editor" data-testid="translation-editor">
      <div className="editor-toolbar">
        <div className="editor-toolbar-left">
          <button className="back-btn" onClick={onBack} data-testid="editor-back-btn">
            ←
          </button>
          <Breadcrumb
            items={[
              { label: 'Dashboard', onClick: onBack },
              { label: projectName },
              { label: 'Editor' },
            ]}
          />
        </div>
      </div>

      <SegmentGrid
        segments={segments}
        activeSegmentId={activeSegmentId}
        onSegmentSelect={handleSegmentSelect}
      />

      <EditPanel segment={activeSegment} onTargetChange={handleTargetChange} />

      <div className="editor-statusbar" data-testid="editor-statusbar" />
    </div>
  );
}
