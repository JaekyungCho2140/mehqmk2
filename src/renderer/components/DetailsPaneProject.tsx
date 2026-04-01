import type { Project } from '../../shared/types/project';
import { StatusIcon } from './StatusIcon';
import { Button } from './Button';

interface DetailsPaneProjectProps {
  readonly project: Project;
  readonly onOpen: () => void;
  readonly onClone: () => void;
  readonly onDelete: () => void;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return dateStr.split('T')[0] ?? dateStr;
}

function daysUntil(dateStr: string | null): string {
  if (!dateStr) return '';
  const diff = Math.ceil(
    (new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0) return ` (${Math.abs(diff)}일 초과)`;
  if (diff === 0) return ' (오늘)';
  return ` (${diff}일 남음)`;
}

function InfoRow({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="details-info-row">
      <div className="details-info-label">{label}</div>
      <div className="details-info-value">{value || '—'}</div>
    </div>
  );
}

export function DetailsPaneProject({
  project,
  onOpen,
  onClone,
  onDelete,
}: DetailsPaneProjectProps): React.ReactElement {
  return (
    <div className="details-pane" data-testid="details-pane">
      <h3 className="details-pane-title" data-testid="details-pane-title">
        {project.name}
      </h3>

      {project.description && <p className="details-pane-description">{project.description}</p>}

      <div className="details-pane-divider" />

      <div className="details-info-row">
        <div className="details-info-label">Status</div>
        <div
          className="details-info-value"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <StatusIcon status={project.status} />
          <span>{project.status.replace(/-/g, ' ')}</span>
        </div>
      </div>

      <InfoRow label="Languages" value={`${project.source_lang} → ${project.target_lang}`} />
      <InfoRow
        label="Deadline"
        value={`${formatDate(project.deadline)}${daysUntil(project.deadline)}`}
      />
      <InfoRow label="Client" value={project.client} />
      <InfoRow label="Domain" value={project.domain} />
      <InfoRow label="Subject" value={project.subject} />

      <div className="details-pane-divider" />

      <InfoRow label="Created by" value={project.created_by} />
      <InfoRow label="Created at" value={formatDate(project.created_at)} />
      <InfoRow label="Last accessed" value={formatDate(project.last_accessed)} />

      <div className="details-pane-divider" />

      <InfoRow label="Directory" value={project.directory} />

      <div className="details-pane-actions">
        <Button onClick={onOpen} data-testid="details-pane-open-btn" className="details-btn-full">
          Open
        </Button>
        <button
          className="btn-secondary-full"
          onClick={onClone}
          data-testid="details-pane-clone-btn"
        >
          Clone
        </button>
        <button
          className="btn-text-danger"
          onClick={onDelete}
          data-testid="details-pane-delete-btn"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
