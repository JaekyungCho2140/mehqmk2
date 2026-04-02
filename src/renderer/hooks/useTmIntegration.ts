import { useState, useCallback, useEffect, useRef } from 'react';
import type { Segment } from '../../shared/types/segment';
import type { TmMatch, TranslationMemory, FragmentMatchResult } from '../../shared/types/tm';

interface UseTmIntegrationOptions {
  readonly projectId?: string;
  readonly segments: Segment[];
  readonly activeSegmentId: string | null;
  readonly onAutoInsert?: (target: string, matchRate: number) => void;
  readonly autoInsertEnabled?: boolean;
  readonly autoInsertThreshold?: number;
  readonly copySourceIfNoMatch?: boolean;
  readonly fragmentEnabled?: boolean;
  readonly fragmentMinCoverage?: number;
}

interface UseTmIntegrationResult {
  readonly matches: TmMatch[];
  readonly bestMatchRate: number | null;
  readonly fragmentMatch: FragmentMatchResult | null;
  readonly insertMatch: (index: number) => string | null;
  readonly insertFragment: () => string | null;
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
  onAutoInsert,
  autoInsertEnabled = false,
  autoInsertThreshold = 85,
  copySourceIfNoMatch = false,
  fragmentEnabled = true,
  fragmentMinCoverage = 70,
}: UseTmIntegrationOptions): UseTmIntegrationResult {
  const [matches, setMatches] = useState<TmMatch[]>([]);
  const [fragmentMatch, setFragmentMatch] = useState<FragmentMatchResult | null>(null);
  const [workingTmId, setWorkingTmId] = useState<string | null>(null);
  const searchAbortRef = useRef(0);
  const onAutoInsertRef = useRef(onAutoInsert);

  useEffect(() => {
    onAutoInsertRef.current = onAutoInsert;
  });

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

          // Fragment Assembly: run when best match < 100%
          const bestRate = results.length > 0 ? results[0].match_rate : 0;
          if (fragmentEnabled && bestRate < 100 && projectId) {
            window.electronAPI.tm.fragment(projectId, source, fragmentMinCoverage).then((frag) => {
              if (searchAbortRef.current === searchId && !cancelled) {
                setFragmentMatch(frag);
              }
            });
          } else {
            setFragmentMatch(null);
          }

          // Auto-insert logic
          if (autoInsertEnabled && onAutoInsertRef.current && segment) {
            const targetEmpty = !stripHtml(segment.target);
            if (targetEmpty && results.length > 0 && results[0].match_rate >= autoInsertThreshold) {
              onAutoInsertRef.current(results[0].target, results[0].match_rate);
            } else if (targetEmpty && results.length === 0 && copySourceIfNoMatch) {
              onAutoInsertRef.current(segment.source, 0);
            }
          }
        }
      });

    return () => { cancelled = true; };
  }, [projectId, activeSegmentId, segments, autoInsertEnabled, autoInsertThreshold, copySourceIfNoMatch, fragmentEnabled, fragmentMinCoverage]);

  const bestMatchRate = matches.length > 0 ? matches[0].match_rate : null;

  const insertMatch = useCallback(
    (index: number): string | null => {
      if (index < 0 || index >= matches.length) return null;
      return matches[index].target;
    },
    [matches],
  );

  const insertFragment = useCallback((): string | null => {
    if (!fragmentMatch) return null;
    return fragmentMatch.assembled_target;
  }, [fragmentMatch]);

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
    fragmentMatch,
    insertMatch,
    insertFragment,
    saveToTm,
    handleMatchKeyDown,
  };
}
