interface MatchIndicatorProps {
  readonly matchRate: number | null;
}

function getMatchColor(rate: number): string {
  if (rate >= 102) return '#16a34a';
  if (rate >= 101) return '#22c55e';
  if (rate >= 100) return '#3b82f6';
  if (rate >= 85) return '#60a5fa';
  return '#f59e0b';
}

export function MatchIndicator({ matchRate }: MatchIndicatorProps): React.ReactElement | null {
  if (matchRate == null) return null;

  return (
    <span
      className="match-indicator"
      style={{ backgroundColor: getMatchColor(matchRate) }}
      data-testid="match-indicator"
    >
      {matchRate}%
    </span>
  );
}
