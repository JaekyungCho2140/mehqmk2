import { useState, useCallback } from 'react';
import type { Project } from '../../shared/types/project';
import { ProjectGrid } from '../components/grid/ProjectGrid';
import { SearchFilter } from '../components/SearchFilter';
import { DetailsPaneProject } from '../components/DetailsPaneProject';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { CloneProjectDialog } from '../components/CloneProjectDialog';
import '../styles/details-pane.css';
import '../styles/dialog.css';

interface ContextMenuState {
  readonly project: Project;
  readonly x: number;
  readonly y: number;
}

type DialogState =
  | { type: 'none' }
  | { type: 'delete'; project: Project }
  | { type: 'clone'; project: Project };

interface DashboardProps {
  readonly projects: Project[];
  readonly onNewProject: () => void;
  readonly onOpenProject: (project: Project) => void;
  readonly onProjectChanged: () => void;
}

export function Dashboard({
  projects,
  onNewProject,
  onOpenProject,
  onProjectChanged,
}: DashboardProps): React.ReactElement {
  const [searchText, setSearchText] = useState('');
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ type: 'none' });

  const handleDoubleClick = useCallback(
    (project: Project) => {
      onOpenProject(project);
    },
    [onOpenProject],
  );

  const handleContextMenu = useCallback((project: Project, x: number, y: number) => {
    setContextMenu({ project, x, y });
    setSelectedProject(project);
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleRowClick = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleDelete = useCallback(
    async (project: Project) => {
      await window.electronAPI.project.delete(project.id);
      setSelectedProject(null);
      setDialog({ type: 'none' });
      onProjectChanged();
    },
    [onProjectChanged],
  );

  const handleClone = useCallback(
    async (newName: string) => {
      if (dialog.type !== 'clone') return;
      await window.electronAPI.project.clone(dialog.project.id, newName);
      setDialog({ type: 'none' });
      onProjectChanged();
    },
    [dialog, onProjectChanged],
  );

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

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
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
            onRowClick={handleRowClick}
          />
        )}

        {selectedProject && (
          <DetailsPaneProject
            project={selectedProject}
            onOpen={() => onOpenProject(selectedProject)}
            onClone={() => setDialog({ type: 'clone', project: selectedProject })}
            onDelete={() => setDialog({ type: 'delete', project: selectedProject })}
          />
        )}
      </div>

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
            <div
              className="context-menu-item"
              onClick={() => {
                setDialog({ type: 'clone', project: contextMenu.project });
                closeContextMenu();
              }}
            >
              Clone
            </div>
            <div
              className="context-menu-item"
              onClick={() => {
                setDialog({ type: 'delete', project: contextMenu.project });
                closeContextMenu();
              }}
            >
              Delete
            </div>
            <div className="context-menu-divider" />
            <div className="context-menu-item context-menu-item--disabled">Properties</div>
          </div>
        </div>
      )}

      {dialog.type === 'delete' && (
        <ConfirmDialog
          title="프로젝트 삭제"
          description={`'${dialog.project.name}' 프로젝트를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`}
          confirmLabel="Delete"
          confirmVariant="danger"
          onConfirm={() => handleDelete(dialog.project)}
          onCancel={() => setDialog({ type: 'none' })}
        />
      )}

      {dialog.type === 'clone' && (
        <CloneProjectDialog
          originalName={dialog.project.name}
          onClone={handleClone}
          onCancel={() => setDialog({ type: 'none' })}
        />
      )}
    </div>
  );
}
