import { useState, useCallback } from 'react';
import type { ImportSettings } from '../../shared/types/import-settings';
import { DEFAULT_IMPORT_SETTINGS } from '../../shared/types/import-settings';
import { Button } from './Button';
import '../styles/dialog.css';

interface ImportSettingsDialogProps {
  readonly onConfirm: (settings: ImportSettings) => void;
  readonly onCancel: () => void;
  readonly initialSettings?: ImportSettings;
}

export function ImportSettingsDialog({
  onConfirm,
  onCancel,
  initialSettings = DEFAULT_IMPORT_SETTINGS,
}: ImportSettingsDialogProps): React.ReactElement {
  const [filter, setFilter] = useState(initialSettings.filter);
  const [encoding, setEncoding] = useState(initialSettings.encoding);
  const [inlineTags, setInlineTags] = useState(initialSettings.inlineTags);
  const [emptyTarget, setEmptyTarget] = useState(initialSettings.emptyTarget);

  const handleConfirm = useCallback(() => {
    onConfirm({ filter, encoding, inlineTags, emptyTarget });
  }, [filter, encoding, inlineTags, emptyTarget, onConfirm]);

  return (
    <div className="dialog-overlay" onClick={onCancel} data-testid="import-settings-dialog">
      <div className="dialog-card" style={{ width: 440 }} onClick={(e) => e.stopPropagation()}>
        <h3 className="dialog-title">Import Settings</h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
            marginTop: 'var(--spacing-md)',
          }}
        >
          <div className="text-input-wrapper">
            <label className="text-input-label">Filter</label>
            <select
              className="text-input"
              value={filter}
              onChange={(e) => setFilter(e.target.value as ImportSettings['filter'])}
              data-testid="import-settings-filter"
            >
              <option value="auto">Auto-detect (확장자 기반)</option>
              <option value="xliff">XLIFF</option>
              <option value="po">PO Gettext</option>
              <option value="tmx">TMX</option>
              <option value="mqxliff">mehQ XLIFF</option>
            </select>
          </div>

          <div className="text-input-wrapper">
            <label className="text-input-label">Encoding</label>
            <select
              className="text-input"
              value={encoding}
              onChange={(e) => setEncoding(e.target.value as ImportSettings['encoding'])}
              data-testid="import-settings-encoding"
            >
              <option value="utf-8">UTF-8</option>
              <option value="utf-16">UTF-16</option>
              <option value="iso-8859-1">ISO-8859-1</option>
            </select>
          </div>

          <div className="text-input-wrapper">
            <label className="text-input-label">Inline Tags</label>
            <select
              className="text-input"
              value={inlineTags}
              onChange={(e) => setInlineTags(e.target.value as ImportSettings['inlineTags'])}
              data-testid="import-settings-inline-tags"
            >
              <option value="preserve">Preserve (보존)</option>
              <option value="remove">Remove (제거)</option>
            </select>
          </div>

          <div className="text-input-wrapper">
            <label className="text-input-label">Empty Target</label>
            <select
              className="text-input"
              value={emptyTarget}
              onChange={(e) => setEmptyTarget(e.target.value as ImportSettings['emptyTarget'])}
              data-testid="import-settings-empty-target"
            >
              <option value="empty">Leave empty (비워두기)</option>
              <option value="copy-source">Copy source (Source 복사)</option>
            </select>
          </div>
        </div>

        <div className="dialog-actions">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} data-testid="import-settings-ok">
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}
