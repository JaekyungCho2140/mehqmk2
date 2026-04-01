import type { CustomCellRendererProps } from 'ag-grid-react';
import type { ProjectStatus } from '../../../../shared/types/project';

const STATUS_STYLES: Record<ProjectStatus, { bg: string; border?: string; icon: string }> = {
  'not-started': { bg: 'transparent', border: '#9ca3af', icon: '' },
  'in-progress': { bg: '#f59e0b', icon: '' },
  'translation-done': { bg: '#3b82f6', icon: '' },
  'r1-done': { bg: '#22c55e', icon: '✓' },
  'r2-done': { bg: '#16a34a', icon: '✓✓' },
  completed: { bg: '#16a34a', icon: '★' },
};

export function StatusRenderer(props: CustomCellRendererProps): React.ReactElement {
  const status = (props.value as ProjectStatus) ?? 'not-started';
  const style = STATUS_STYLES[status];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: style.bg,
          border: style.border ? `2px solid ${style.border}` : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: style.icon === '✓✓' ? 8 : 10,
          lineHeight: 1,
        }}
      >
        {style.icon}
      </div>
    </div>
  );
}
