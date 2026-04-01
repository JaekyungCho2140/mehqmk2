import type { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label?: string;
  readonly error?: string;
  readonly hint?: string;
}

export function TextInput({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}: TextInputProps): React.ReactElement {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`text-input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-input-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`text-input ${error ? 'text-input--error' : ''}`}
        {...props}
      />
      {error && <span className="text-input-error">{error}</span>}
      {hint && !error && <span className="text-input-hint">{hint}</span>}
    </div>
  );
}
