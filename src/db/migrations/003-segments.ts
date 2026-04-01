import type { Migration } from './index';

export const migration003Segments: Migration = {
  version: 3,
  name: 'create-segments',
  up: (db) => {
    db.exec(`
      CREATE TABLE segments (
        id           TEXT PRIMARY KEY,
        document_id  TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
        index_num    INTEGER NOT NULL,
        source       TEXT NOT NULL,
        target       TEXT DEFAULT '',
        status       TEXT NOT NULL DEFAULT 'not-started',
        locked       INTEGER DEFAULT 0,
        match_rate   INTEGER DEFAULT NULL,
        modified     INTEGER DEFAULT 0,
        confirmed_by TEXT DEFAULT NULL,
        confirmed_at TEXT DEFAULT NULL,
        context_id   TEXT DEFAULT NULL,
        notes        TEXT DEFAULT NULL,
        created_at   TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(document_id, index_num)
      )
    `);
  },
};
