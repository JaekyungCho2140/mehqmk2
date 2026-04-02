import { useState, useCallback, useEffect, useRef } from 'react';
import type { Segment } from '../../shared/types/segment';
import type { TmMatch, TranslationMemory } from '../../shared/types/tm';

interface UseTmIntegrationOptions {
  readonly projectId?: string;
  readonly segments: Segment[];
  readonly activeSegmentId: string | null;
}

interface UseTmIntegrationResult {
  readonly matches: TmMatch[];
  readonly bestMatchRate: number | null;
  readonly insertMatch: (index: number) => string | null;
  readonly saveToTm: (source: string, target: string) => void;
  readonly handleMatchKeyDown: (e: KeyboardEvent) => boolean;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function useTmIntegration({
  projectId,
  segments,
  activeSegmentId,
}: UseTmIntegrationOptions): UseTmIntegrationResult {
  const [matches, setMatches] = useState<TmMatch[]>([]);
  const [workingTmId, setWorkingTmId] = useState<string | null>(null);
  const searchAbortRef = useRef(0);

  // Load project TMs to find the working TM
  useEffect(() => {
    let cancelled = false;
    if (!projectId) {
      return;
    }
    window.electronAPI.tm.listByProject(projectId).then((tms: TranslationMemory[]) => {
      if (cancelled) return;
      const working = tms.find((t) => t.role === 'working');
      setWorkingTmId(working?.id ?? null);
    });
    return () => { cancelled = true; };
  }, [projectId]);

  // Search TM when active segment changes
  useEffect(() => {
    let cancelled = false;
    const segment = projectId && activeSegmentId
      ? segments.find((s) => s.id === activeSegmentId)
      : undefined;
    const source = segment ? stripHtml(segment.source) : '';
    const searchId = ++searchAbortRef.current;

    if (!projectId || !segment || !source) {
      // Clear matches asynchronously via microtask to avoid sync setState in effect
      Promise.resolve().then(() => {
        if (!cancelled) setMatches([]);
      });
      return () => { cancelled = true; };
    }

    const segIndex = segments.indexOf(segment);
    const prevSource = segIndex > 0 ? stripHtml(segments[segIndex - 1].source) : undefined;
    const nextSource =
      segIndex < segments.length - 1 ? stripHtml(segments[segIndex + 1].source) : undefined;

    window.electronAPI.tm
      .search({
        projectId,
        source,
        prevSource,
        nextSource,
        contextId: undefined,
      })
      .then((results) => {
        if (searchAbortRef.current === searchId && !cancelled) {
          setMatches(results);
        }
      });

    return () => { cancelled = true; };
  }, [projectId, activeSegmentId, segments]);

  const bestMatchRate = matches.length > 0 ? matches[0].match_rate : null;

  const insertMatch = useCallback(
    (index: number): string | null => {
      if (index < 0 || index >= matches.length) return null;
      return matches[index].target;
    },
    [matches],
  );

  const saveToTm = useCallback(
    (source: string, target: string) => {
      if (!workingTmId || !projectId) return;

      const plainSource = stripHtml(source);
      const plainTarget = stripHtml(target);
      if (!plainSource || !plainTarget) return;

      const segment = segments.find((s) => s.id === activeSegmentId);
      if (!segment) return;

      const segIndex = segments.findIndex((s) => s.id === activeSegmentId);
      const prevSource = segIndex > 0 ? stripHtml(segments[segIndex - 1].source) : undefined;
      const nextSource =
        segIndex < segments.length - 1 ? stripHtml(segments[segIndex + 1].source) : undefined;

      window.electronAPI.tm.addEntry({
        tmId: workingTmId,
        source: plainSource,
        target: plainTarget,
        prevSource,
        nextSource,
        createdBy: 'TestUser',
      });
    },
    [workingTmId, projectId, segments, activeSegmentId],
  );

  const handleMatchKeyDown = useCallback(
    (e: KeyboardEvent): boolean => {
      // Ctrl+1~9 → insert match
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key, 10) - 1;
        if (index < matches.length) {
          e.preventDefault();
          return true;
        }
      }
      return false;
    },
    [matches],
  );

  return {
    matches,
    bestMatchRate,
    insertMatch,
    saveToTm,
    handleMatchKeyDown,
  };
}
