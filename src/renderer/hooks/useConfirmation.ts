import { useCallback } from 'react';
import type { Segment } from '../../shared/types/segment';

interface UseConfirmationOptions {
  readonly segments: Segment[];
  readonly activeSegmentId: string | null;
  readonly userName: string;
  readonly onSegmentsChange: (updater: (prev: Segment[]) => Segment[]) => void;
  readonly goToNext: () => void;
}

interface UseConfirmationResult {
  readonly confirm: () => void;
  readonly confirmNoTm: () => void;
  readonly handleEditorKeyDown: (e: KeyboardEvent) => boolean;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function useConfirmation({
  segments,
  activeSegmentId,
  userName,
  onSegmentsChange,
  goToNext,
}: UseConfirmationOptions): UseConfirmationResult {
  const confirm = useCallback(() => {
    const segment = segments.find((s) => s.id === activeSegmentId);
    if (!segment) return;

    // locked → 무시
    if (segment.locked) return;

    // 빈 target → 무시
    if (!stripHtml(segment.target)) return;

    const isLastSegment =
      segments.findIndex((s) => s.id === activeSegmentId) === segments.length - 1;

    // 이미 confirmed 이상이면 상태 변경 없이 다음 이동만
    if (
      segment.status === 'confirmed' ||
      segment.status === 'r1-confirmed' ||
      segment.status === 'r2-confirmed'
    ) {
      if (!isLastSegment) goToNext();
      return;
    }

    // 상태 전이 → confirmed
    onSegmentsChange((prev) =>
      prev.map((s) => {
        if (s.id !== activeSegmentId) return s;
        return {
          ...s,
          status: 'confirmed',
          confirmedBy: userName,
          confirmedAt: new Date().toISOString(),
        };
      }),
    );

    // 다음 세그먼트로 이동 (마지막이면 이동 없음)
    if (!isLastSegment) goToNext();
  }, [segments, activeSegmentId, userName, onSegmentsChange, goToNext]);

  const confirmNoTm = useCallback(() => {
    const segment = segments.find((s) => s.id === activeSegmentId);
    if (!segment) return;

    // locked → 무시
    if (segment.locked) return;

    // confirmed 상태에서 Ctrl+Shift+Enter → unconfirm
    if (segment.status === 'confirmed') {
      onSegmentsChange((prev) =>
        prev.map((s) => {
          if (s.id !== activeSegmentId) return s;
          return {
            ...s,
            status: 'edited',
            confirmedBy: null,
            confirmedAt: null,
          };
        }),
      );
      return;
    }

    // 그 외에는 confirm과 동일
    confirm();
  }, [segments, activeSegmentId, onSegmentsChange, confirm]);

  const handleEditorKeyDown = useCallback(
    (e: KeyboardEvent): boolean => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        confirm();
        return true;
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        confirmNoTm();
        return true;
      }
      return false;
    },
    [confirm, confirmNoTm],
  );

  return { confirm, confirmNoTm, handleEditorKeyDown };
}
