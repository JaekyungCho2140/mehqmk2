import type { ColDef } from 'ag-grid-community';
import type { Project } from '../../../shared/types/project';

export function createColumnDefs(): ColDef<Project>[] {
  return [
    {
      field: 'status',
      headerName: '',
      width: 40,
      cellRenderer: 'statusRenderer',
      sortable: false,
      resizable: false,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 2,
      sortable: true,
    },
    {
      field: 'source_lang',
      headerName: 'Languages',
      width: 120,
      cellRenderer: 'languageRenderer',
      sortable: false,
    },
    {
      field: 'client',
      headerName: 'Client',
      flex: 1,
      sortable: true,
    },
    {
      field: 'domain',
      headerName: 'Domain',
      flex: 1,
      sortable: true,
    },
    {
      field: 'deadline',
      headerName: 'Deadline',
      width: 140,
      cellRenderer: 'deadlineRenderer',
      sortable: true,
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 140,
      sortable: true,
      valueFormatter: (params) => {
        if (!params.value) return '';
        return (params.value as string).split('T')[0] ?? params.value;
      },
    },
    {
      field: 'last_accessed',
      headerName: 'Last Accessed',
      width: 140,
      sortable: true,
      sort: 'desc',
      valueFormatter: (params) => {
        if (!params.value) return '';
        return (params.value as string).split('T')[0] ?? params.value;
      },
    },
  ];
}
