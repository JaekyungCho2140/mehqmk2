import { useState, useCallback } from 'react';
import { useSettings } from './hooks/useSettings';
import { useProjects } from './hooks/useProjects';
import { WelcomeWizard } from './views/WelcomeWizard';
import { Dashboard } from './views/Dashboard';
import { NewProjectWizard } from './views/NewProjectWizard';
import { ProjectHome } from './views/ProjectHome';
import { TranslationEditor } from './views/TranslationEditor';
import type { Project } from '../shared/types/project';
import './styles/components.css';
import './styles/wizard.css';

type AppView =
  | { type: 'loading' }
  | { type: 'wizard' }
  | { type: 'dashboard' }
  | { type: 'new-project' }
  | { type: 'project-home'; projectId: string }
  | { type: 'editor'; projectId: string; projectName: string };

export function App(): React.ReactElement {
  const { settings, loading: settingsLoading } = useSettings();
  const { projects, reload: reloadProjects } = useProjects();
  const [view, setView] = useState<AppView>({ type: 'loading' });

  // settings 로드 후 초기 뷰 결정
  if (view.type === 'loading' && !settingsLoading && settings) {
    if (!settings.wizard_completed) {
      setView({ type: 'wizard' });
    } else {
      setView({ type: 'dashboard' });
    }
  }

  const handleWelcomeComplete = useCallback(() => {
    setView({ type: 'dashboard' });
  }, []);

  const handleNewProjectComplete = useCallback(async () => {
    await reloadProjects();
    setView({ type: 'dashboard' });
  }, [reloadProjects]);

  const handleOpenProject = useCallback(async (project: Project) => {
    await window.electronAPI.project.open(project.id);
    setView({ type: 'project-home', projectId: project.id });
  }, []);

  const handleBackToDashboard = useCallback(async () => {
    await reloadProjects();
    setView({ type: 'dashboard' });
  }, [reloadProjects]);

  const handleOpenEditor = useCallback((projectId: string, projectName: string) => {
    setView({ type: 'editor', projectId, projectName });
  }, []);

  if (view.type === 'loading' || settingsLoading) {
    return (
      <div className="loading-screen" data-testid="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (view.type === 'wizard') {
    return (
      <WelcomeWizard
        defaultWorkDirectory={settings?.work_directory ?? ''}
        onComplete={handleWelcomeComplete}
      />
    );
  }

  if (view.type === 'new-project') {
    return (
      <NewProjectWizard
        onComplete={handleNewProjectComplete}
        onCancel={() => setView({ type: 'dashboard' })}
      />
    );
  }

  if (view.type === 'editor') {
    return (
      <TranslationEditor
        projectId={view.projectId}
        projectName={view.projectName}
        onBack={() => setView({ type: 'project-home', projectId: view.projectId })}
      />
    );
  }

  if (view.type === 'project-home') {
    return (
      <ProjectHome
        projectId={view.projectId}
        onBack={handleBackToDashboard}
        onOpenEditor={handleOpenEditor}
      />
    );
  }

  return (
    <Dashboard
      projects={projects}
      onNewProject={() => setView({ type: 'new-project' })}
      onOpenProject={handleOpenProject}
      onProjectChanged={reloadProjects}
    />
  );
}
