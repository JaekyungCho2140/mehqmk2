import type { TmMatch } from '../../../shared/types/tm';
import { DiffLamps } from './DiffLamps';

interface ResultItemProps {
  readonly index: number;
  readonly match: TmMatch;
  readonly currentSource: string;
  readonly selected: boolean;
  readonly onSelect: () => void;
  readonly onInsert: () => void;
}

function getMatchColor(rate: number): string {
  if (rate >= 102) return '#16a34a';
  if (rate >= 101) return '#22c55e';
  if (rate >= 100) return '#3b82f6';
  if (rate >= 95) return '#60a5fa';
  if (rate >= 75) return '#f59e0b';
  return '#fb923c';
}

function getMatchLabel(rate: number): string {
  if (rate >= 102) return `${rate}% DC`;
  if (rate >= 101) return `${rate}% C`;
  return `${rate}%`;
}

function getSourceColor(type: string): string {
  if (type === 'double-context' || type === 'context' || type === 'exact' || type === 'fuzzy') {
    return '#ef4444'; // TM: red
  }
  return '#9ca3af'; // default grey
}

export function ResultItem({
  index,
  match,
  currentSource,
  selected,
  onSelect,
  onInsert,
}: ResultItemProps): React.ReactElement {
  return (
    <div
      className={`result-item ${selected ? 'result-item--selected' : ''}`}
      onClick={onSelect}
      onDoubleClick={onInsert}
      data-testid={`result-item-${index}`}
    >
      <div
        className="result-item-color-bar"
        style={{ backgroundColor: getSourceColor(match.match_type) }}
      />
      <span className="result-item-num">{index + 1}</span>
      <div className="result-item-content">
        <div className="result-item-header">
          <span
            className="result-item-rate"
            style={{ backgroundColor: getMatchColor(match.match_rate) }}
          >
            {getMatchLabel(match.match_rate)}
          </span>
          <span className="result-item-tm">{match.tm_name}</span>
          <DiffLamps currentSource={currentSource} matchSource={match.source} />
        </div>
        <div className="result-item-source" title={match.source}>
          {match.source}
        </div>
      </div>
    </div>
  );
}
