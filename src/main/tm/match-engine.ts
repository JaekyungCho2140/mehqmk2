import type Database from 'better-sqlite3';
import type { TmMatch, TmRole } from '../../shared/types/tm';
import { calculateFuzzyRate } from './levenshtein';
import { tryNumberSubstitution } from './number-substitution';
import { sortMatches, getMatchType } from './scoring';

interface SearchContext {
  readonly source: string;
  readonly prevSource?: string;
  readonly nextSource?: string;
  readonly contextId?: string;
}

interface DbTuRow {
  id: string;
  tm_id: string;
  source: string;
  target: string;
  prev_source: string | null;
  next_source: string | null;
  context_id: string | null;
  created_by: string;
  modified_at: string;
  tm_name: string;
  tm_role: string;
}

const MAX_RESULTS = 10;
const MIN_MATCH_RATE = 50;
const MAX_CANDIDATES = 100;

export class TmMatchEngine {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  search(projectId: string, context: SearchContext): TmMatch[] {
    const { source } = context;
    if (!source.trim()) return [];

    // Get all TMs linked to the project
    const projectTms = this.db
      .prepare(
        `SELECT tm.id, tm.name, pt.role
         FROM translation_memories tm
         JOIN project_tms pt ON tm.id = pt.tm_id
         WHERE pt.project_id = ?
         ORDER BY pt.rank ASC`,
      )
      .all(projectId) as Array<{ id: string; name: string; role: string }>;

    if (projectTms.length === 0) return [];

    const tmIds = projectTms.map((t) => t.id);
    const tmInfoMap = new Map(projectTms.map((t) => [t.id, { name: t.name, role: t.role as TmRole }]));

    // Phase 1: Exact matches (source = ?)
    const exactMatches = this.findExactMatches(tmIds, source, context, tmInfoMap);

    // Phase 2: Fuzzy matches (length-based pre-filter)
    const fuzzyMatches = this.findFuzzyMatches(tmIds, source, context, tmInfoMap, exactMatches);

    const allMatches = [...exactMatches, ...fuzzyMatches];
    const sorted = sortMatches(allMatches);

    return sorted.slice(0, MAX_RESULTS);
  }

  private findExactMatches(
    tmIds: string[],
    source: string,
    context: SearchContext,
    tmInfoMap: Map<string, { name: string; role: TmRole }>,
  ): TmMatch[] {
    const placeholders = tmIds.map(() => '?').join(',');
    const rows = this.db
      .prepare(
        `SELECT tu.id, tu.tm_id, tu.source, tu.target,
                tu.prev_source, tu.next_source, tu.context_id,
                tu.created_by, tu.modified_at,
                tm.name as tm_name, pt.role as tm_role
         FROM translation_units tu
         JOIN translation_memories tm ON tu.tm_id = tm.id
         JOIN project_tms pt ON tu.tm_id = pt.tm_id
         WHERE tu.tm_id IN (${placeholders})
           AND tu.source = ?
           AND pt.project_id = (
             SELECT project_id FROM project_tms WHERE tm_id = tu.tm_id LIMIT 1
           )`,
      )
      .all(...tmIds, source) as DbTuRow[];

    return rows.map((row) => {
      const info = tmInfoMap.get(row.tm_id)!;
      const { rate, penalties } = this.calculateExactRate(row, context);

      return {
        tu_id: row.id,
        tm_name: info.name,
        tm_role: info.role,
        source: row.source,
        target: row.target,
        match_rate: rate,
        match_type: getMatchType(rate),
        penalties,
        created_by: row.created_by,
        modified_at: row.modified_at,
      };
    });
  }

  private calculateExactRate(
    row: DbTuRow,
    context: SearchContext,
  ): { rate: number; penalties: string[] } {
    const penalties: string[] = [];

    const prevMatch = context.prevSource != null && row.prev_source === context.prevSource;
    const nextMatch = context.nextSource != null && row.next_source === context.nextSource;
    const ctxMatch = context.contextId != null && row.context_id === context.contextId;

    if (prevMatch && nextMatch) {
      return { rate: 102, penalties };
    }

    if (prevMatch || nextMatch || ctxMatch) {
      return { rate: 101, penalties };
    }

    return { rate: 100, penalties };
  }

  private findFuzzyMatches(
    tmIds: string[],
    source: string,
    context: SearchContext,
    tmInfoMap: Map<string, { name: string; role: TmRole }>,
    exactMatches: TmMatch[],
  ): TmMatch[] {
    const exactTuIds = new Set(exactMatches.map((m) => m.tu_id));

    // Length-based pre-filter: ±50% of source length
    const minLen = Math.floor(source.length * 0.5);
    const maxLen = Math.ceil(source.length * 1.5);

    const placeholders = tmIds.map(() => '?').join(',');
    const candidates = this.db
      .prepare(
        `SELECT tu.id, tu.tm_id, tu.source, tu.target,
                tu.prev_source, tu.next_source, tu.context_id,
                tu.created_by, tu.modified_at,
                tm.name as tm_name, pt.role as tm_role
         FROM translation_units tu
         JOIN translation_memories tm ON tu.tm_id = tm.id
         JOIN project_tms pt ON tu.tm_id = pt.tm_id
         WHERE tu.tm_id IN (${placeholders})
           AND tu.source != ?
           AND LENGTH(tu.source) BETWEEN ? AND ?
           AND pt.project_id = (
             SELECT project_id FROM project_tms WHERE tm_id = tu.tm_id LIMIT 1
           )
         LIMIT ?`,
      )
      .all(...tmIds, source, minLen, maxLen, MAX_CANDIDATES) as DbTuRow[];

    const matches: TmMatch[] = [];

    for (const row of candidates) {
      if (exactTuIds.has(row.id)) continue;

      const info = tmInfoMap.get(row.tm_id)!;
      const penalties: string[] = [];

      // Try number substitution first
      const numSub = tryNumberSubstitution(source, row.source, row.target);
      if (numSub) {
        matches.push({
          tu_id: row.id,
          tm_name: info.name,
          tm_role: info.role,
          source: row.source,
          target: numSub.substitutedTarget,
          match_rate: 100,
          match_type: 'exact',
          penalties: ['number-substitution'],
          created_by: row.created_by,
          modified_at: row.modified_at,
        });
        continue;
      }

      // Fuzzy matching
      const rate = calculateFuzzyRate(source, row.source);
      if (rate >= MIN_MATCH_RATE) {
        matches.push({
          tu_id: row.id,
          tm_name: info.name,
          tm_role: info.role,
          source: row.source,
          target: row.target,
          match_rate: rate,
          match_type: 'fuzzy',
          penalties,
          created_by: row.created_by,
          modified_at: row.modified_at,
        });
      }
    }

    return matches;
  }
}
