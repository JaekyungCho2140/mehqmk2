import { useEffect, useState } from 'react';

interface ToastProps {
  readonly message: string;
  readonly onClose: () => void;
  readonly duration?: number;
}

export function Toast({ message, onClose, duration = 2000 }: ToastProps): React.ReactElement {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), duration);
    const closeTimer = setTimeout(onClose, duration + 200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  return (
    <div className={`toast ${visible ? 'toast--visible' : 'toast--hidden'}`} data-testid="toast">
      {message}
    </div>
  );
}
