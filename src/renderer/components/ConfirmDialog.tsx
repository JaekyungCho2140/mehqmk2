import { Button } from './Button';

interface ConfirmDialogProps {
  readonly title: string;
  readonly description: string;
  readonly confirmLabel?: string;
  readonly confirmVariant?: 'danger' | 'primary';
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}: ConfirmDialogProps): React.ReactElement {
  return (
    <div className="dialog-overlay" onClick={onCancel} data-testid="confirm-dialog">
      <div className="dialog-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="dialog-title">{title}</h3>
        <p className="dialog-description">{description}</p>
        <div className="dialog-actions">
          <Button variant="ghost" onClick={onCancel} data-testid="confirm-dialog-cancel">
            Cancel
          </Button>
          <button
            className={`btn btn--${confirmVariant === 'danger' ? 'danger' : 'primary'}`}
            onClick={onConfirm}
            data-testid="confirm-dialog-confirm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
