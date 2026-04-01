import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: 'primary' | 'ghost';
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps): React.ReactElement {
  return <button className={`btn btn--${variant} ${className}`} {...props} />;
}
