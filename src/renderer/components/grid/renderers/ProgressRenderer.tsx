import type { CustomCellRendererProps } from 'ag-grid-react';

function getProgressColor(pct: number): string {
  if (pct < 30) return '#ef4444';
  if (pct < 70) return '#f59e0b';
  return '#22c55e';
}

export function ProgressRenderer(props: CustomCellRendererProps): React.ReactElement {
  // Phase 4에서 실제 progress 사용, 현재는 0
  const progress = (props.value as number | undefined) ?? 0;
  const pct = Math.round(progress * 100);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: '100%' }}>
      <div
        style={{
          flex: 1,
          height: 6,
          borderRadius: 3,
          backgroundColor: 'var(--color-bg-tertiary)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 3,
            backgroundColor: getProgressColor(pct),
            transition: 'width 200ms ease',
          }}
        />
      </div>
      <span
        style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', minWidth: 32 }}
      >
        {pct}%
      </span>
    </div>
  );
}
