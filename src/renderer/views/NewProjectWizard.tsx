import { useState, useCallback, useEffect } from 'react';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { LanguageSelect } from '../components/LanguageSelect';
import { ProjectDocuments } from './wizard/ProjectDocuments';
import { CreateTmDialog } from '../components/CreateTmDialog';
import type { FileEntry } from '../components/FileDropZone';
import type { CreateProjectInput } from '../../shared/types/project';
import type { TranslationMemory, TmRole } from '../../shared/types/tm';
import '../styles/project-wizard.css';

interface NewProjectWizardProps {
  readonly onComplete: () => void;
  readonly onCancel: () => void;
}

type Step = 'details' | 'documents' | 'tm';

interface SelectedTm {
  readonly tm: TranslationMemory;
  readonly role: TmRole;
}

export function NewProjectWizard({
  onComplete,
  onCancel,
}: NewProjectWizardProps): React.ReactElement {
  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [sourceLang, setSourceLang] = useState('');
  const [targetLang, setTargetLang] = useState('');
  const [client, setClient] = useState('');
  const [domain, setDomain] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [availableTms, setAvailableTms] = useState<TranslationMemory[]>([]);
  const [selectedTms, setSelectedTms] = useState<SelectedTm[]>([]);
  const [showCreateTm, setShowCreateTm] = useState(false);

  const [nameError, setNameError] = useState('');
  const [sourceLangError, setSourceLangError] = useState('');
  const [targetLangError, setTargetLangError] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const canProceed = name.trim() && sourceLang && targetLang;

  useEffect(() => {
    window.electronAPI.tm.list().then(setAvailableTms).catch(() => {});
  }, []);

  const validateDetails = useCallback((): boolean => {
    let valid = true;
    if (!name.trim()) {
      setNameError('프로젝트 이름을 입력해주세요');
      valid = false;
    } else {
      setNameError('');
    }
    if (!sourceLang) {
      setSourceLangError('소스 언어를 선택해주세요');
      valid = false;
    } else {
      setSourceLangError('');
    }
    if (!targetLang) {
      setTargetLangError('타겟 언어를 선택해주세요');
      valid = false;
    } else if (targetLang === sourceLang) {
      setTargetLangError('소스 언어와 다른 언어를 선택해주세요');
      valid = false;
    } else {
      setTargetLangError('');
    }
    return valid;
  }, [name, sourceLang, targetLang]);

  const handleNext = useCallback(() => {
    if (step === 'details' && validateDetails()) {
      setStep('documents');
    } else if (step === 'documents') {
      setStep('tm');
    }
  }, [step, validateDetails]);

  const handleBack = useCallback(() => {
    if (step === 'tm') {
      setStep('documents');
    } else {
      setStep('details');
    }
  }, [step]);

  const toggleTmSelection = useCallback(
    (tm: TranslationMemory) => {
      setSelectedTms((prev) => {
        const exists = prev.find((s) => s.tm.id === tm.id);
        if (exists) {
          return prev.filter((s) => s.tm.id !== tm.id);
        }
        return [...prev, { tm, role: tm.role }];
      });
    },
    [],
  );

  const updateTmRole = useCallback((tmId: string, role: TmRole) => {
    setSelectedTms((prev) =>
      prev.map((s) => (s.tm.id === tmId ? { ...s, role } : s)),
    );
  }, []);

  const handleCreateTm = useCallback(
    async (input: { name: string; source_lang: string; target_lang: string; description: string; role: TmRole }) => {
      const created = await window.electronAPI.tm.create(input);
      setAvailableTms((prev) => [created, ...prev]);
      setSelectedTms((prev) => [...prev, { tm: created, role: input.role }]);
      setShowCreateTm(false);
    },
    [],
  );

  const handleFinish = useCallback(async () => {
    setSaving(true);
    setFormError('');

    const input: CreateProjectInput = {
      name: name.trim(),
      source_lang: sourceLang,
      target_lang: targetLang,
      client: client.trim() || undefined,
      domain: domain.trim() || undefined,
      subject: subject.trim() || undefined,
      description: description.trim() || undefined,
      deadline: deadline || undefined,
    };

    try {
      const project = await window.electronAPI.project.create(input);

      // 지원되는 파일만 Import
      const supportedFiles = files.filter((f) => f.supported);
      for (const file of supportedFiles) {
        await window.electronAPI.document.import(project.id, file.path);
      }

      // 선택된 TM 연결
      for (const { tm, role: tmRole } of selectedTms) {
        await window.electronAPI.tm.linkToProject(project.id, tm.id, tmRole);
      }

      onComplete();
    } catch (err) {
      const message = err instanceof Error ? err.message : '프로젝트 생성에 실패했습니다';
      if (message.includes('이미 존재')) {
        setStep('details');
        setNameError(message);
      } else {
        setFormError(message);
      }
      setSaving(false);
    }
  }, [
    name,
    sourceLang,
    targetLang,
    client,
    domain,
    subject,
    description,
    deadline,
    files,
    selectedTms,
    onComplete,
  ]);

  const todayStr = new Date().toISOString().split('T')[0];

  const stepLabels: Record<Step, string> = {
    details: 'Details',
    documents: 'Documents',
    tm: 'Translation Memory',
  };

  return (
    <div className="new-project-wizard" data-testid="new-project-wizard">
      <div className="new-project-header">
        <h2>New Project — {stepLabels[step]}</h2>
        <Button variant="ghost" onClick={onCancel} data-testid="new-project-cancel-btn">
          Cancel
        </Button>
      </div>

      <div className="new-project-form-area">
        {step === 'details' && (
          <div className="new-project-form">
            {formError && <div className="form-error-banner">{formError}</div>}

            <TextInput
              label="Name"
              className="label-required-wrapper"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setNameError('');
              }}
              placeholder="프로젝트 이름"
              error={nameError}
              autoFocus
              data-testid="new-project-name-input"
            />

            <LanguageSelect
              label="Source Language *"
              value={sourceLang}
              onChange={(code) => {
                setSourceLang(code);
                setSourceLangError('');
              }}
              error={sourceLangError}
              data-testid="new-project-source-lang"
            />

            <LanguageSelect
              label="Target Language *"
              value={targetLang}
              onChange={(code) => {
                setTargetLang(code);
                setTargetLangError('');
              }}
              error={targetLangError}
              excludeCode={sourceLang}
              data-testid="new-project-target-lang"
            />

            <hr className="form-divider" />

            <TextInput
              label="Client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="클라이언트"
              data-testid="new-project-client-input"
            />
            <TextInput
              label="Domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="도메인"
              data-testid="new-project-domain-input"
            />
            <TextInput
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="주제"
              data-testid="new-project-subject-input"
            />
            <div className="text-input-wrapper">
              <label className="text-input-label">Description</label>
              <textarea
                className="text-area"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="프로젝트 설명"
                data-testid="new-project-description-input"
              />
            </div>
            <div className="text-input-wrapper">
              <label className="text-input-label">Deadline</label>
              <input
                type="date"
                className="text-input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={todayStr}
                data-testid="new-project-deadline-input"
              />
            </div>
          </div>
        )}
        {step === 'documents' && (
          <div className="new-project-form">
            <ProjectDocuments files={files} onFilesChange={setFiles} />
          </div>
        )}
        {step === 'tm' && (
          <div className="new-project-form" data-testid="wizard-tm-step">
            <p className="tm-step-description">
              프로젝트에 사용할 Translation Memory를 선택하세요. (선택 사항)
            </p>

            <Button
              variant="ghost"
              onClick={() => setShowCreateTm(true)}
              data-testid="wizard-create-tm-btn"
            >
              + Create New TM
            </Button>

            {availableTms.length === 0 ? (
              <div className="tm-empty-state" data-testid="wizard-tm-empty">
                등록된 TM이 없습니다. 위 버튼으로 새 TM을 생성하세요.
              </div>
            ) : (
              <div className="tm-select-list" data-testid="wizard-tm-list">
                {availableTms.map((tm) => {
                  const selected = selectedTms.find((s) => s.tm.id === tm.id);
                  return (
                    <div
                      key={tm.id}
                      className={`tm-select-item ${selected ? 'tm-select-item--selected' : ''}`}
                      data-testid={`wizard-tm-item-${tm.id}`}
                    >
                      <label className="tm-select-checkbox">
                        <input
                          type="checkbox"
                          checked={!!selected}
                          onChange={() => toggleTmSelection(tm)}
                        />
                        <span className="tm-select-name">{tm.name}</span>
                        <span className="tm-select-langs">
                          {tm.source_lang} → {tm.target_lang}
                        </span>
                      </label>
                      {selected && (
                        <select
                          className="tm-role-select"
                          value={selected.role}
                          onChange={(e) => updateTmRole(tm.id, e.target.value as TmRole)}
                          data-testid={`wizard-tm-role-${tm.id}`}
                        >
                          <option value="working">Working</option>
                          <option value="master">Master</option>
                          <option value="reference">Reference</option>
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="new-project-footer">
        {step !== 'details' && (
          <Button variant="ghost" onClick={handleBack} data-testid="new-project-back-btn">
            Back
          </Button>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-sm)' }}>
          {step === 'details' && (
            <Button onClick={handleNext} disabled={!canProceed} data-testid="new-project-next-btn">
              Next
            </Button>
          )}
          {step === 'documents' && (
            <>
              <Button onClick={handleNext} data-testid="new-project-next-btn">
                Next
              </Button>
              <Button
                variant="ghost"
                onClick={handleFinish}
                disabled={saving}
                data-testid="new-project-finish-btn"
              >
                {saving ? 'Creating...' : 'Finish'}
              </Button>
            </>
          )}
          {step === 'tm' && (
            <Button onClick={handleFinish} disabled={saving} data-testid="new-project-finish-btn">
              {saving ? 'Creating...' : 'Finish'}
            </Button>
          )}
        </div>
      </div>

      {showCreateTm && (
        <CreateTmDialog
          defaultSourceLang={sourceLang}
          defaultTargetLang={targetLang}
          onCreate={handleCreateTm}
          onCancel={() => setShowCreateTm(false)}
        />
      )}
    </div>
  );
}
