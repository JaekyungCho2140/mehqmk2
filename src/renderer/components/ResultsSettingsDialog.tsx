import { useState, useCallback } from 'react';
import { Button } from './Button';

interface ResultsSettings {
  readonly maxHits: number;
  readonly deduplicateTarget: boolean;
  readonly minMatchRate: number;
  readonly fragmentEnabled: boolean;
  readonly fragmentMinCoverage: number;
}

interface ResultsSettingsDialogProps {
  readonly settings: ResultsSettings;
  readonly onSave: (settings: ResultsSettings) => void;
  readonly onCancel: () => void;
}

export function ResultsSettingsDialog({
  settings,
  onSave,
  onCancel,
}: ResultsSettingsDialogProps): React.ReactElement {
  const [maxHits, setMaxHits] = useState(settings.maxHits);
  const [dedup, setDedup] = useState(settings.deduplicateTarget);
  const [minRate, setMinRate] = useState(settings.minMatchRate);
  const [fragEnabled, setFragEnabled] = useState(settings.fragmentEnabled);
  const [fragCoverage, setFragCoverage] = useState(settings.fragmentMinCoverage);

  const handleSave = useCallback(() => {
    onSave({
      maxHits,
      deduplicateTarget: dedup,
      minMatchRate: minRate,
      fragmentEnabled: fragEnabled,
      fragmentMinCoverage: fragCoverage,
    });
  }, [maxHits, dedup, minRate, fragEnabled, fragCoverage, onSave]);

  return (
    <div className="dialog-overlay" onClick={onCancel} data-testid="results-settings-dialog">
      <div className="dialog-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="dialog-title">Translation Results Settings</h3>

        <div className="tm-settings-options">
          <div className="tm-settings-option">
            <div>
              <span className="tm-settings-option-label">Maximum hits: {maxHits}</span>
              <input
                type="range"
                min={1}
                max={20}
                value={maxHits}
                onChange={(e) => setMaxHits(parseInt(e.target.value, 10))}
                style={{ width: '100%' }}
                data-testid="results-settings-max-hits"
              />
            </div>
          </div>

          <label className="tm-settings-option">
            <input
              type="checkbox"
              checked={dedup}
              onChange={(e) => setDedup(e.target.checked)}
              data-testid="results-settings-dedup"
            />
            <div>
              <span className="tm-settings-option-label">동일 target 중복 제거</span>
            </div>
          </label>

          <div className="tm-settings-option">
            <div>
              <span className="tm-settings-option-label">Minimum match rate: {minRate}%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={minRate}
                onChange={(e) => setMinRate(parseInt(e.target.value, 10))}
                style={{ width: '100%' }}
                data-testid="results-settings-min-rate"
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-default)', margin: '8px 0' }} />

          <label className="tm-settings-option">
            <input
              type="checkbox"
              checked={fragEnabled}
              onChange={(e) => setFragEnabled(e.target.checked)}
              data-testid="results-settings-fragment-enabled"
            />
            <div>
              <span className="tm-settings-option-label">Fragment Assembly</span>
              <span className="tm-settings-option-desc">
                TM에서 부분 매치를 조합하여 번역을 생성합니다.
              </span>
            </div>
          </label>

          {fragEnabled && (
            <div className="tm-settings-option" style={{ paddingLeft: '28px' }}>
              <div>
                <span className="tm-settings-option-label">
                  Minimum coverage: {fragCoverage}%
                </span>
                <input
                  type="range"
                  min={30}
                  max={100}
                  value={fragCoverage}
                  onChange={(e) => setFragCoverage(parseInt(e.target.value, 10))}
                  style={{ width: '100%' }}
                  data-testid="results-settings-fragment-coverage"
                />
              </div>
            </div>
          )}
        </div>

        <div className="dialog-actions">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="results-settings-save">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export type { ResultsSettings };
