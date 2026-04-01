import type { CustomCellRendererProps } from 'ag-grid-react';

export function TargetCellRenderer(props: CustomCellRendererProps): React.ReactElement {
  const text = props.value as string;
  const isActive = props.node.isSelected();

  return (
    <div className={`target-cell ${isActive ? 'target-cell--active' : ''}`}>
      {text ? text : <span className="target-cell-empty">(empty)</span>}
    </div>
  );
}
