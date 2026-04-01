import { useState, useCallback } from 'react';
import type { Project } from '../../shared/types/project';
import { ProjectGrid } from '../components/grid/ProjectGrid';
import { SearchFilter } from '../components/SearchFilter';

interface ContextMenuState {
  readonly project: Project;
  readonly x: number;
  readonly y: number;
}

interface DashboardProps {
  readonly projects: Project[];
  readonly onNewProject: () => void;
  readonly onOpenProject: (project: Project) => void;
}

export function Dashboard({
  projects,
  onNewProject,
  onOpenProject,
}: DashboardProps): React.ReactElement {
  const [searchText, setSearchText] = useState('');
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const handleDoubleClick = useCallback(
    (project: Project) => {
      onOpenProject(project);
    },
    [onOpenProject],
  );

  const handleContextMenu = useCallback((project: Project, x: number, y: number) => {
    setContextMenu({ project, x, y });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return (
    <div className="dashboard" data-testid="dashboard-container">
      <div className="dashboard-toolbar">
        <h1 className="dashboard-logo" data-testid="dashboard-title">
          mehQ
        </h1>
        <div className="dashboard-toolbar-center">
          <SearchFilter onSearch={setSearchText} />
        </div>
        <div className="dashboard-toolbar-right">
          <button
            className="btn--toolbar"
            onClick={onNewProject}
            data-testid="dashboard-new-project-btn"
          >
            + New Project
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="dashboard-empty">
          <p data-testid="dashboard-empty-message">
            프로젝트가 없습니다. 새 프로젝트를 생성하세요.
          </p>
        </div>
      ) : (
        <ProjectGrid
          projects={projects}
          searchText={searchText}
          onDoubleClick={handleDoubleClick}
          onContextMenu={handleContextMenu}
        />
      )}

      {contextMenu && (
        <div className="context-menu-overlay" onClick={closeContextMenu}>
          <div
            className="context-menu"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            data-testid="context-menu"
          >
            <div
              className="context-menu-item"
              onClick={() => {
                onOpenProject(contextMenu.project);
                closeContextMenu();
              }}
            >
              Open
            </div>
            <div className="context-menu-item context-menu-item--disabled">Clone</div>
            <div className="context-menu-item context-menu-item--disabled">Delete</div>
            <div className="context-menu-divider" />
            <div className="context-menu-item context-menu-item--disabled">Properties</div>
          </div>
        </div>
      )}
    </div>
  );
}
