import type { ConcordanceResultItem } from '../../../shared/types/tm';

interface KwicViewProps {
  readonly results: ConcordanceResultItem[];
  readonly onInsert: (target: string) => void;
}

interface KwicRow {
  readonly left: string;
  readonly keyword: string;
  readonly right: string;
  readonly target: string;
  readonly tu_id: string;
}

function buildKwicRows(results: ConcordanceResultItem[]): KwicRow[] {
  const rows: KwicRow[] = [];

  for (const r of results) {
    for (const h of r.source_highlight) {
      const left = r.source.slice(Math.max(0, h.start - 40), h.start);
      const keyword = r.source.slice(h.start, h.end);
      const right = r.source.slice(h.end, h.end + 40);

      rows.push({ left, keyword, right, target: r.target, tu_id: r.tu_id });
    }
  }

  // Sort by keyword alphabetically
  rows.sort((a, b) => a.keyword.localeCompare(b.keyword));
  return rows;
}

export function KwicView({ results, onInsert }: KwicViewProps): React.ReactElement {
  const rows = buildKwicRows(results);

  return (
    <div className="concordance-kwic-view">
      {rows.map((row, i) => (
        <div
          key={`${row.tu_id}-${i}`}
          className="kwic-row"
          onDoubleClick={() => onInsert(row.target)}
          data-testid={`kwic-row-${i}`}
        >
          <span className="kwic-left">{row.left}</span>
          <span className="kwic-keyword">{row.keyword}</span>
          <span className="kwic-right">{row.right}</span>
        </div>
      ))}
    </div>
  );
}
