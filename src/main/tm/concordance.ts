import type Database from 'better-sqlite3';

export interface ConcordanceResult {
  readonly tu_id: string;
  readonly tm_name: string;
  readonly source: string;
  readonly target: string;
  readonly source_highlight: { start: number; end: number }[];
  readonly target_guess: { start: number; end: number }[];
}

export interface ConcordanceOptions {
  readonly caseSensitive?: boolean;
  readonly autoWildcard?: boolean;
}

function wildcardToRegex(query: string): string {
  // Escape regex chars except * and +
  let escaped = query.replace(/[.?^${}()|[\]\\]/g, '\\$&');
  // Replace wildcards
  escaped = escaped.replace(/\*/g, '.*');
  escaped = escaped.replace(/\+/g, '.+');
  return escaped;
}

function findHighlights(text: string, regex: RegExp): { start: number; end: number }[] {
  const highlights: { start: number; end: number }[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
  while ((match = re.exec(text)) !== null) {
    highlights.push({ start: match.index, end: match.index + match[0].length });
    if (match[0].length === 0) re.lastIndex++;
  }
  return highlights;
}

export function concordanceSearch(
  db: Database.Database,
  projectId: string,
  query: string,
  options: ConcordanceOptions = {},
): ConcordanceResult[] {
  const { caseSensitive = false, autoWildcard = true } = options;

  if (!query.trim()) return [];

  const tmIds = db
    .prepare(
      `SELECT tm_id FROM project_tms WHERE project_id = ?`,
    )
    .all(projectId) as Array<{ tm_id: string }>;

  if (tmIds.length === 0) return [];

  // Build regex
  let pattern = query;
  if (autoWildcard && !pattern.includes('*') && !pattern.includes('+')) {
    pattern = `*${pattern}*`;
  }
  const regexStr = wildcardToRegex(pattern);
  const regex = new RegExp(regexStr, caseSensitive ? 'g' : 'gi');

  const placeholders = tmIds.map(() => '?').join(',');
  const rows = db
    .prepare(
      `SELECT tu.id, tu.source, tu.target, tm.name as tm_name
       FROM translation_units tu
       JOIN translation_memories tm ON tu.tm_id = tm.id
       WHERE tu.tm_id IN (${placeholders})
       LIMIT 500`,
    )
    .all(...tmIds.map((t) => t.tm_id)) as Array<{
    id: string;
    source: string;
    target: string;
    tm_name: string;
  }>;

  const results: ConcordanceResult[] = [];

  for (const row of rows) {
    const sourceHighlights = findHighlights(row.source, regex);
    const targetHighlights = findHighlights(row.target, regex);

    if (sourceHighlights.length === 0 && targetHighlights.length === 0) continue;

    // Guess translation: if source matches, highlight corresponding area in target
    const targetGuess = sourceHighlights.length > 0 ? targetHighlights : [];

    results.push({
      tu_id: row.id,
      tm_name: row.tm_name,
      source: row.source,
      target: row.target,
      source_highlight: sourceHighlights,
      target_guess: targetGuess,
    });
  }

  return results.slice(0, 50);
}
