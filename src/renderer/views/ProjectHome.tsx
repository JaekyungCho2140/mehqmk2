import { useState, useCallback, useEffect } from 'react';
import type { Project } from '../../shared/types/project';
import { TabBar } from '../components/TabBar';
import { Breadcrumb } from '../components/Breadcrumb';
import { Toast } from '../components/Toast';
import { GeneralTab } from './project/GeneralTab';
import { ReportsTab } from './project/ReportsTab';
import { SettingsTab } from './project/SettingsTab';
import '../styles/project-home.css';

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
] as const;

interface ProjectHomeProps {
  readonly projectId: string;
  readonly onBack: () => void;
}

export function ProjectHome({ projectId, onBack }: ProjectHomeProps): React.ReactElement {
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    window.electronAPI.project.get(projectId).then((p) => {
      if (!cancelled) setProject(p);
    });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const handleSettingsSave = useCallback((updated: Project) => {
    setProject(updated);
    setToast('저장되었습니다');
  }, []);

  if (!project) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="project-home" data-testid="project-home">
      <div className="project-home-toolbar">
        <div className="project-home-toolbar-left">
          <button className="back-btn" onClick={onBack} data-testid="project-home-back-btn">
            ←
          </button>
          <Breadcrumb items={[{ label: 'Dashboard', onClick: onBack }, { label: project.name }]} />
        </div>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="project-home-content">
        {activeTab === 'general' && <GeneralTab project={project} />}
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'settings' && <SettingsTab project={project} onSave={handleSettingsSave} />}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
