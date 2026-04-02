import type Database from 'better-sqlite3';
import type { TranslationMemory, CreateTmInput, TmRole } from '../../shared/types/tm';
import crypto from 'node:crypto';

interface DbTmRow {
  id: string;
  name: string;
  source_lang: string;
  target_lang: string;
  description: string;
  role: string;
  allow_multiple: number;
  allow_reverse: number;
  entry_count: number;
  created_at: string;
  updated_at: string;
}

function rowToTm(row: DbTmRow): TranslationMemory {
  return {
    id: row.id,
    name: row.name,
    source_lang: row.source_lang,
    target_lang: row.target_lang,
    description: row.description,
    role: row.role as TmRole,
    allow_multiple: row.allow_multiple === 1,
    allow_reverse: row.allow_reverse === 1,
    entry_count: row.entry_count,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export class TmRepository {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  list(): TranslationMemory[] {
    const rows = this.db
      .prepare('SELECT * FROM translation_memories ORDER BY updated_at DESC')
      .all() as DbTmRow[];
    return rows.map(rowToTm);
  }

  get(id: string): TranslationMemory | null {
    const row = this.db
      .prepare('SELECT * FROM translation_memories WHERE id = ?')
      .get(id) as DbTmRow | undefined;
    return row ? rowToTm(row) : null;
  }

  create(input: CreateTmInput): TranslationMemory {
    const id = crypto.randomUUID();

    this.db
      .prepare(
        `INSERT INTO translation_memories (id, name, source_lang, target_lang, description, role)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        id,
        input.name,
        input.source_lang,
        input.target_lang,
        input.description ?? '',
        input.role ?? 'working',
      );

    return this.get(id)!;
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM translation_memories WHERE id = ?').run(id);
  }

  nameExists(name: string): boolean {
    const row = this.db.prepare('SELECT 1 FROM translation_memories WHERE name = ?').get(name);
    return !!row;
  }

  linkToProject(projectId: string, tmId: string, role: TmRole = 'working'): void {
    const maxRank = this.db
      .prepare('SELECT COALESCE(MAX(rank), -1) as max_rank FROM project_tms WHERE project_id = ?')
      .get(projectId) as { max_rank: number };

    this.db
      .prepare(
        `INSERT OR REPLACE INTO project_tms (project_id, tm_id, role, rank)
         VALUES (?, ?, ?, ?)`,
      )
      .run(projectId, tmId, role, maxRank.max_rank + 1);
  }

  unlinkFromProject(projectId: string, tmId: string): void {
    this.db
      .prepare('DELETE FROM project_tms WHERE project_id = ? AND tm_id = ?')
      .run(projectId, tmId);
  }

  listByProject(projectId: string): TranslationMemory[] {
    const rows = this.db
      .prepare(
        `SELECT tm.*, pt.role as project_role, pt.rank
         FROM translation_memories tm
         JOIN project_tms pt ON tm.id = pt.tm_id
         WHERE pt.project_id = ?
         ORDER BY pt.rank ASC`,
      )
      .all(projectId) as (DbTmRow & { project_role: string; rank: number })[];

    return rows.map((row) => ({
      ...rowToTm(row),
      role: row.project_role as TmRole,
    }));
  }
}
