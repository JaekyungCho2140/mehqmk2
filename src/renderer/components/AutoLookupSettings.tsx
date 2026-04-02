import { useState, useCallback } from 'react';
import { Button } from './Button';

interface AutoLookupSettingsProps {
  readonly autoScan: boolean;
  readonly autoInsert: boolean;
  readonly autoInsertThreshold: number;
  readonly copySourceIfNoMatch: boolean;
  readonly onSave: (settings: {
    auto_scan: boolean;
    auto_insert: boolean;
    auto_insert_threshold: number;
    copy_source_if_no_match: boolean;
  }) => void;
  readonly onCancel: () => void;
}

export function AutoLookupSettings({
  autoScan,
  autoInsert,
  autoInsertThreshold,
  copySourceIfNoMatch,
  onSave,
  onCancel,
}: AutoLookupSettingsProps): React.ReactElement {
  const [scan, setScan] = useState(autoScan);
  const [insert, setInsert] = useState(autoInsert);
  const [threshold, setThreshold] = useState(autoInsertThreshold);
  const [copySource, setCopySource] = useState(copySourceIfNoMatch);

  const handleSave = useCallback(() => {
    onSave({
      auto_scan: scan,
      auto_insert: insert,
      auto_insert_threshold: threshold,
      copy_source_if_no_match: copySource,
    });
  }, [scan, insert, threshold, copySource, onSave]);

  return (
    <div className="dialog-overlay" onClick={onCancel} data-testid="auto-lookup-settings">
      <div className="dialog-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="dialog-title">Automatic Lookup Settings</h3>

        <div className="tm-settings-options">
          <label className="tm-settings-option">
            <input
              type="checkbox"
              checked={scan}
              onChange={(e) => setScan(e.target.checked)}
              data-testid="auto-lookup-scan"
            />
            <div>
              <span className="tm-settings-option-label">Automatically scan</span>
              <span className="tm-settings-option-desc">
                세그먼트 이동 시 자동으로 TM을 검색합니다.
              </span>
            </div>
          </label>

          <label className="tm-settings-option">
            <input
              type="checkbox"
              checked={insert}
              onChange={(e) => setInsert(e.target.checked)}
              data-testid="auto-lookup-insert"
            />
            <div>
              <span className="tm-settings-option-label">Auto-insert best result</span>
              <span className="tm-settings-option-desc">
                빈 Target에 최상위 매치를 자동 삽입합니다.
              </span>
            </div>
          </label>

          {insert && (
            <div className="tm-settings-option" style={{ paddingLeft: '28px' }}>
              <div>
                <span className="tm-settings-option-label">
                  Minimum match rate: {threshold}%
                </span>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
                  style={{ width: '100%', marginTop: '4px' }}
                  data-testid="auto-lookup-threshold"
                />
              </div>
            </div>
          )}

          <label className="tm-settings-option">
            <input
              type="checkbox"
              checked={copySource}
              onChange={(e) => setCopySource(e.target.checked)}
              data-testid="auto-lookup-copy-source"
            />
            <div>
              <span className="tm-settings-option-label">Copy source if no match</span>
              <span className="tm-settings-option-desc">
                매치가 없으면 Source를 Target에 복사합니다.
              </span>
            </div>
          </label>
        </div>

        <div className="dialog-actions">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="auto-lookup-save">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
