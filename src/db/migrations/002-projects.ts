import type { Migration } from './index';

export const migration002Projects: Migration = {
  version: 2,
  name: 'create-projects-documents',
  up: (db) => {
    db.exec(`
      CREATE TABLE projects (
        id            TEXT PRIMARY KEY,
        name          TEXT NOT NULL,
        source_lang   TEXT NOT NULL,
        target_lang   TEXT NOT NULL,
        client        TEXT DEFAULT '',
        domain        TEXT DEFAULT '',
        subject       TEXT DEFAULT '',
        description   TEXT DEFAULT '',
        directory     TEXT NOT NULL,
        deadline      TEXT DEFAULT NULL,
        status        TEXT NOT NULL DEFAULT 'not-started',
        created_by    TEXT NOT NULL,
        created_at    TEXT NOT NULL DEFAULT (datetime('now')),
        last_accessed TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(name)
      )
    `);

    db.exec(`
      CREATE TABLE documents (
        id          TEXT PRIMARY KEY,
        project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        name        TEXT NOT NULL,
        format      TEXT NOT NULL,
        file_path   TEXT NOT NULL,
        seg_count   INTEGER DEFAULT 0,
        progress    REAL DEFAULT 0.0,
        imported_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
  },
};
