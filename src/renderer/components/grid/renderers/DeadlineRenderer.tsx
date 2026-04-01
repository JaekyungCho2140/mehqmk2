import type { CustomCellRendererProps } from 'ag-grid-react';

export function DeadlineRenderer(props: CustomCellRendererProps): React.ReactElement {
  const deadline = props.value as string | null;
  if (!deadline) return <span style={{ color: 'var(--color-text-muted)' }}>—</span>;

  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const dateStr = deadline.split('T')[0];

  if (diffDays < 0) {
    return <span style={{ color: '#ef4444' }}>⚠ {dateStr}</span>;
  }

  if (diffDays <= 3) {
    return <span style={{ color: '#f59e0b' }}>{dateStr}</span>;
  }

  return <span>{dateStr}</span>;
}
