import type { SegmentStats } from '../../hooks/useSegmentStats';
import { STATUS_ABBR } from '../../hooks/useSegmentStats';
import '../../styles/statusbar.css';

const STATUS_COLORS: Record<string, string> = {
  TR: '#22c55e',
  R1: '#16a34a',
  R2: '#15803d',
  Ed: '#f9a8d4',
  Rej: '#fca5a5',
  Empty: '#9ca3af',
  Pre: '#93c5fd',
  Frag: '#c4b5fd',
  Lock: '#6b7280',
};

interface StatusBarProps {
  readonly stats: SegmentStats;
  readonly isFiltered: boolean;
}

export function StatusBar({ stats, isFiltered }: StatusBarProps): React.ReactElement {
  return (
    <div className="status-bar" data-testid="editor-statusbar">
      <span className="status-bar-completeness">{stats.completeness}%</span>
      <span className="status-bar-divider" />

      <span className="status-bar-counts">
        {Object.values(STATUS_ABBR).map((abbr) => (
          <span key={abbr} className="status-bar-count-item">
            <span style={{ color: STATUS_COLORS[abbr] }}>{abbr}</span>
            <span>:{stats.counts[abbr] ?? 0}</span>
          </span>
        ))}
      </span>

      <span className="status-bar-divider" />

      {isFiltered && (
        <>
          <span className="status-bar-filter-info">
            필터: {stats.filtered}/{stats.total}
          </span>
          <span className="status-bar-divider" />
        </>
      )}

      <span className="status-bar-segment">
        Seg {stats.currentIndex}/{stats.total}
      </span>
    </div>
  );
}
