import type { TmMatch } from '../../../shared/types/tm';

interface MetaInfoProps {
  readonly match: TmMatch | null;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('ko-KR');
}

function roleLabel(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function MetaInfo({ match }: MetaInfoProps): React.ReactElement {
  if (!match) {
    return (
      <div className="meta-info" data-testid="meta-info">
        <span className="meta-info-empty">결과를 선택하세요</span>
      </div>
    );
  }

  return (
    <div className="meta-info" data-testid="meta-info">
      <div className="meta-info-grid">
        <div className="meta-info-item">
          <span className="meta-info-label">TM</span>
          <span className="meta-info-value">
            {match.tm_name} ({roleLabel(match.tm_role)})
          </span>
        </div>
        <div className="meta-info-item">
          <span className="meta-info-label">Created</span>
          <span className="meta-info-value">{match.created_by || '—'}</span>
        </div>
        <div className="meta-info-item">
          <span className="meta-info-label">Modified</span>
          <span className="meta-info-value">{formatDate(match.modified_at)}</span>
        </div>
        <div className="meta-info-item">
          <span className="meta-info-label">Match</span>
          <span className="meta-info-value">{match.match_rate}% ({match.match_type})</span>
        </div>
      </div>
    </div>
  );
}
