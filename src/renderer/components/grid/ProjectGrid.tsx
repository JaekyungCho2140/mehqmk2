import { useMemo, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  ModuleRegistry,
  type RowDoubleClickedEvent,
  type RowClickedEvent,
  type CellContextMenuEvent,
} from 'ag-grid-community';
import type { Project } from '../../../shared/types/project';
import { createColumnDefs } from './columns';
import { StatusRenderer } from './renderers/StatusRenderer';
import { LanguageRenderer } from './renderers/LanguageRenderer';
import { DeadlineRenderer } from './renderers/DeadlineRenderer';
import { ProgressRenderer } from './renderers/ProgressRenderer';
import '../../styles/grid.css';

ModuleRegistry.registerModules([AllCommunityModule]);

interface ProjectGridProps {
  readonly projects: Project[];
  readonly searchText: string;
  readonly onDoubleClick: (project: Project) => void;
  readonly onContextMenu: (project: Project, x: number, y: number) => void;
  readonly onRowClick?: (project: Project) => void;
}

export function ProjectGrid({
  projects,
  searchText,
  onDoubleClick,
  onContextMenu,
  onRowClick,
}: ProjectGridProps): React.ReactElement {
  const gridRef = useRef<AgGridReact<Project>>(null);
  const columnDefs = useMemo(() => createColumnDefs(), []);

  const components = useMemo(
    () => ({
      statusRenderer: StatusRenderer,
      languageRenderer: LanguageRenderer,
      deadlineRenderer: DeadlineRenderer,
      progressRenderer: ProgressRenderer,
    }),
    [],
  );

  const doesExternalFilterPass = useCallback(
    (node: { data: Project | undefined }) => {
      if (!searchText || !node.data) return true;
      const q = searchText.toLowerCase();
      const d = node.data;
      return (
        d.name.toLowerCase().includes(q) ||
        d.client.toLowerCase().includes(q) ||
        d.domain.toLowerCase().includes(q)
      );
    },
    [searchText],
  );

  const isExternalFilterPresent = useCallback(() => !!searchText, [searchText]);

  const handleRowDoubleClicked = useCallback(
    (event: RowDoubleClickedEvent<Project>) => {
      if (event.data) onDoubleClick(event.data);
    },
    [onDoubleClick],
  );

  const handleRowClicked = useCallback(
    (event: RowClickedEvent<Project>) => {
      if (event.data && onRowClick) onRowClick(event.data);
    },
    [onRowClick],
  );

  const handleCellContextMenu = useCallback(
    (event: CellContextMenuEvent<Project>) => {
      const mouseEvent = event.event as MouseEvent | undefined;
      if (event.data && mouseEvent) {
        mouseEvent.preventDefault();
        onContextMenu(event.data, mouseEvent.clientX, mouseEvent.clientY);
      }
    },
    [onContextMenu],
  );

  return (
    <div className="ag-theme-mehq" style={{ flex: 1 }} data-testid="project-grid">
      <AgGridReact<Project>
        ref={gridRef}
        rowData={projects}
        columnDefs={columnDefs}
        components={components}
        isExternalFilterPresent={isExternalFilterPresent}
        doesExternalFilterPass={doesExternalFilterPass}
        onRowClicked={handleRowClicked}
        onRowDoubleClicked={handleRowDoubleClicked}
        onCellContextMenu={handleCellContextMenu}
        rowSelection={{ mode: 'singleRow' }}
        suppressCellFocus
        animateRows={false}
        getRowId={(params) => params.data.id}
      />
    </div>
  );
}
