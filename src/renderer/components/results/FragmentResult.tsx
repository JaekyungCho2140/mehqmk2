import type { FragmentMatchResult } from '../../../shared/types/tm';

interface FragmentResultProps {
  readonly fragment: FragmentMatchResult;
  readonly onInsert: () => void;
}

export function FragmentResult({
  fragment,
  onInsert,
}: FragmentResultProps): React.ReactElement {
  return (
    <div
      className="result-item fragment-result"
      onDoubleClick={onInsert}
      data-testid="fragment-result"
    >
      <div className="result-item-color-bar" style={{ backgroundColor: '#8b5cf6' }} />
      <span className="result-item-num">F</span>
      <div className="result-item-content">
        <div className="result-item-header">
          <span className="result-item-rate" style={{ backgroundColor: '#8b5cf6' }}>
            {fragment.coverage}%
          </span>
          <span className="result-item-tm">Fragment Assembly</span>
        </div>
        <div className="fragment-parts">
          {fragment.fragments.map((f, i) => (
            <span
              key={i}
              className={f.matched ? 'fragment-matched' : 'fragment-unmatched'}
            >
              {f.target_part}
              {i < fragment.fragments.length - 1 ? ' ' : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
