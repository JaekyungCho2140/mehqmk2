import type { CustomCellRendererProps } from 'ag-grid-react';
import type { SegmentStatus } from '../../../../shared/types/segment';

const STATUS_COLORS: Record<SegmentStatus, string> = {
  'not-started': '#d1d5db',
  edited: '#f9a8d4',
  'pre-translated': '#93c5fd',
  assembled: '#c4b5fd',
  confirmed: '#86efac',
  'r1-confirmed': '#4ade80',
  'r2-confirmed': '#22c55e',
  locked: '#9ca3af',
  rejected: '#fca5a5',
};

export function StatusBoxRenderer(props: CustomCellRendererProps): React.ReactElement {
  const status = (props.value as SegmentStatus) ?? 'not-started';
  const color = STATUS_COLORS[status];

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
    >
      <div
        className="status-box"
        style={{ backgroundColor: color }}
        title={status.replace(/-/g, ' ')}
      >
        {status === 'locked' && <span className="status-box-lock">🔒</span>}
      </div>
    </div>
  );
}
