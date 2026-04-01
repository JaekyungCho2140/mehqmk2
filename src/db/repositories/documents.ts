import type Database from 'better-sqlite3';
import type { Document } from '../../shared/types/project';

export class DocumentRepository {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  listByProject(projectId: string): Document[] {
    return this.db
      .prepare('SELECT * FROM documents WHERE project_id = ? ORDER BY imported_at DESC')
      .all(projectId) as Document[];
  }
}
