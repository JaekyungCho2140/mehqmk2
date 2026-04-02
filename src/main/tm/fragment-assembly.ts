import type Database from 'better-sqlite3';

export interface FragmentMatch {
  readonly assembled_target: string;
  readonly coverage: number;
  readonly fragments: Array<{
    readonly source_part: string;
    readonly target_part: string;
    readonly matched: boolean;
  }>;
}

/**
 * Fragment Assembly: split source into words/phrases, find exact TM matches
 * for each part, and assemble the target from matched fragments.
 */
export function assembleFragments(
  db: Database.Database,
  projectId: string,
  source: string,
  minCoverage: number = 70,
): FragmentMatch | null {
  const words = source.split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  // Get TM IDs for this project
  const tmIds = db
    .prepare('SELECT tm_id FROM project_tms WHERE project_id = ?')
    .all(projectId) as Array<{ tm_id: string }>;

  if (tmIds.length === 0) return null;

  const placeholders = tmIds.map(() => '?').join(',');
  const tmIdValues = tmIds.map((t) => t.tm_id);

  // Try progressively smaller n-grams
  const fragments: Array<{
    source_part: string;
    target_part: string;
    matched: boolean;
    startIdx: number;
    endIdx: number;
  }> = [];

  const covered = new Array<boolean>(words.length).fill(false);

  // Try from longest to shortest phrases
  for (let len = Math.min(words.length, 5); len >= 1; len--) {
    for (let i = 0; i <= words.length - len; i++) {
      // Skip if any word in range already covered
      if (covered.slice(i, i + len).some(Boolean)) continue;

      const phrase = words.slice(i, i + len).join(' ');

      const row = db
        .prepare(
          `SELECT target FROM translation_units
           WHERE tm_id IN (${placeholders}) AND source = ?
           LIMIT 1`,
        )
        .get(...tmIdValues, phrase) as { target: string } | undefined;

      if (row) {
        fragments.push({
          source_part: phrase,
          target_part: row.target,
          matched: true,
          startIdx: i,
          endIdx: i + len,
        });
        for (let j = i; j < i + len; j++) covered[j] = true;
      }
    }
  }

  // Fill uncovered words
  for (let i = 0; i < words.length; i++) {
    if (!covered[i]) {
      fragments.push({
        source_part: words[i],
        target_part: words[i], // Use source as fallback
        matched: false,
        startIdx: i,
        endIdx: i + 1,
      });
    }
  }

  // Sort by position
  fragments.sort((a, b) => a.startIdx - b.startIdx);

  const matchedWords = covered.filter(Boolean).length;
  const coverage = Math.round((matchedWords / words.length) * 100);

  if (coverage < minCoverage) return null;

  const assembled_target = fragments.map((f) => f.target_part).join(' ');

  return {
    assembled_target,
    coverage,
    fragments: fragments.map((f) => ({
      source_part: f.source_part,
      target_part: f.target_part,
      matched: f.matched,
    })),
  };
}
