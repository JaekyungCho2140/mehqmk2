import { useMemo } from 'react';

interface CompareBoxProps {
  readonly currentSource: string;
  readonly matchSource: string;
}

interface DiffToken {
  readonly text: string;
  readonly type: 'same' | 'changed' | 'deleted';
}

function computeDiff(current: string, match: string): DiffToken[] {
  const wordsA = current.split(/(\s+)/);
  const wordsB = match.split(/(\s+)/);

  const tokens: DiffToken[] = [];
  const maxLen = Math.max(wordsA.length, wordsB.length);

  for (let i = 0; i < maxLen; i++) {
    const a = wordsA[i] ?? '';
    const b = wordsB[i] ?? '';

    if (a === b) {
      if (a) tokens.push({ text: a, type: 'same' });
    } else if (!b) {
      tokens.push({ text: a, type: 'changed' });
    } else if (!a) {
      tokens.push({ text: b, type: 'deleted' });
    } else {
      tokens.push({ text: b, type: 'changed' });
    }
  }

  return tokens;
}

export function CompareBox({
  currentSource,
  matchSource,
}: CompareBoxProps): React.ReactElement {
  const diff = useMemo(
    () => computeDiff(currentSource, matchSource),
    [currentSource, matchSource],
  );

  return (
    <div className="compare-box" data-testid="compare-box">
      <div className="compare-box-label">Compare</div>
      <div className="compare-box-text">
        {diff.map((token, i) => (
          <span key={i} className={`compare-${token.type}`}>
            {token.text}
          </span>
        ))}
      </div>
    </div>
  );
}
