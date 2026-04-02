import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Segment } from '../../shared/types/segment';
import { SAMPLE_SEGMENTS } from '../../../tests/fixtures/sample-segments';
import { SegmentGrid } from '../components/editor/SegmentGrid';
import { EditPanel } from '../components/editor/EditPanel';
import { StatusBar } from '../components/editor/StatusBar';
import { FilterBar, type FilterState } from '../components/editor/FilterBar';
import { Breadcrumb } from '../components/Breadcrumb';
import { ChangeStatusDialog } from '../components/editor/ChangeStatusDialog';
import { ResultsPane } from '../components/results/ResultsPane';
import { AutoLookupSettings } from '../components/AutoLookupSettings';
import { useEditorNavigation } from '../hooks/useEditorNavigation';
import { useConfirmation } from '../hooks/useConfirmation';
import { useSegmentStatus, type ChangeStatusOptions } from '../hooks/useSegmentStatus';
import { useSegmentStats } from '../hooks/useSegmentStats';
import { useTmIntegration } from '../hooks/useTmIntegration';
import '../styles/editor.css';

interface TranslationEditorProps {
  readonly projectId?: string;
  readonly projectName: string;
  readonly documentId?: string;
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
  projectId,
  projectName,
  documentId,
  onBack,
}: TranslationEditorProps): React.ReactElement {
  const [segments, setSegments] = useState<Segment[]>(() => SAMPLE_SEGMENTS.map((s) => ({ ...s })));
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(segments[0]?.id ?? null);
  const [dbLoaded, setDbLoaded] = useState(false);

  // DB에서 세그먼트 로드 (documentId가 있을 때)
  useEffect(() => {
    if (!documentId || dbLoaded) return;
    let cancelled = false;
    window.electronAPI.segments.list(documentId).then((dbSegs) => {
      if (cancelled || dbSegs.length === 0) return;
      setSegments(dbSegs);
      setActiveSegmentId(dbSegs[0]?.id ?? null);
      setDbLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [documentId, dbLoaded]);

  // DB 세그먼트 저장 (세그먼트 전환 시)
  const saveSegmentToDb = useCallback(
    (seg: Segment) => {
      if (!documentId) return;
      window.electronAPI.segments.update(seg.id, {
        target: seg.target,
        status: seg.status,
        locked: seg.locked,
        modified: seg.modified,
        confirmedBy: seg.confirmedBy,
        confirmedAt: seg.confirmedAt,
      });
    },
    [documentId],
  );

  // 세그먼트 전환 시 이전 세그먼트 저장
  const handleSegmentSelect = useCallback(
    (segment: Segment) => {
      const current = segments.find((s) => s.id === activeSegmentId);
      if (current && current.modified && documentId) {
        saveSegmentToDb(current);
      }
      setActiveSegmentId(segment.id);
    },
    [segments, activeSegmentId, documentId, saveSegmentToDb],
  );
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [resultsPaneCollapsed, setResultsPaneCollapsed] = useState(false);
  const [pendingInsert, setPendingInsert] = useState<string | null>(null);
  const [showAutoLookupSettings, setShowAutoLookupSettings] = useState(false);
  const [autoScan, setAutoScan] = useState(true);
  const [autoInsert, setAutoInsert] = useState(false);
  const [autoInsertThreshold, setAutoInsertThreshold] = useState(85);
  const [copySourceIfNoMatch, setCopySourceIfNoMatch] = useState(false);

  // Load auto-lookup settings
  useEffect(() => {
    window.electronAPI.settings.getAll().then((s) => {
      if (s.auto_scan !== undefined) setAutoScan(s.auto_scan as boolean);
      if (s.auto_insert !== undefined) setAutoInsert(s.auto_insert as boolean);
      if (s.auto_insert_threshold !== undefined) setAutoInsertThreshold(s.auto_insert_threshold as number);
      if (s.copy_source_if_no_match !== undefined) setCopySourceIfNoMatch(s.copy_source_if_no_match as boolean);
    });
  }, []);
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

  const handleAutoInsert = useCallback(
    (target: string, matchRate: number) => {
      if (!activeSegmentId) return;
      setPendingInsert(target);
      setSegments((prev) =>
        prev.map((s) => {
          if (s.id !== activeSegmentId) return s;
          return { ...s, status: matchRate > 0 ? 'pre-translated' : 'not-started', matchRate: matchRate > 0 ? matchRate : null };
        }),
      );
    },
    [activeSegmentId],
  );

  const tmIntegration = useTmIntegration({
    projectId,
    segments,
    activeSegmentId,
    onAutoInsert: handleAutoInsert,
    autoInsertEnabled: autoInsert,
    autoInsertThreshold,
    copySourceIfNoMatch,
  });

  const confirmation = useConfirmation({
    segments,
    activeSegmentId,
    userName: 'TestUser',
    onSegmentsChange: setSegments,
    goToNext: nav.goToNext,
    onConfirmToTm: (source, target) => tmIntegration.saveToTm(source, target),
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

  const handleMatchInsert = useCallback(
    (index: number) => {
      const target = tmIntegration.insertMatch(index);
      if (target && activeSegmentId) {
        setPendingInsert(target);
        setSegments((prev) =>
          prev.map((s) => {
            if (s.id !== activeSegmentId) return s;
            return { ...s, status: 'pre-translated', matchRate: tmIntegration.matches[index]?.match_rate ?? null };
          }),
        );
      }
    },
    [tmIntegration, activeSegmentId],
  );

  // F12 → Results Pane 토글
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
        setResultsPaneCollapsed((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleEditorKeyDown = useCallback(
    (e: KeyboardEvent): boolean => {
      if (segStatus.handleKeyDown(e)) return true;
      if (confirmation.handleEditorKeyDown(e)) return true;
      // Ctrl+1~9 → TM 매치 삽입
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key, 10) - 1;
        if (index < tmIntegration.matches.length) {
          e.preventDefault();
          handleMatchInsert(index);
          return true;
        }
      }
      return nav.handleEditorKeyDown(e);
    },
    [segStatus, confirmation, nav, tmIntegration, handleMatchInsert],
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
        <div className="editor-toolbar-right">
          <button
            className="back-btn"
            onClick={() => setShowAutoLookupSettings(true)}
            data-testid="auto-lookup-settings-btn"
            title="Auto-Lookup Settings"
          >
            ⚙
          </button>
        </div>
      </div>

      <FilterBar onFilterChange={setFilter} />

      <div className="editor-main">
        <div className="editor-left">
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
            bestMatchRate={tmIntegration.bestMatchRate}
            insertContent={pendingInsert}
            onInsertHandled={() => setPendingInsert(null)}
          />
        </div>

        <ResultsPane
          matches={tmIntegration.matches}
          currentSource={activeSegment ? stripHtml(activeSegment.source) : ''}
          collapsed={resultsPaneCollapsed}
          onInsert={handleMatchInsert}
          onToggleCollapse={() => setResultsPaneCollapsed((v) => !v)}
        />
      </div>

      <StatusBar stats={stats} isFiltered={isFiltered} tmMatchRate={tmIntegration.bestMatchRate} />

      {showChangeStatus && (
        <ChangeStatusDialog
          onApply={handleChangeStatusApply}
          onCancel={() => setShowChangeStatus(false)}
        />
      )}

      {showAutoLookupSettings && (
        <AutoLookupSettings
          autoScan={autoScan}
          autoInsert={autoInsert}
          autoInsertThreshold={autoInsertThreshold}
          copySourceIfNoMatch={copySourceIfNoMatch}
          onSave={(s) => {
            setAutoScan(s.auto_scan);
            setAutoInsert(s.auto_insert);
            setAutoInsertThreshold(s.auto_insert_threshold);
            setCopySourceIfNoMatch(s.copy_source_if_no_match);
            window.electronAPI.settings.setBulk(s);
            setShowAutoLookupSettings(false);
          }}
          onCancel={() => setShowAutoLookupSettings(false)}
        />
      )}
    </div>
  );
}
