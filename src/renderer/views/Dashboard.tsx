import { Button } from '../components/Button';
import type { Project } from '../../shared/types/project';

interface DashboardProps {
  readonly projects: Project[];
  readonly onNewProject: () => void;
}

export function Dashboard({ projects, onNewProject }: DashboardProps): React.ReactElement {
  return (
    <div className="dashboard" data-testid="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title" data-testid="dashboard-title">
          mehQ Dashboard
        </h1>
      </div>

      {projects.length === 0 ? (
        <div className="dashboard-empty">
          <p data-testid="dashboard-empty-message">
            프로젝트가 없습니다. 새 프로젝트를 생성하세요.
          </p>
        </div>
      ) : (
        <div className="dashboard-project-list" data-testid="dashboard-project-list">
          {projects.map((project) => (
            <div
              key={project.id}
              className="dashboard-project-item"
              data-testid="dashboard-project-item"
            >
              <span className="project-item-name">{project.name}</span>
              <span className="project-item-langs">
                {project.source_lang} → {project.target_lang}
              </span>
              <span className="project-item-status">{project.status}</span>
            </div>
          ))}
        </div>
      )}

      <div className="dashboard-footer">
        <Button onClick={onNewProject} data-testid="dashboard-new-project-btn">
          + New Project
        </Button>
      </div>
    </div>
  );
}
