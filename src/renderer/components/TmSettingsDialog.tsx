import { useState, useCallback } from 'react';
import { Button } from './Button';
import type { TranslationMemory } from '../../shared/types/tm';

interface TmSettingsDialogProps {
  readonly tm: TranslationMemory;
  readonly onSave: (settings: { allow_multiple: boolean; allow_reverse: boolean }) => Promise<void>;
  readonly onCancel: () => void;
}

export function TmSettingsDialog({
  tm,
  onSave,
  onCancel,
}: TmSettingsDialogProps): React.ReactElement {
  const [allowMultiple, setAllowMultiple] = useState(tm.allow_multiple);
  const [allowReverse, setAllowReverse] = useState(tm.allow_reverse);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await onSave({ allow_multiple: allowMultiple, allow_reverse: allowReverse });
    } catch {
      setSaving(false);
    }
  }, [allowMultiple, allowReverse, onSave]);

  return (
    <div className="dialog-overlay" onClick={onCancel} data-testid="tm-settings-dialog">
      <div className="dialog-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="dialog-title">TM Settings — {tm.name}</h3>
        <p className="dialog-description">Translation Memory 설정을 변경합니다.</p>

        <div className="tm-settings-options">
          <label className="tm-settings-option">
            <input
              type="checkbox"
              checked={allowMultiple}
              onChange={(e) => setAllowMultiple(e.target.checked)}
              data-testid="tm-settings-allow-multiple"
            />
            <div>
              <span className="tm-settings-option-label">동일 source에 다중 번역 허용</span>
              <span className="tm-settings-option-desc">
                같은 source에 대해 여러 target 번역을 저장합니다.
              </span>
            </div>
          </label>

          <label className="tm-settings-option">
            <input
              type="checkbox"
              checked={allowReverse}
              onChange={(e) => setAllowReverse(e.target.checked)}
              data-testid="tm-settings-allow-reverse"
            />
            <div>
              <span className="tm-settings-option-label">역방향 조회 허용</span>
              <span className="tm-settings-option-desc">
                Target → Source 방향으로도 매치를 검색합니다.
              </span>
            </div>
          </label>
        </div>

        <div className="dialog-actions">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} data-testid="tm-settings-save">
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
