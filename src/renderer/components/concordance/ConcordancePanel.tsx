import { useState, useCallback } from 'react';
import type { ConcordanceResultItem } from '../../../shared/types/tm';
import { KwicView } from './KwicView';
import { FullView } from './FullView';
import { Button } from '../Button';
import '../../styles/concordance.css';

interface ConcordancePanelProps {
  readonly projectId?: string;
  readonly initialQuery?: string;
  readonly onInsert: (target: string) => void;
  readonly onClose: () => void;
}

type ViewMode = 'kwic' | 'full';

export function ConcordancePanel({
  projectId,
  initialQuery = '',
  onInsert,
  onClose,
}: ConcordancePanelProps): React.ReactElement {
  const [query, setQuery] = useState(initialQuery);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [autoWildcard, setAutoWildcard] = useState(true);
  const [results, setResults] = useState<ConcordanceResultItem[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('full');
  const [searching, setSearching] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!projectId || !query.trim()) return;
    setSearching(true);
    const res = await window.electronAPI.tm.concordance({
      projectId,
      query: query.trim(),
      caseSensitive,
      autoWildcard,
    });
    setResults(res);
    setSearching(false);
  }, [projectId, query, caseSensitive, autoWildcard]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [handleSearch, onClose],
  );

  return (
    <div className="concordance-panel" data-testid="concordance-panel">
      <div className="concordance-header">
        <span className="concordance-title">Concordance</span>
        <button className="concordance-close" onClick={onClose} data-testid="concordance-close">
          ×
        </button>
      </div>

      <div className="concordance-search-bar">
        <input
          className="text-input concordance-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어..."
          autoFocus
          data-testid="concordance-query"
        />
        <Button onClick={handleSearch} disabled={searching} data-testid="concordance-search-btn">
          {searching ? '...' : 'Search'}
        </Button>
        <label className="concordance-toggle">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
          />
          Aa
        </label>
        <label className="concordance-toggle">
          <input
            type="checkbox"
            checked={autoWildcard}
            onChange={(e) => setAutoWildcard(e.target.checked)}
          />
          *
        </label>
        <div className="concordance-mode-tabs">
          <button
            className={`concordance-mode-tab ${viewMode === 'full' ? 'concordance-mode-tab--active' : ''}`}
            onClick={() => setViewMode('full')}
          >
            Full
          </button>
          <button
            className={`concordance-mode-tab ${viewMode === 'kwic' ? 'concordance-mode-tab--active' : ''}`}
            onClick={() => setViewMode('kwic')}
          >
            KWIC
          </button>
        </div>
      </div>

      <div className="concordance-results">
        {results.length === 0 && !searching && query.trim() && (
          <div className="concordance-empty" data-testid="concordance-empty">
            일치하는 항목이 없습니다
          </div>
        )}
        {viewMode === 'kwic' ? (
          <KwicView results={results} onInsert={onInsert} />
        ) : (
          <FullView results={results} onInsert={onInsert} />
        )}
      </div>

      <div className="concordance-status">
        {results.length > 0 && `${results.length}개 결과`}
      </div>
    </div>
  );
}
