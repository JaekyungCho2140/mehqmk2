import { useState, useRef, useEffect, useCallback } from 'react';
import { LANGUAGES } from '../../shared/constants/languages';

interface LanguageSelectProps {
  readonly label: string;
  readonly value: string;
  readonly onChange: (code: string) => void;
  readonly error?: string;
  readonly excludeCode?: string;
  readonly 'data-testid'?: string;
}

export function LanguageSelect({
  label,
  value,
  onChange,
  error,
  excludeCode,
  'data-testid': testId,
}: LanguageSelectProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLang = LANGUAGES.find((l) => l.code === value);
  const displayText = selectedLang ? `${selectedLang.code} - ${selectedLang.label}` : '';

  const filtered = LANGUAGES.filter((lang) => {
    if (excludeCode && lang.code === excludeCode) return false;
    if (!filter) return true;
    const q = filter.toLowerCase();
    return lang.code.includes(q) || lang.label.toLowerCase().includes(q);
  });

  const handleSelect = useCallback(
    (code: string) => {
      onChange(code);
      setOpen(false);
      setFilter('');
    },
    [onChange],
  );

  // 외부 클릭으로 닫기
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFilter('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="text-input-wrapper" ref={containerRef}>
      <label className="text-input-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          className={`text-input lang-select-trigger ${error ? 'text-input--error' : ''}`}
          onClick={() => setOpen(!open)}
          data-testid={testId}
          style={{ textAlign: 'left', cursor: 'pointer' }}
        >
          {displayText || <span style={{ color: 'var(--color-text-muted)' }}>언어 선택...</span>}
        </button>
        {open && (
          <div
            className="lang-select-dropdown"
            data-testid={testId ? `${testId}-dropdown` : undefined}
          >
            <input
              className="text-input lang-select-filter"
              placeholder="검색..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              autoFocus
            />
            <div className="lang-select-list">
              {filtered.map((lang) => (
                <div
                  key={lang.code}
                  className={`lang-select-option ${value === lang.code ? 'lang-select-option--selected' : ''}`}
                  onClick={() => handleSelect(lang.code)}
                  role="option"
                  aria-selected={value === lang.code}
                >
                  {lang.code} - {lang.label}
                </div>
              ))}
              {filtered.length === 0 && <div className="lang-select-empty">결과 없음</div>}
            </div>
          </div>
        )}
      </div>
      {error && <span className="text-input-error">{error}</span>}
    </div>
  );
}
