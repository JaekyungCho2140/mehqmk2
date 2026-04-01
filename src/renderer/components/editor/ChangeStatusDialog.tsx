import { useState, useCallback } from 'react';
import type { SegmentStatus } from '../../../shared/types/segment';
import type { ChangeStatusOptions } from '../../hooks/useSegmentStatus';
import { Button } from '../Button';
import '../../styles/dialog.css';

const ALL_STATUSES: { value: SegmentStatus; label: string; color: string }[] = [
  { value: 'not-started', label: 'Not Started', color: '#d1d5db' },
  { value: 'edited', label: 'Edited', color: '#f9a8d4' },
  { value: 'pre-translated', label: 'Pre-translated', color: '#93c5fd' },
  { value: 'assembled', label: 'Assembled', color: '#c4b5fd' },
  { value: 'confirmed', label: 'Confirmed', color: '#86efac' },
  { value: 'r1-confirmed', label: 'R1 Confirmed', color: '#4ade80' },
  { value: 'r2-confirmed', label: 'R2 Confirmed', color: '#22c55e' },
  { value: 'locked', label: 'Locked', color: '#9ca3af' },
  { value: 'rejected', label: 'Rejected', color: '#fca5a5' },
];

interface ChangeStatusDialogProps {
  readonly onApply: (options: ChangeStatusOptions) => void;
  readonly onCancel: () => void;
}

export function ChangeStatusDialog({
  onApply,
  onCancel,
}: ChangeStatusDialogProps): React.ReactElement {
  const [range, setRange] = useState<'all' | 'selected' | 'from-cursor'>('all');
  const [filterStatuses, setFilterStatuses] = useState<SegmentStatus[]>([]);
  const [targetStatus, setTargetStatus] = useState<SegmentStatus>('confirmed');

  const toggleFilter = useCallback((status: SegmentStatus) => {
    setFilterStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  }, []);

  const handleApply = useCallback(() => {
    onApply({ range, filterStatuses, targetStatus });
  }, [range, filterStatuses, targetStatus, onApply]);

  return (
    <div className="dialog-overlay" onClick={onCancel} data-testid="change-status-dialog">
      <div className="dialog-card" style={{ width: 480 }} onClick={(e) => e.stopPropagation()}>
        <h3 className="dialog-title">Change Segment Status</h3>

        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <label className="text-input-label">Range</label>
          <select
            className="text-input"
            value={range}
            onChange={(e) => setRange(e.target.value as 'all' | 'selected' | 'from-cursor')}
            style={{ marginTop: 4 }}
          >
            <option value="all">Active document (전체)</option>
            <option value="selected">Selected segments</option>
            <option value="from-cursor">From cursor to end</option>
          </select>
        </div>

        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <label className="text-input-label">Filter by current status</label>
          <div className="change-status-grid">
            {ALL_STATUSES.map((s) => (
              <label key={s.value} className="change-status-checkbox">
                <input
                  type="checkbox"
                  checked={filterStatuses.includes(s.value)}
                  onChange={() => toggleFilter(s.value)}
                />
                <span className="change-status-dot" style={{ backgroundColor: s.color }} />
                <span>{s.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <label className="text-input-label">Target status</label>
          <select
            className="text-input"
            value={targetStatus}
            onChange={(e) => setTargetStatus(e.target.value as SegmentStatus)}
            style={{ marginTop: 4 }}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="dialog-actions">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply} data-testid="change-status-apply">
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
