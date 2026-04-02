import { useCallback } from 'react';
import type { TmMatch } from '../../../shared/types/tm';

interface MatchListProps {
  readonly matches: TmMatch[];
  readonly onInsert: (index: number) => void;
}

function getMatchColor(rate: number): string {
  if (rate >= 102) return '#16a34a';
  if (rate >= 101) return '#22c55e';
  if (rate >= 100) return '#3b82f6';
  if (rate >= 85) return '#60a5fa';
  return '#f59e0b';
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '...';
}

export function MatchList({ matches, onInsert }: MatchListProps): React.ReactElement | null {
  const handleDoubleClick = useCallback(
    (index: number) => {
      onInsert(index);
    },
    [onInsert],
  );

  if (matches.length === 0) {
    return (
      <div className="match-list match-list--empty" data-testid="match-list">
        <span className="match-list-empty-text">TM 매치 없음</span>
      </div>
    );
  }

  return (
    <div className="match-list" data-testid="match-list">
      {matches.slice(0, 5).map((match, index) => (
        <div
          key={match.tu_id}
          className="match-list-item"
          onDoubleClick={() => handleDoubleClick(index)}
          data-testid={`match-item-${index}`}
        >
          <span
            className="match-list-rate"
            style={{ backgroundColor: getMatchColor(match.match_rate) }}
          >
            {match.match_rate}%
          </span>
          <span className="match-list-index">{index + 1}</span>
          <span className="match-list-source" title={match.source}>
            {truncate(match.source, 40)}
          </span>
          <span className="match-list-target" title={match.target}>
            {truncate(match.target, 40)}
          </span>
          <span className="match-list-tm">{match.tm_name}</span>
        </div>
      ))}
    </div>
  );
}
