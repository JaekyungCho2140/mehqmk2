import { useMemo } from 'react';

interface DiffLampsProps {
  readonly currentSource: string;
  readonly matchSource: string;
}

interface LampState {
  readonly label: string;
  readonly active: boolean;
}

function hasSpaceDiff(a: string, b: string): boolean {
  return a.replace(/\S/g, '') !== b.replace(/\S/g, '');
}

function hasPunctuationDiff(a: string, b: string): boolean {
  const getPunct = (s: string) => s.replace(/[^\p{P}]/gu, '');
  return getPunct(a) !== getPunct(b);
}

function hasCaseDiff(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase() && a !== b;
}

function hasNumberDiff(a: string, b: string): boolean {
  const getNumbers = (s: string) => s.replace(/[^\d]/g, '');
  const aN = getNumbers(a);
  const bN = getNumbers(b);
  return aN !== bN;
}

export function DiffLamps({
  currentSource,
  matchSource,
}: DiffLampsProps): React.ReactElement {
  const lamps = useMemo<LampState[]>(() => {
    if (currentSource === matchSource) {
      return [
        { label: 'Spc', active: false },
        { label: 'Pnc', active: false },
        { label: 'Aa', active: false },
        { label: 'Fmt', active: false },
        { label: 'Tag', active: false },
        { label: '#', active: false },
      ];
    }

    return [
      { label: 'Spc', active: hasSpaceDiff(currentSource, matchSource) },
      { label: 'Pnc', active: hasPunctuationDiff(currentSource, matchSource) },
      { label: 'Aa', active: hasCaseDiff(currentSource, matchSource) },
      { label: 'Fmt', active: false }, // Phase 8
      { label: 'Tag', active: false }, // Phase 8
      { label: '#', active: hasNumberDiff(currentSource, matchSource) },
    ];
  }, [currentSource, matchSource]);

  return (
    <div className="diff-lamps" data-testid="diff-lamps">
      {lamps.map((lamp) => (
        <span
          key={lamp.label}
          className={`diff-lamp ${lamp.active ? 'diff-lamp--active' : ''}`}
          title={lamp.label}
        />
      ))}
    </div>
  );
}
