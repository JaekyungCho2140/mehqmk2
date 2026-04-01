import type { Migration } from './index';

export const migration001Init: Migration = {
  version: 1,
  name: 'init-user-settings',
  up: (db) => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_settings (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);
  },
};
