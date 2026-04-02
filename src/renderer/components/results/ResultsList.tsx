import type { TmMatch } from '../../../shared/types/tm';
import { ResultItem } from './ResultItem';

interface ResultsListProps {
  readonly matches: TmMatch[];
  readonly currentSource: string;
  readonly selectedIndex: number;
  readonly onSelect: (index: number) => void;
  readonly onInsert: (index: number) => void;
}

export function ResultsList({
  matches,
  currentSource,
  selectedIndex,
  onSelect,
  onInsert,
}: ResultsListProps): React.ReactElement {
  if (matches.length === 0) {
    return (
      <div className="results-list results-list--empty" data-testid="results-list">
        <span className="results-list-empty-text">TM 매치 없음</span>
      </div>
    );
  }

  return (
    <div className="results-list" data-testid="results-list">
      {matches.map((match, index) => (
        <ResultItem
          key={match.tu_id}
          index={index}
          match={match}
          currentSource={currentSource}
          selected={index === selectedIndex}
          onSelect={() => onSelect(index)}
          onInsert={() => onInsert(index)}
        />
      ))}
    </div>
  );
}
