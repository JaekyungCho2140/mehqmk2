import type { ConcordanceResultItem } from '../../../shared/types/tm';

interface FullViewProps {
  readonly results: ConcordanceResultItem[];
  readonly onInsert: (target: string) => void;
}

function HighlightedText({
  text,
  highlights,
  className,
}: {
  readonly text: string;
  readonly highlights: Array<{ start: number; end: number }>;
  readonly className: string;
}): React.ReactElement {
  if (highlights.length === 0) {
    return <span>{text}</span>;
  }

  const parts: React.ReactElement[] = [];
  let lastEnd = 0;

  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  for (let i = 0; i < sorted.length; i++) {
    const h = sorted[i];
    if (h.start > lastEnd) {
      parts.push(<span key={`t-${i}`}>{text.slice(lastEnd, h.start)}</span>);
    }
    parts.push(
      <span key={`h-${i}`} className={className}>
        {text.slice(h.start, h.end)}
      </span>,
    );
    lastEnd = h.end;
  }
  if (lastEnd < text.length) {
    parts.push(<span key="tail">{text.slice(lastEnd)}</span>);
  }

  return <>{parts}</>;
}

export function FullView({ results, onInsert }: FullViewProps): React.ReactElement {
  return (
    <div className="concordance-full-view">
      {results.map((r, i) => (
        <div
          key={r.tu_id}
          className="concordance-full-item"
          onDoubleClick={() => onInsert(r.target)}
          data-testid={`concordance-item-${i}`}
        >
          <div className="concordance-full-source">
            <HighlightedText
              text={r.source}
              highlights={r.source_highlight}
              className="concordance-highlight"
            />
          </div>
          <div className="concordance-full-target">
            <HighlightedText
              text={r.target}
              highlights={r.target_guess}
              className="concordance-guess"
            />
          </div>
          <span className="concordance-full-tm">{r.tm_name}</span>
        </div>
      ))}
    </div>
  );
}
