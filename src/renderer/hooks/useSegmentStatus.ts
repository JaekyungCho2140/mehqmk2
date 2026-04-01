import { useCallback } from 'react';
import type { Segment, SegmentStatus } from '../../shared/types/segment';

interface UseSegmentStatusOptions {
  readonly segments: Segment[];
  readonly activeSegmentId: string | null;
  readonly userName: string;
  readonly onSegmentsChange: (updater: (prev: Segment[]) => Segment[]) => void;
}

interface ChangeStatusOptions {
  readonly range: 'all' | 'selected' | 'from-cursor';
  readonly filterStatuses: SegmentStatus[];
  readonly targetStatus: SegmentStatus;
}

interface UseSegmentStatusResult {
  readonly toggleLock: () => void;
  readonly changeStatus: (options: ChangeStatusOptions) => void;
  readonly handleKeyDown: (e: KeyboardEvent) => boolean;
}

export function useSegmentStatus({
  segments,
  activeSegmentId,
  userName,
  onSegmentsChange,
}: UseSegmentStatusOptions): UseSegmentStatusResult {
  const toggleLock = useCallback(() => {
    if (!activeSegmentId) return;

    onSegmentsChange((prev) =>
      prev.map((s) => {
        if (s.id !== activeSegmentId) return s;
        return { ...s, locked: !s.locked };
      }),
    );
  }, [activeSegmentId, onSegmentsChange]);

  const changeStatus = useCallback(
    (options: ChangeStatusOptions) => {
      const activeIndex = segments.findIndex((s) => s.id === activeSegmentId);
      const now = new Date().toISOString();

      onSegmentsChange((prev) =>
        prev.map((s, i) => {
          // 범위 체크
          if (options.range === 'from-cursor' && i < activeIndex) return s;

          // 필터 체크
          if (options.filterStatuses.length > 0 && !options.filterStatuses.includes(s.status)) {
            return s;
          }

          // locked 세그먼트는 건너뜀
          if (s.locked) return s;

          const isConfirmed =
            options.targetStatus === 'confirmed' ||
            options.targetStatus === 'r1-confirmed' ||
            options.targetStatus === 'r2-confirmed';

          return {
            ...s,
            status: options.targetStatus,
            confirmedBy: isConfirmed ? userName : null,
            confirmedAt: isConfirmed ? now : null,
          };
        }),
      );
    },
    [segments, activeSegmentId, userName, onSegmentsChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): boolean => {
      // Ctrl+Shift+L: 잠금 토글
      if (e.key === 'L' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        toggleLock();
        return true;
      }
      return false;
    },
    [toggleLock],
  );

  return { toggleLock, changeStatus, handleKeyDown };
}

export type { ChangeStatusOptions };
