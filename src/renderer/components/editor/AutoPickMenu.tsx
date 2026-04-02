import { useEffect, useRef } from 'react';
import type { RecognizedItem } from '../../../main/autopick/recognizer';
import '../../styles/autopick.css';

interface AutoPickMenuProps {
  readonly items: RecognizedItem[];
  readonly position: { x: number; y: number };
  readonly onSelect: (value: string) => void;
  readonly onClose: () => void;
}

export function AutoPickMenu({
  items,
  position,
  onSelect,
  onClose,
}: AutoPickMenuProps): React.ReactElement {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      // Number keys 1-9 to select items
      if (e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < items.length) {
          e.preventDefault();
          onSelect(items[idx].value);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [items, onSelect, onClose]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      className="autopick-menu"
      ref={menuRef}
      style={{ left: position.x, top: position.y }}
      data-testid="autopick-menu"
    >
      {items.map((item, index) => (
        <div
          key={`${item.type}-${item.value}-${index}`}
          className="autopick-item"
          onClick={() => onSelect(item.value)}
          data-testid={`autopick-item-${index}`}
        >
          <span className="autopick-item-icon">{item.icon}</span>
          <span className="autopick-item-value">{item.value}</span>
          <span className="autopick-item-num">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}
