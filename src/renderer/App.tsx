import { useState, useCallback } from 'react';
import { useSettings } from './hooks/useSettings';
import { useProjects } from './hooks/useProjects';
import { WelcomeWizard } from './views/WelcomeWizard';
import { Dashboard } from './views/Dashboard';
import { NewProjectWizard } from './views/NewProjectWizard';
import { ProjectHome } from './views/ProjectHome';
import type { Project } from '../shared/types/project';
import './styles/components.css';
import './styles/wizard.css';

type View =
  | { name: 'loading' }
  | { name: 'welcome-wizard' }
  | { name: 'dashboard' }
  | { name: 'new-project' }
  | { name: 'project-home'; project: Project };

export function App(): React.ReactElement {
  const { settings, loading: settingsLoading } = useSettings();
  const { projects, reload: reloadProjects } = useProjects();
  const [view, setView] = useState<View>({ name: 'loading' });

  // settings 로드 후 초기 뷰 결정
  if (view.name === 'loading' && !settingsLoading && settings) {
    if (!settings.wizard_completed) {
      setView({ name: 'welcome-wizard' });
    } else {
      setView({ name: 'dashboard' });
    }
  }

  const handleWelcomeComplete = useCallback(() => {
    setView({ name: 'dashboard' });
  }, []);

  const handleNewProjectComplete = useCallback(async () => {
    await reloadProjects();
    setView({ name: 'dashboard' });
  }, [reloadProjects]);

  const handleOpenProject = useCallback(async (project: Project) => {
    const opened = await window.electronAPI.project.open(project.id);
    setView({ name: 'project-home', project: opened });
  }, []);

  const handleBackToDashboard = useCallback(async () => {
    await reloadProjects();
    setView({ name: 'dashboard' });
  }, [reloadProjects]);

  if (view.name === 'loading' || settingsLoading) {
    return (
      <div className="loading-screen" data-testid="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (view.name === 'welcome-wizard') {
    return (
      <WelcomeWizard
        defaultWorkDirectory={settings?.work_directory ?? ''}
        onComplete={handleWelcomeComplete}
      />
    );
  }

  if (view.name === 'new-project') {
    return (
      <NewProjectWizard
        onComplete={handleNewProjectComplete}
        onCancel={() => setView({ name: 'dashboard' })}
      />
    );
  }

  if (view.name === 'project-home') {
    return <ProjectHome project={view.project} onBack={handleBackToDashboard} />;
  }

  return (
    <Dashboard
      projects={projects}
      onNewProject={() => setView({ name: 'new-project' })}
      onOpenProject={handleOpenProject}
    />
  );
}
