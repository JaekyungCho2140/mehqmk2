import { useState, useCallback, useMemo } from 'react';
import type { Segment } from '../../shared/types/segment';
import { SAMPLE_SEGMENTS } from '../../../tests/fixtures/sample-segments';
import { SegmentGrid } from '../components/editor/SegmentGrid';
import { EditPanel } from '../components/editor/EditPanel';
import { StatusBar } from '../components/editor/StatusBar';
import { FilterBar, type FilterState } from '../components/editor/FilterBar';
import { Breadcrumb } from '../components/Breadcrumb';
import { ChangeStatusDialog } from '../components/editor/ChangeStatusDialog';
import { useEditorNavigation } from '../hooks/useEditorNavigation';
import { useConfirmation } from '../hooks/useConfirmation';
import { useSegmentStatus, type ChangeStatusOptions } from '../hooks/useSegmentStatus';
import { useSegmentStats } from '../hooks/useSegmentStats';
import '../styles/editor.css';

interface TranslationEditorProps {
  readonly projectName: string;
  readonly onBack: () => void;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function matchesFilter(
  text: string,
  filter: string,
  caseSensitive: boolean,
  useRegex: boolean,
): boolean {
  if (!filter) return true;
  if (useRegex) {
    try {
      const flags = caseSensitive ? '' : 'i';
      return new RegExp(filter, flags).test(text);
    } catch {
      return false;
    }
  }
  if (caseSensitive) return text.includes(filter);
  return text.toLowerCase().includes(filter.toLowerCase());
}

const STATUS_ORDER = [
  'not-started',
  'edited',
  'pre-translated',
  'assembled',
  'confirmed',
  'r1-confirmed',
  'r2-confirmed',
  'locked',
  'rejected',
];

export function TranslationEditor({
  projectName,
  onBack,
}: TranslationEditorProps): React.ReactElement {
  const [segments, setSegments] = useState<Segment[]>(() => SAMPLE_SEGMENTS.map((s) => ({ ...s })));
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(segments[0]?.id ?? null);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [filter, setFilter] = useState<FilterState>({
    sourceFilter: '',
    targetFilter: '',
    caseSensitive: false,
    useRegex: false,
    sortBy: 'none',
    sortAsc: true,
  });

  // 필터링
  const filteredSegments = useMemo(() => {
    let result = segments.filter((s) => {
      const sourceText = stripHtml(s.source);
      const targetText = stripHtml(s.target);
      return (
        matchesFilter(sourceText, filter.sourceFilter, filter.caseSensitive, filter.useRegex) &&
        matchesFilter(targetText, filter.targetFilter, filter.caseSensitive, filter.useRegex)
      );
    });

    // 정렬
    if (filter.sortBy !== 'none') {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        switch (filter.sortBy) {
          case 'source-alpha':
            cmp = stripHtml(a.source).localeCompare(stripHtml(b.source));
            break;
          case 'target-alpha':
            cmp = stripHtml(a.target).localeCompare(stripHtml(b.target));
            break;
          case 'source-length':
            cmp = stripHtml(a.source).length - stripHtml(b.source).length;
            break;
          case 'status':
            cmp = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
            break;
        }
        return filter.sortAsc ? cmp : -cmp;
      });
    }

    return result;
  }, [segments, filter]);

  const isFiltered = !!(filter.sourceFilter || filter.targetFilter);

  const activeSegment = segments.find((s) => s.id === activeSegmentId) ?? null;
  const stats = useSegmentStats(segments, filteredSegments.length, activeSegmentId);

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

  const nav = useEditorNavigation({
    segments: filteredSegments,
    activeSegmentId,
    onNavigate: setActiveSegmentId,
  });

  const confirmation = useConfirmation({
    segments,
    activeSegmentId,
    userName: 'TestUser',
    onSegmentsChange: setSegments,
    goToNext: nav.goToNext,
  });

  const segStatus = useSegmentStatus({
    segments,
    activeSegmentId,
    userName: 'TestUser',
    onSegmentsChange: setSegments,
  });

  const handleChangeStatusApply = useCallback(
    (options: ChangeStatusOptions) => {
      segStatus.changeStatus(options);
      setShowChangeStatus(false);
    },
    [segStatus],
  );

  const handleEditorKeyDown = useCallback(
    (e: KeyboardEvent): boolean => {
      if (segStatus.handleKeyDown(e)) return true;
      if (confirmation.handleEditorKeyDown(e)) return true;
      return nav.handleEditorKeyDown(e);
    },
    [segStatus, confirmation, nav],
  );

  return (
    <div
      className="translation-editor"
      data-testid="translation-editor"
      onKeyDown={nav.handleGridKeyDown}
    >
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

      <FilterBar onFilterChange={setFilter} />

      <SegmentGrid
        segments={filteredSegments}
        activeSegmentId={activeSegmentId}
        onSegmentSelect={handleSegmentSelect}
        onStatusBoxDoubleClick={() => setShowChangeStatus(true)}
      />

      <EditPanel
        segment={activeSegment}
        onTargetChange={handleTargetChange}
        onEditorKeyDown={handleEditorKeyDown}
      />

      <StatusBar stats={stats} isFiltered={isFiltered} />

      {showChangeStatus && (
        <ChangeStatusDialog
          onApply={handleChangeStatusApply}
          onCancel={() => setShowChangeStatus(false)}
        />
      )}
    </div>
  );
}
