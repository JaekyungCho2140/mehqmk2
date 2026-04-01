import { Button } from '../components/Button';

export function Dashboard(): React.ReactElement {
  return (
    <div className="dashboard" data-testid="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title" data-testid="dashboard-title">
          mehQ Dashboard
        </h1>
      </div>
      <div className="dashboard-empty">
        <p data-testid="dashboard-empty-message">프로젝트가 없습니다. 새 프로젝트를 생성하세요.</p>
      </div>
      <div className="dashboard-footer">
        <Button disabled data-testid="dashboard-new-project-btn">
          + New Project
        </Button>
      </div>
    </div>
  );
}
