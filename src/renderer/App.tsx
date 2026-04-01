import { useState, useCallback } from 'react';
import { useSettings } from './hooks/useSettings';
import { useProjects } from './hooks/useProjects';
import { WelcomeWizard } from './views/WelcomeWizard';
import { Dashboard } from './views/Dashboard';
import { NewProjectWizard } from './views/NewProjectWizard';
import './styles/components.css';
import './styles/wizard.css';

type View = 'loading' | 'welcome-wizard' | 'dashboard' | 'new-project';

export function App(): React.ReactElement {
  const { settings, loading: settingsLoading } = useSettings();
  const { projects, reload: reloadProjects } = useProjects();
  const [view, setView] = useState<View>('loading');

  // settings 로드 후 초기 뷰 결정
  if (view === 'loading' && !settingsLoading && settings) {
    if (!settings.wizard_completed) {
      setView('welcome-wizard');
    } else {
      setView('dashboard');
    }
  }

  const handleWelcomeComplete = useCallback(() => {
    setView('dashboard');
  }, []);

  const handleNewProjectComplete = useCallback(async () => {
    await reloadProjects();
    setView('dashboard');
  }, [reloadProjects]);

  if (view === 'loading' || settingsLoading) {
    return (
      <div className="loading-screen" data-testid="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (view === 'welcome-wizard') {
    return (
      <WelcomeWizard
        defaultWorkDirectory={settings?.work_directory ?? ''}
        onComplete={handleWelcomeComplete}
      />
    );
  }

  if (view === 'new-project') {
    return (
      <NewProjectWizard
        onComplete={handleNewProjectComplete}
        onCancel={() => setView('dashboard')}
      />
    );
  }

  return <Dashboard projects={projects} onNewProject={() => setView('new-project')} />;
}
