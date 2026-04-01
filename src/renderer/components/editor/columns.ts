import type { ColDef } from 'ag-grid-community';
import type { Segment } from '../../../shared/types/segment';

export function createSegmentColumnDefs(): ColDef<Segment>[] {
  return [
    {
      field: 'index',
      headerName: '#',
      width: 52,
      cellRenderer: 'segmentNumberRenderer',
      sortable: false,
      resizable: false,
      pinned: 'left',
    },
    {
      field: 'status',
      headerName: '',
      width: 32,
      cellRenderer: 'statusBoxRenderer',
      sortable: false,
      resizable: false,
    },
    {
      field: 'source',
      headerName: 'Source',
      flex: 1,
      cellRenderer: 'sourceCellRenderer',
      sortable: false,
      cellClass: 'source-column',
    },
    {
      field: 'target',
      headerName: 'Target',
      flex: 1,
      cellRenderer: 'targetCellRenderer',
      sortable: false,
    },
  ];
}
