import { useMemo } from 'react';
import type { Segment, SegmentStatus } from '../../shared/types/segment';

export interface SegmentStats {
  readonly total: number;
  readonly filtered: number;
  readonly completeness: number;
  readonly counts: Record<string, number>;
  readonly currentIndex: number;
}

const STATUS_ABBR: Record<SegmentStatus, string> = {
  confirmed: 'TR',
  'r1-confirmed': 'R1',
  'r2-confirmed': 'R2',
  edited: 'Ed',
  rejected: 'Rej',
  'not-started': 'Empty',
  'pre-translated': 'Pre',
  assembled: 'Frag',
  locked: 'Lock',
};

export { STATUS_ABBR };

export function useSegmentStats(
  segments: Segment[],
  filteredCount: number,
  activeSegmentId: string | null,
): SegmentStats {
  return useMemo(() => {
    const counts: Record<string, number> = {};
    for (const abbr of Object.values(STATUS_ABBR)) {
      counts[abbr] = 0;
    }
    let confirmedTotal = 0;

    for (const seg of segments) {
      const abbr = STATUS_ABBR[seg.status];
      counts[abbr] = (counts[abbr] ?? 0) + 1;

      if (
        seg.status === 'confirmed' ||
        seg.status === 'r1-confirmed' ||
        seg.status === 'r2-confirmed'
      ) {
        confirmedTotal++;
      }
    }

    const total = segments.length;
    const completeness = total > 0 ? Math.round((confirmedTotal / total) * 100) : 0;
    const currentIndex = activeSegmentId
      ? segments.findIndex((s) => s.id === activeSegmentId) + 1
      : 0;

    return { total, filtered: filteredCount, completeness, counts, currentIndex };
  }, [segments, filteredCount, activeSegmentId]);
}
