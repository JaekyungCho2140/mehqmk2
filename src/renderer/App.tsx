import { useState, useCallback } from 'react';
import { useSettings } from './hooks/useSettings';
import { WelcomeWizard } from './views/WelcomeWizard';
import { Dashboard } from './views/Dashboard';
import './styles/components.css';
import './styles/wizard.css';

export function App(): React.ReactElement {
  const { settings, loading } = useSettings();
  const [wizardCompleted, setWizardCompleted] = useState<boolean | null>(null);

  // settings 로드 후 wizard_completed 상태 동기화
  if (settings && wizardCompleted === null) {
    setWizardCompleted(settings.wizard_completed);
  }

  const handleWizardComplete = useCallback(() => {
    setWizardCompleted(true);
  }, []);

  if (loading || wizardCompleted === null) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!wizardCompleted) {
    return (
      <WelcomeWizard
        defaultWorkDirectory={settings?.work_directory ?? ''}
        onComplete={handleWizardComplete}
      />
    );
  }

  return <Dashboard />;
}
