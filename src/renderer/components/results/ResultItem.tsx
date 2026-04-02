import type { TmMatch } from '../../../shared/types/tm';

interface ResultItemProps {
  readonly index: number;
  readonly match: TmMatch;
  readonly selected: boolean;
  readonly onSelect: () => void;
  readonly onInsert: () => void;
}

function getMatchColor(rate: number): string {
  if (rate >= 102) return '#16a34a';
  if (rate >= 101) return '#22c55e';
  if (rate >= 100) return '#3b82f6';
  if (rate >= 85) return '#60a5fa';
  return '#f59e0b';
}

export function ResultItem({
  index,
  match,
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
      <span className="result-item-num">{index + 1}</span>
      <div className="result-item-content">
        <div className="result-item-header">
          <span
            className="result-item-rate"
            style={{ backgroundColor: getMatchColor(match.match_rate) }}
          >
            {match.match_rate}%
          </span>
          <span className="result-item-tm">{match.tm_name}</span>
        </div>
        <div className="result-item-source" title={match.source}>
          {match.source}
        </div>
      </div>
    </div>
  );
}
