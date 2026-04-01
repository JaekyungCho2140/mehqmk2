import type { Project } from '../../../shared/types/project';
import { StatusIcon } from '../../components/StatusIcon';
import { Button } from '../../components/Button';

interface GeneralTabProps {
  readonly project: Project;
  readonly onOpenEditor?: () => void;
  readonly onImportDocument?: () => void;
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
}: GeneralTabProps): React.ReactElement {
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
    </div>
  );
}
