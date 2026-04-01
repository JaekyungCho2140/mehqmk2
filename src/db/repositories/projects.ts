import type Database from 'better-sqlite3';
import type { Project, CreateProjectInput } from '../../shared/types/project';
import crypto from 'node:crypto';

export class ProjectRepository {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  list(): Project[] {
    return this.db.prepare('SELECT * FROM projects ORDER BY last_accessed DESC').all() as Project[];
  }

  get(id: string): Project | null {
    return (
      (this.db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | undefined) ??
      null
    );
  }

  create(input: CreateProjectInput, createdBy: string): Project {
    const id = crypto.randomUUID();

    this.db
      .prepare(
        `INSERT INTO projects (id, name, source_lang, target_lang, client, domain, subject, description, directory, deadline, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        id,
        input.name,
        input.source_lang,
        input.target_lang,
        input.client ?? '',
        input.domain ?? '',
        input.subject ?? '',
        input.description ?? '',
        input.directory ?? '',
        input.deadline ?? null,
        createdBy,
      );

    return this.get(id)!;
  }

  update(id: string, fields: Partial<Omit<Project, 'id' | 'created_at' | 'created_by'>>): Project {
    const allowed = [
      'name',
      'source_lang',
      'target_lang',
      'client',
      'domain',
      'subject',
      'description',
      'directory',
      'deadline',
      'status',
      'last_accessed',
    ] as const;

    const entries = Object.entries(fields).filter(([key]) =>
      (allowed as readonly string[]).includes(key),
    );

    if (entries.length === 0) return this.get(id)!;

    const setClauses = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([, v]) => v);

    this.db.prepare(`UPDATE projects SET ${setClauses} WHERE id = ?`).run(...values, id);

    return this.get(id)!;
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  }

  open(id: string): Project {
    this.db.prepare("UPDATE projects SET last_accessed = datetime('now') WHERE id = ?").run(id);
    return this.get(id)!;
  }

  nameExists(name: string): boolean {
    const row = this.db.prepare('SELECT 1 FROM projects WHERE name = ?').get(name);
    return !!row;
  }

  clone(id: string, newName: string, newDirectory: string, createdBy: string): Project {
    const original = this.get(id);
    if (!original) throw new Error('원본 프로젝트를 찾을 수 없습니다');

    const newId = crypto.randomUUID();

    this.db
      .prepare(
        `INSERT INTO projects (id, name, source_lang, target_lang, client, domain, subject, description, directory, deadline, status, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'not-started', ?)`,
      )
      .run(
        newId,
        newName,
        original.source_lang,
        original.target_lang,
        original.client,
        original.domain,
        original.subject,
        original.description,
        newDirectory,
        original.deadline,
        createdBy,
      );

    return this.get(newId)!;
  }
}
