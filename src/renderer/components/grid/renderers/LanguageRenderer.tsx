import type { CustomCellRendererProps } from 'ag-grid-react';
import type { Project } from '../../../../shared/types/project';

export function LanguageRenderer(props: CustomCellRendererProps): React.ReactElement {
  const data = props.data as Project | undefined;
  if (!data) return <span>—</span>;

  return (
    <span>
      {data.source_lang} <span style={{ color: 'var(--color-text-muted)' }}>→</span>{' '}
      {data.target_lang}
    </span>
  );
}
