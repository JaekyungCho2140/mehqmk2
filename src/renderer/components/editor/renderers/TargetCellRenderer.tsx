import type { CustomCellRendererProps } from 'ag-grid-react';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function TargetCellRenderer(props: CustomCellRendererProps): React.ReactElement {
  const raw = props.value as string;
  const text = stripHtml(raw ?? '');
  const isActive = props.node.isSelected();

  return (
    <div className={`target-cell ${isActive ? 'target-cell--active' : ''}`}>
      {text ? text : <span className="target-cell-empty">(empty)</span>}
    </div>
  );
}
