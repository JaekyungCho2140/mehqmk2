import type { CustomCellRendererProps } from 'ag-grid-react';

export function SourceCellRenderer(props: CustomCellRendererProps): React.ReactElement {
  return <div className="source-cell">{props.value || ''}</div>;
}
