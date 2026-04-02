import type { TmMatch, TmRole } from '../../shared/types/tm';

const ROLE_PRIORITY: Record<TmRole, number> = {
  working: 0,
  master: 1,
  reference: 2,
};

/**
 * Sort matches by match_rate descending, then by TM role priority.
 */
export function sortMatches(matches: TmMatch[]): TmMatch[] {
  return [...matches].sort((a, b) => {
    if (b.match_rate !== a.match_rate) {
      return b.match_rate - a.match_rate;
    }
    return ROLE_PRIORITY[a.tm_role] - ROLE_PRIORITY[b.tm_role];
  });
}

/**
 * Determine match type based on rate.
 */
export function getMatchType(rate: number): TmMatch['match_type'] {
  if (rate >= 102) return 'double-context';
  if (rate >= 101) return 'context';
  if (rate >= 100) return 'exact';
  return 'fuzzy';
}
