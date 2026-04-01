import { useCallback } from 'react';
import type { Segment } from '../../shared/types/segment';

interface UseEditorNavigationOptions {
  readonly segments: Segment[];
  readonly activeSegmentId: string | null;
  readonly onNavigate: (segmentId: string) => void;
}

interface UseEditorNavigationResult {
  readonly goToNext: () => void;
  readonly goToPrev: () => void;
  readonly goToFirst: () => void;
  readonly goToLast: () => void;
  readonly goToOffset: (offset: number) => void;
  readonly handleGridKeyDown: (e: React.KeyboardEvent) => void;
  readonly handleEditorKeyDown: (e: KeyboardEvent) => boolean;
}

export function useEditorNavigation({
  segments,
  activeSegmentId,
  onNavigate,
}: UseEditorNavigationOptions): UseEditorNavigationResult {
  const currentIndex = segments.findIndex((s) => s.id === activeSegmentId);

  const goToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, segments.length - 1));
      if (clamped >= 0 && clamped < segments.length) {
        onNavigate(segments[clamped].id);
      }
    },
    [segments, onNavigate],
  );

  const goToNext = useCallback(() => goToIndex(currentIndex + 1), [currentIndex, goToIndex]);
  const goToPrev = useCallback(() => goToIndex(currentIndex - 1), [currentIndex, goToIndex]);
  const goToFirst = useCallback(() => goToIndex(0), [goToIndex]);
  const goToLast = useCallback(() => goToIndex(segments.length - 1), [segments.length, goToIndex]);
  const goToOffset = useCallback(
    (offset: number) => goToIndex(currentIndex + offset),
    [currentIndex, goToIndex],
  );

  const handleGridKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          goToNext();
          break;
        case 'ArrowUp':
          e.preventDefault();
          goToPrev();
          break;
        case 'Home':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            goToFirst();
          }
          break;
        case 'End':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            goToLast();
          }
          break;
        case 'PageDown':
          e.preventDefault();
          goToOffset(10);
          break;
        case 'PageUp':
          e.preventDefault();
          goToOffset(-10);
          break;
      }
    },
    [goToNext, goToPrev, goToFirst, goToLast, goToOffset],
  );

  // TipTap 내 키 이벤트 — true 반환 시 이벤트 소비됨
  const handleEditorKeyDown = useCallback(
    (e: KeyboardEvent): boolean => {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        goToNext();
        return true;
      }
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        goToPrev();
        return true;
      }
      return false;
    },
    [goToNext, goToPrev],
  );

  return {
    goToNext,
    goToPrev,
    goToFirst,
    goToLast,
    goToOffset,
    handleGridKeyDown,
    handleEditorKeyDown,
  };
}
