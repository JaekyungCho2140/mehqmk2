import { useState, useEffect } from 'react';
import type { Project } from '../../../shared/types/project';
import type { TranslationMemory } from '../../../shared/types/tm';
import { StatusIcon } from '../../components/StatusIcon';
import { Button } from '../../components/Button';

interface GeneralTabProps {
  readonly project: Project;
  readonly onOpenEditor?: () => void;
  readonly onImportDocument?: () => void;
  readonly onOpenTmEditor?: (tmId: string) => void;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return dateStr.split('T')[0] ?? dateStr;
}

function InfoCell({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div>
      <div className="general-info-label">{label}</div>
      <div className="general-info-value">{value || '—'}</div>
    </div>
  );
}

export function GeneralTab({
  project,
  onOpenEditor,
  onImportDocument,
  onOpenTmEditor,
}: GeneralTabProps): React.ReactElement {
  const [projectTms, setProjectTms] = useState<TranslationMemory[]>([]);

  useEffect(() => {
    let cancelled = false;
    window.electronAPI.tm.listByProject(project.id).then((tms) => {
      if (!cancelled) setProjectTms(tms);
    });
    return () => { cancelled = true; };
  }, [project.id]);

  return (
    <div className="general-tab" data-testid="general-tab">
      <div className="general-header">
        <h2 className="general-project-name">{project.name}</h2>
        <div className="general-status-badge">
          <StatusIcon status={project.status} />
          <span>{project.status.replace(/-/g, ' ')}</span>
        </div>
      </div>

      <div className="general-info-card">
        <div className="general-info-grid">
          <InfoCell label="Languages" value={`${project.source_lang} → ${project.target_lang}`} />
          <InfoCell label="Deadline" value={formatDate(project.deadline)} />
          <InfoCell label="Client" value={project.client} />
          <InfoCell label="Domain" value={project.domain} />
          <InfoCell label="Created by" value={project.created_by} />
          <InfoCell label="Created at" value={formatDate(project.created_at)} />
        </div>
      </div>

      {onOpenEditor && (
        <div style={{ marginTop: 'var(--spacing-lg)' }}>
          <Button onClick={onOpenEditor} data-testid="open-editor-btn">
            Open in Editor
          </Button>
        </div>
      )}

      <div className="general-documents-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 className="general-documents-title">Documents</h3>
          {onImportDocument && (
            <Button onClick={onImportDocument} data-testid="import-document-btn">
              Import Document
            </Button>
          )}
        </div>
        <div className="general-documents-empty">
          <p>문서가 없습니다. Import Document로 XLIFF 파일을 추가하세요.</p>
        </div>
      </div>

      <div className="general-documents-section" data-testid="project-tm-section">
        <h3 className="general-documents-title">Translation Memories</h3>
        {projectTms.length === 0 ? (
          <div className="general-documents-empty">
            <p>연결된 TM이 없습니다.</p>
          </div>
        ) : (
          <div className="tm-list-cards">
            {projectTms.map((tm) => (
              <div
                key={tm.id}
                className="tm-list-card"
                onDoubleClick={() => onOpenTmEditor?.(tm.id)}
                data-testid={`project-tm-${tm.id}`}
              >
                <div className="tm-list-card-name">{tm.name}</div>
                <div className="tm-list-card-info">
                  <span>{tm.source_lang} → {tm.target_lang}</span>
                  <span className="tm-list-card-role">{tm.role}</span>
                  <span>{tm.entry_count} entries</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
