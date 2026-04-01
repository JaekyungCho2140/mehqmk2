import { useState, useCallback } from 'react';
import { StepUserName } from './wizard/StepUserName';
import { StepWorkDir } from './wizard/StepWorkDir';
import { Button } from '../components/Button';

interface WelcomeWizardProps {
  readonly defaultWorkDirectory: string;
  readonly onComplete: () => void;
}

type Step = 1 | 2;

function StepIndicator({ currentStep }: { readonly currentStep: Step }): React.ReactElement {
  return (
    <div className="step-indicator">
      {([1, 2] as const).map((step, i) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
          {i > 0 && <div className="step-line" />}
          <div
            className={`step-dot ${
              step < currentStep
                ? 'step-dot--completed'
                : step === currentStep
                  ? 'step-dot--active'
                  : 'step-dot--inactive'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
        </div>
      ))}
    </div>
  );
}

export function WelcomeWizard({
  defaultWorkDirectory,
  onComplete,
}: WelcomeWizardProps): React.ReactElement {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [userName, setUserName] = useState('');
  const [workDirectory, setWorkDirectory] = useState(defaultWorkDirectory);
  const [nameError, setNameError] = useState('');
  const [dirError, setDirError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleNext = useCallback(() => {
    if (currentStep === 1) {
      const trimmed = userName.trim();
      if (!trimmed) {
        setNameError('이름을 입력해주세요');
        return;
      }
      setUserName(trimmed);
      setNameError('');
      setCurrentStep(2);
    }
  }, [currentStep, userName]);

  const handleBack = useCallback(() => {
    if (currentStep === 2) setCurrentStep(1);
  }, [currentStep]);

  const handleBrowse = useCallback(async () => {
    const selected = await window.electronAPI.dialog.selectDirectory({
      defaultPath: workDirectory,
    });
    if (selected) {
      setWorkDirectory(selected);
      setDirError('');
    }
  }, [workDirectory]);

  const handleFinish = useCallback(async () => {
    if (!workDirectory) {
      setDirError('작업 디렉토리를 선택해주세요');
      return;
    }
    setDirError('');
    setSaving(true);
    try {
      await window.electronAPI.settings.setBulk({
        user_name: userName.trim(),
        work_directory: workDirectory,
        ui_language: 'ko',
        wizard_completed: true,
      });
      onComplete();
    } catch {
      setSaving(false);
    }
  }, [userName, workDirectory, onComplete]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (currentStep === 2) handleFinish();
        else handleNext();
      } else if (e.key === 'Escape' && currentStep > 1) {
        handleBack();
      }
    },
    [currentStep, handleNext, handleBack, handleFinish]
  );

  return (
    <div className="wizard-overlay" onKeyDown={handleKeyDown}>
      <div className="wizard-card">
        <StepIndicator currentStep={currentStep} />

        {currentStep === 1 && (
          <StepUserName
            userName={userName}
            onUserNameChange={(v) => {
              setUserName(v);
              if (v.trim()) setNameError('');
            }}
            error={nameError}
          />
        )}
        {currentStep === 2 && (
          <StepWorkDir
            workDirectory={workDirectory}
            onBrowse={handleBrowse}
            error={dirError}
          />
        )}

        <div className="step-footer">
          {currentStep > 1 ? (
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div />
          )}
          <div className="step-footer-right">
            {currentStep === 1 ? (
              <Button
                onClick={handleNext}
                disabled={!userName.trim()}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={saving}>
                {saving ? 'Saving...' : 'Finish'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
