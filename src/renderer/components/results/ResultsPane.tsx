import { useState, useCallback, useRef, useEffect } from 'react';
import type { TmMatch } from '../../../shared/types/tm';
import { ResultsList } from './ResultsList';
import { CompareBox } from './CompareBox';
import { MetaInfo } from './MetaInfo';
import '../../styles/results.css';

interface ResultsPaneProps {
  readonly matches: TmMatch[];
  readonly currentSource: string;
  readonly collapsed: boolean;
  readonly onInsert: (index: number) => void;
  readonly onToggleCollapse: () => void;
}

export function ResultsPane({
  matches,
  currentSource,
  collapsed,
  onInsert,
  onToggleCollapse,
}: ResultsPaneProps): React.ReactElement {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [width, setWidth] = useState(360);
  const resizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(360);

  // Clamp selectedIndex to valid range; reset happens naturally when matches shrink
  const effectiveIndex = matches.length > 0 ? Math.min(selectedIndex, matches.length - 1) : 0;
  const selectedMatch = matches[effectiveIndex] ?? null;

  // Reset selection when matches change via key comparison
  const matchesKey = matches.length > 0 ? matches[0].tu_id : '';
  const prevMatchesKeyRef = useRef(matchesKey);
  useEffect(() => {
    if (prevMatchesKeyRef.current !== matchesKey) {
      prevMatchesKeyRef.current = matchesKey;
      Promise.resolve().then(() => setSelectedIndex(0));
    }
  }, [matchesKey]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    resizing.current = true;
    startX.current = e.clientX;
    startWidth.current = width;

    const handleMove = (ev: MouseEvent) => {
      if (!resizing.current) return;
      const delta = startX.current - ev.clientX;
      const newWidth = Math.max(280, Math.min(600, startWidth.current + delta));
      setWidth(newWidth);
    };

    const handleUp = () => {
      resizing.current = false;
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, [width]);

  // Keyboard navigation: Ctrl+Up/Down
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;

      if (e.key === 'ArrowUp' && selectedIndex > 0) {
        e.preventDefault();
        setSelectedIndex((prev) => prev - 1);
      } else if (e.key === 'ArrowDown' && selectedIndex < matches.length - 1) {
        e.preventDefault();
        setSelectedIndex((prev) => prev + 1);
      } else if (e.key === ' ' && matches.length > 0) {
        e.preventDefault();
        onInsert(0);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedIndex, matches, onInsert]);

  if (collapsed) {
    return (
      <div className="results-pane results-pane--collapsed" data-testid="results-pane">
        <button
          className="results-pane-expand-btn"
          onClick={onToggleCollapse}
          data-testid="results-pane-expand"
          title="Show Results (F12)"
        >
          ◀
        </button>
      </div>
    );
  }

  return (
    <div
      className="results-pane"
      style={{ width }}
      data-testid="results-pane"
    >
      <div className="results-pane-resize" onMouseDown={handleResizeStart} />
      <div className="results-pane-header">
        <span className="results-pane-title">Translation Results</span>
        <span className="results-pane-count">{matches.length}</span>
        <button
          className="results-pane-collapse-btn"
          onClick={onToggleCollapse}
          title="Hide Results (F12)"
          data-testid="results-pane-collapse"
        >
          ▶
        </button>
      </div>

      <ResultsList
        matches={matches}
        currentSource={currentSource}
        selectedIndex={effectiveIndex}
        onSelect={setSelectedIndex}
        onInsert={onInsert}
      />

      {selectedMatch && (
        <CompareBox
          currentSource={currentSource}
          matchSource={selectedMatch.source}
        />
      )}

      <MetaInfo match={selectedMatch} />
    </div>
  );
}
