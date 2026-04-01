import { useState, useCallback } from 'react';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { LanguageSelect } from '../components/LanguageSelect';
import type { CreateProjectInput } from '../../shared/types/project';
import '../styles/project-wizard.css';

interface NewProjectWizardProps {
  readonly onComplete: () => void;
  readonly onCancel: () => void;
}

export function NewProjectWizard({
  onComplete,
  onCancel,
}: NewProjectWizardProps): React.ReactElement {
  const [name, setName] = useState('');
  const [sourceLang, setSourceLang] = useState('');
  const [targetLang, setTargetLang] = useState('');
  const [client, setClient] = useState('');
  const [domain, setDomain] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const [nameError, setNameError] = useState('');
  const [sourceLangError, setSourceLangError] = useState('');
  const [targetLangError, setTargetLangError] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const canFinish = name.trim() && sourceLang && targetLang;

  const validate = useCallback((): boolean => {
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

  const handleFinish = useCallback(async () => {
    if (!validate()) return;

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
      await window.electronAPI.project.create(input);
      onComplete();
    } catch (err) {
      const message = err instanceof Error ? err.message : '프로젝트 생성에 실패했습니다';
      if (message.includes('이미 존재')) {
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
    validate,
    onComplete,
  ]);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="new-project-wizard" data-testid="new-project-wizard">
      <div className="new-project-header">
        <h2>New Project</h2>
        <Button variant="ghost" onClick={onCancel} data-testid="new-project-cancel-btn">
          Cancel
        </Button>
      </div>

      <div className="new-project-form-area">
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
      </div>

      <div className="new-project-footer">
        <Button
          onClick={handleFinish}
          disabled={!canFinish || saving}
          data-testid="new-project-finish-btn"
        >
          {saving ? 'Creating...' : 'Finish'}
        </Button>
      </div>
    </div>
  );
}
