import type { Migration } from './index';

export const migration004Tm: Migration = {
  version: 4,
  name: 'create-tm',
  up: (db) => {
    db.exec(`
      CREATE TABLE translation_memories (
        id              TEXT PRIMARY KEY,
        name            TEXT NOT NULL UNIQUE,
        source_lang     TEXT NOT NULL,
        target_lang     TEXT NOT NULL,
        description     TEXT DEFAULT '',
        role            TEXT NOT NULL DEFAULT 'working',
        allow_multiple  INTEGER DEFAULT 1,
        allow_reverse   INTEGER DEFAULT 0,
        entry_count     INTEGER DEFAULT 0,
        created_at      TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    db.exec(`
      CREATE TABLE translation_units (
        id              TEXT PRIMARY KEY,
        tm_id           TEXT NOT NULL REFERENCES translation_memories(id) ON DELETE CASCADE,
        source          TEXT NOT NULL,
        target          TEXT NOT NULL,
        prev_source     TEXT DEFAULT NULL,
        next_source     TEXT DEFAULT NULL,
        context_id      TEXT DEFAULT NULL,
        created_by      TEXT DEFAULT '',
        created_at      TEXT NOT NULL DEFAULT (datetime('now')),
        modified_by     TEXT DEFAULT '',
        modified_at     TEXT NOT NULL DEFAULT (datetime('now')),
        document_name   TEXT DEFAULT '',
        project_name    TEXT DEFAULT '',
        client          TEXT DEFAULT '',
        domain          TEXT DEFAULT '',
        flagged         INTEGER DEFAULT 0,
        UNIQUE(tm_id, source, prev_source, next_source, context_id)
      )
    `);

    db.exec(`
      CREATE INDEX idx_tu_tm_source ON translation_units(tm_id, source)
    `);

    db.exec(`
      CREATE TABLE project_tms (
        project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        tm_id       TEXT NOT NULL REFERENCES translation_memories(id) ON DELETE CASCADE,
        role        TEXT NOT NULL DEFAULT 'working',
        rank        INTEGER DEFAULT 0,
        PRIMARY KEY (project_id, tm_id)
      )
    `);
  },
};
