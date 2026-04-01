import type { CustomCellRendererProps } from 'ag-grid-react';

export function SegmentNumberRenderer(props: CustomCellRendererProps): React.ReactElement {
  return <div className="seg-number-cell">{props.value}</div>;
}
