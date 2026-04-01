import type { ProjectStatus } from '../../shared/types/project';

interface StatusIconProps {
  readonly status: ProjectStatus;
  readonly size?: number;
}

export function StatusIcon({ status, size = 16 }: StatusIconProps): React.ReactElement {
  const r = size / 2;
  const cx = r;
  const cy = r;

  switch (status) {
    case 'not-started':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={r - 1.5} fill="none" stroke="#9ca3af" strokeWidth={2} />
        </svg>
      );
    case 'in-progress':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={r - 1} fill="none" stroke="#f59e0b" strokeWidth={2} />
          <path
            d={`M ${cx},${cy - r + 1} A ${r - 1} ${r - 1} 0 0 1 ${cx} ${cy + r - 1}`}
            fill="#f59e0b"
          />
        </svg>
      );
    case 'translation-done':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={r - 1} fill="#3b82f6" />
        </svg>
      );
    case 'r1-done':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={r - 1} fill="#22c55e" />
          <path
            d={`M ${size * 0.28} ${size * 0.5} L ${size * 0.45} ${size * 0.65} L ${size * 0.72} ${size * 0.35}`}
            fill="none"
            stroke="#fff"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'r2-done':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={r - 1} fill="#16a34a" />
          <path
            d={`M ${size * 0.2} ${size * 0.45} L ${size * 0.35} ${size * 0.6} L ${size * 0.55} ${size * 0.35}`}
            fill="none"
            stroke="#fff"
            strokeWidth={1.3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={`M ${size * 0.42} ${size * 0.45} L ${size * 0.57} ${size * 0.6} L ${size * 0.77} ${size * 0.35}`}
            fill="none"
            stroke="#fff"
            strokeWidth={1.3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'completed':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <polygon
            points={`${cx},${size * 0.05} ${size * 0.62},${size * 0.35} ${size * 0.98},${size * 0.38} ${size * 0.7},${size * 0.62} ${size * 0.8},${size * 0.98} ${cx},${size * 0.78} ${size * 0.2},${size * 0.98} ${size * 0.3},${size * 0.62} ${size * 0.02},${size * 0.38} ${size * 0.38},${size * 0.35}`}
            fill="#16a34a"
          />
        </svg>
      );
  }
}
