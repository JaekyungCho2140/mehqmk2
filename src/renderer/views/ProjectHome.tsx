import { Button } from '../components/Button';
import type { Project } from '../../shared/types/project';

interface ProjectHomeProps {
  readonly project: Project;
  readonly onBack: () => void;
}

export function ProjectHome({ project, onBack }: ProjectHomeProps): React.ReactElement {
  return (
    <div className="dashboard" data-testid="project-home">
      <div className="dashboard-toolbar">
        <Button variant="ghost" onClick={onBack} data-testid="project-home-back-btn">
          ← Dashboard
        </Button>
        <h2
          style={{ margin: 0, fontSize: 18, fontWeight: 600, flex: 1 }}
          data-testid="project-home-title"
        >
          {project.name}
        </h2>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
          {project.source_lang} → {project.target_lang}
        </span>
      </div>
      <div className="dashboard-empty">
        <p>Sprint 2-4에서 Project Home 콘텐츠가 추가됩니다.</p>
      </div>
    </div>
  );
}
