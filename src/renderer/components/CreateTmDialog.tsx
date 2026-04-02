import { useState, useCallback } from 'react';
import { Button } from './Button';
import { TextInput } from './TextInput';
import { LanguageSelect } from './LanguageSelect';
import type { TmRole } from '../../shared/types/tm';

interface CreateTmDialogProps {
  readonly defaultSourceLang?: string;
  readonly defaultTargetLang?: string;
  readonly onCreate: (tm: {
    name: string;
    source_lang: string;
    target_lang: string;
    description: string;
    role: TmRole;
  }) => Promise<void>;
  readonly onCancel: () => void;
}

const ROLE_DESCRIPTIONS: Record<TmRole, string> = {
  working: '확인 시 번역이 저장됩니다',
  master: '최종 승인된 번역 저장소',
  reference: '참조용 (저장 안 됨)',
};

export function CreateTmDialog({
  defaultSourceLang = '',
  defaultTargetLang = '',
  onCreate,
  onCancel,
}: CreateTmDialogProps): React.ReactElement {
  const [name, setName] = useState('');
  const [sourceLang, setSourceLang] = useState(defaultSourceLang);
  const [targetLang, setTargetLang] = useState(defaultTargetLang);
  const [role, setRole] = useState<TmRole>('working');
  const [description, setDescription] = useState('');

  const [nameError, setNameError] = useState('');
  const [sourceLangError, setSourceLangError] = useState('');
  const [targetLangError, setTargetLangError] = useState('');
  const [saving, setSaving] = useState(false);

  const canCreate = name.trim() && sourceLang && targetLang;

  const handleCreate = useCallback(async () => {
    let valid = true;
    if (!name.trim()) {
      setNameError('TM 이름을 입력해주세요');
      valid = false;
    }
    if (!sourceLang) {
      setSourceLangError('소스 언어를 선택해주세요');
      valid = false;
    }
    if (!targetLang) {
      setTargetLangError('타겟 언어를 선택해주세요');
      valid = false;
    }
    if (!valid) return;

    setSaving(true);
    try {
      await onCreate({
        name: name.trim(),
        source_lang: sourceLang,
        target_lang: targetLang,
        description: description.trim(),
        role,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'TM 생성에 실패했습니다';
      setNameError(msg);
      setSaving(false);
    }
  }, [name, sourceLang, targetLang, description, role, onCreate]);

  return (
    <div className="dialog-overlay" onClick={onCancel} data-testid="create-tm-dialog">
      <div className="dialog-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="dialog-title">Create Translation Memory</h3>
        <p className="dialog-description">새 번역 메모리를 생성합니다.</p>

        <TextInput
          label="Name"
          className="label-required-wrapper"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim()) setNameError('');
          }}
          placeholder="TM 이름"
          error={nameError}
          autoFocus
          data-testid="create-tm-name-input"
        />

        <LanguageSelect
          label="Source Language *"
          value={sourceLang}
          onChange={(code) => {
            setSourceLang(code);
            setSourceLangError('');
          }}
          error={sourceLangError}
          data-testid="create-tm-source-lang"
        />

        <LanguageSelect
          label="Target Language *"
          value={targetLang}
          onChange={(code) => {
            setTargetLang(code);
            setTargetLangError('');
          }}
          error={targetLangError}
          data-testid="create-tm-target-lang"
        />

        <div className="text-input-wrapper">
          <label className="text-input-label">Role</label>
          <div className="tm-role-options">
            {(['working', 'master', 'reference'] as const).map((r) => (
              <label key={r} className="tm-role-option" data-testid={`create-tm-role-${r}`}>
                <input
                  type="radio"
                  name="tm-role"
                  value={r}
                  checked={role === r}
                  onChange={() => setRole(r)}
                />
                <span className="tm-role-label">
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </span>
                <span className="tm-role-desc">{ROLE_DESCRIPTIONS[r]}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="text-input-wrapper">
          <label className="text-input-label">Description</label>
          <textarea
            className="text-area"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명 (선택)"
            data-testid="create-tm-description"
          />
        </div>

        <div className="dialog-actions">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!canCreate || saving}
            data-testid="create-tm-confirm"
          >
            {saving ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
}
