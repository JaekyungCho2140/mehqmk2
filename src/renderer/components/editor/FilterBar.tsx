import { useState, useEffect, useCallback } from 'react';
import '../../styles/statusbar.css';

interface FilterState {
  readonly sourceFilter: string;
  readonly targetFilter: string;
  readonly caseSensitive: boolean;
  readonly useRegex: boolean;
  readonly sortBy: string;
  readonly sortAsc: boolean;
}

interface FilterBarProps {
  readonly onFilterChange: (filter: FilterState) => void;
}

const SORT_OPTIONS = [
  { value: 'none', label: 'No sorting' },
  { value: 'source-alpha', label: 'Alphabetical (Source)' },
  { value: 'target-alpha', label: 'Alphabetical (Target)' },
  { value: 'source-length', label: 'Length (Source)' },
  { value: 'status', label: 'Row status' },
];

export type { FilterState };

export function FilterBar({ onFilterChange }: FilterBarProps): React.ReactElement {
  const [sourceFilter, setSourceFilter] = useState('');
  const [targetFilter, setTargetFilter] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [sortBy, setSortBy] = useState('none');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ sourceFilter, targetFilter, caseSensitive, useRegex, sortBy, sortAsc });
    }, 200);
    return () => clearTimeout(timer);
  }, [sourceFilter, targetFilter, caseSensitive, useRegex, sortBy, sortAsc, onFilterChange]);

  const toggleSortDirection = useCallback(() => setSortAsc((v) => !v), []);

  return (
    <div className="filter-bar" data-testid="filter-bar">
      <div className="filter-bar-inputs">
        <input
          className="filter-input"
          placeholder="Source 필터..."
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          data-testid="filter-source"
        />
        <input
          className="filter-input"
          placeholder="Target 필터..."
          value={targetFilter}
          onChange={(e) => setTargetFilter(e.target.value)}
          data-testid="filter-target"
        />
        <button
          className={`filter-toggle ${caseSensitive ? 'filter-toggle--active' : ''}`}
          onClick={() => setCaseSensitive((v) => !v)}
          title="대소문자 구분"
          data-testid="filter-case-toggle"
        >
          Aa
        </button>
        <button
          className={`filter-toggle ${useRegex ? 'filter-toggle--active' : ''}`}
          onClick={() => setUseRegex((v) => !v)}
          title="정규식"
          data-testid="filter-regex-toggle"
        >
          .*
        </button>
      </div>
      <div className="filter-bar-sort">
        <select
          className="filter-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          data-testid="filter-sort-select"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {sortBy !== 'none' && (
          <button className="filter-toggle" onClick={toggleSortDirection} title="정렬 방향">
            {sortAsc ? '↑' : '↓'}
          </button>
        )}
      </div>
    </div>
  );
}
