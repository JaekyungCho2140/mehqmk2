import { useState, useCallback } from 'react';
import { Button } from './Button';
import { TextInput } from './TextInput';

interface CloneProjectDialogProps {
  readonly originalName: string;
  readonly onClone: (newName: string) => Promise<void>;
  readonly onCancel: () => void;
}

export function CloneProjectDialog({
  originalName,
  onClone,
  onCancel,
}: CloneProjectDialogProps): React.ReactElement {
  const [name, setName] = useState(`${originalName} - clone`);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleClone = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('이름을 입력해주세요');
      return;
    }
    setSaving(true);
    try {
      await onClone(trimmed);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '복제에 실패했습니다';
      setError(msg);
      setSaving(false);
    }
  }, [name, onClone]);

  return (
    <div className="dialog-overlay" onClick={onCancel} data-testid="clone-dialog">
      <div className="dialog-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="dialog-title">Clone Project</h3>
        <p className="dialog-description">&apos;{originalName}&apos; 프로젝트를 복제합니다.</p>
        <TextInput
          label="New Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim()) setError('');
          }}
          error={error}
          autoFocus
          data-testid="clone-dialog-name-input"
        />
        <div className="dialog-actions">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleClone}
            disabled={!name.trim() || saving}
            data-testid="clone-dialog-confirm"
          >
            {saving ? 'Cloning...' : 'Clone'}
          </Button>
        </div>
      </div>
    </div>
  );
}
