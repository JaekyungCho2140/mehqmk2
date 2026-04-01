import type Database from 'better-sqlite3';
import { migration001Init } from './001-init';

export interface Migration {
  readonly version: number;
  readonly name: string;
  readonly up: (db: Database.Database) => void;
}

const migrations: readonly Migration[] = [migration001Init];

export function runMigrations(db: Database.Database): void {
  // 마이그레이션 메타 테이블 생성
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version    INTEGER PRIMARY KEY,
      name       TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const lastVersion = db.prepare('SELECT MAX(version) as version FROM _migrations').get() as {
    version: number | null;
  };

  const currentVersion = lastVersion?.version ?? 0;

  const pending = migrations.filter((m) => m.version > currentVersion);

  for (const migration of pending) {
    const runInTransaction = db.transaction(() => {
      migration.up(db);
      db.prepare('INSERT INTO _migrations (version, name) VALUES (?, ?)').run(
        migration.version,
        migration.name,
      );
    });

    runInTransaction();
    console.log(`[DB] Migration applied: ${migration.version}-${migration.name}`);
  }
}
