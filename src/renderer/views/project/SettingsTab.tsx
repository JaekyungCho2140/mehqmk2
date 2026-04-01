import { useState, useCallback } from 'react';
import type { Project } from '../../../shared/types/project';
import { TextInput } from '../../components/TextInput';
import { LanguageSelect } from '../../components/LanguageSelect';
import { Button } from '../../components/Button';

interface SettingsTabProps {
  readonly project: Project;
  readonly onSave: (updated: Project) => void;
}

export function SettingsTab({ project, onSave }: SettingsTabProps): React.ReactElement {
  const [name, setName] = useState(project.name);
  const [sourceLang, setSourceLang] = useState(project.source_lang);
  const [targetLang, setTargetLang] = useState(project.target_lang);
  const [client, setClient] = useState(project.client);
  const [domain, setDomain] = useState(project.domain);
  const [subject, setSubject] = useState(project.subject);
  const [description, setDescription] = useState(project.description);
  const [deadline, setDeadline] = useState(project.deadline?.split('T')[0] ?? '');

  const [nameError, setNameError] = useState('');
  const [targetLangError, setTargetLangError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('프로젝트 이름을 입력해주세요');
      return;
    }
    if (targetLang === sourceLang) {
      setTargetLangError('소스 언어와 다른 언어를 선택해주세요');
      return;
    }

    setSaving(true);
    try {
      const updated = await window.electronAPI.project.update(project.id, {
        name: trimmedName,
        source_lang: sourceLang,
        target_lang: targetLang,
        client: client.trim(),
        domain: domain.trim(),
        subject: subject.trim(),
        description: description.trim(),
        deadline: deadline || null,
      });
      onSave(updated);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '저장에 실패했습니다';
      if (msg.includes('이미 존재') || msg.includes('UNIQUE')) {
        setNameError('이 이름의 프로젝트가 이미 존재합니다');
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
    project.id,
    onSave,
  ]);

  const handleCancel = useCallback(() => {
    setName(project.name);
    setSourceLang(project.source_lang);
    setTargetLang(project.target_lang);
    setClient(project.client);
    setDomain(project.domain);
    setSubject(project.subject);
    setDescription(project.description);
    setDeadline(project.deadline?.split('T')[0] ?? '');
    setNameError('');
    setTargetLangError('');
  }, [project]);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="settings-tab" data-testid="settings-tab">
      <div className="new-project-form">
        <TextInput
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim()) setNameError('');
          }}
          error={nameError}
          data-testid="settings-name-input"
        />

        <LanguageSelect
          label="Source Language"
          value={sourceLang}
          onChange={setSourceLang}
          data-testid="settings-source-lang"
        />

        <LanguageSelect
          label="Target Language"
          value={targetLang}
          onChange={(code) => {
            setTargetLang(code);
            setTargetLangError('');
          }}
          error={targetLangError}
          excludeCode={sourceLang}
          data-testid="settings-target-lang"
        />

        <hr className="form-divider" />

        <TextInput label="Client" value={client} onChange={(e) => setClient(e.target.value)} />
        <TextInput label="Domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
        <TextInput label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />

        <div className="text-input-wrapper">
          <label className="text-input-label">Description</label>
          <textarea
            className="text-area"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          />
        </div>

        <div className="settings-actions">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} data-testid="settings-save-btn">
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
