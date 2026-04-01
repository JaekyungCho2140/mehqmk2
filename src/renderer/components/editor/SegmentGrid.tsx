import { useMemo, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type RowClickedEvent } from 'ag-grid-community';
import type { Segment } from '../../../shared/types/segment';
import { createSegmentColumnDefs } from './columns';
import { SegmentNumberRenderer } from './renderers/SegmentNumberRenderer';
import { StatusBoxRenderer } from './renderers/StatusBoxRenderer';
import { SourceCellRenderer } from './renderers/SourceCellRenderer';
import { TargetCellRenderer } from './renderers/TargetCellRenderer';

ModuleRegistry.registerModules([AllCommunityModule]);

interface SegmentGridProps {
  readonly segments: Segment[];
  readonly activeSegmentId: string | null;
  readonly onSegmentSelect: (segment: Segment) => void;
}

export function SegmentGrid({
  segments,
  activeSegmentId,
  onSegmentSelect,
}: SegmentGridProps): React.ReactElement {
  const gridRef = useRef<AgGridReact<Segment>>(null);
  const columnDefs = useMemo(() => createSegmentColumnDefs(), []);

  const components = useMemo(
    () => ({
      segmentNumberRenderer: SegmentNumberRenderer,
      statusBoxRenderer: StatusBoxRenderer,
      sourceCellRenderer: SourceCellRenderer,
      targetCellRenderer: TargetCellRenderer,
    }),
    [],
  );

  const handleRowClicked = useCallback(
    (event: RowClickedEvent<Segment>) => {
      if (event.data) onSegmentSelect(event.data);
    },
    [onSegmentSelect],
  );

  const getRowClass = useCallback(
    (params: { data: Segment | undefined }) => {
      if (params.data && params.data.id === activeSegmentId) {
        return 'seg-row--active';
      }
      return '';
    },
    [activeSegmentId],
  );

  return (
    <div className="ag-theme-mehq segment-grid" data-testid="segment-grid">
      <AgGridReact<Segment>
        ref={gridRef}
        rowData={segments}
        columnDefs={columnDefs}
        components={components}
        onRowClicked={handleRowClicked}
        rowSelection={{ mode: 'singleRow' }}
        suppressCellFocus
        animateRows={false}
        getRowId={(params) => params.data.id}
        getRowClass={getRowClass}
        headerHeight={36}
        rowHeight={40}
      />
    </div>
  );
}
