import type Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';

let db: Database.Database | null = null;

// 지연 로드: Vite가 better-sqlite3를 번들에서 제외하므로 런타임에 로드
function loadSqlite(): typeof Database {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('better-sqlite3');
}

export function getDatabase(): Database.Database {
  if (db) return db;

  const DatabaseConstructor = loadSqlite();
  const dbPath = path.join(app.getPath('userData'), 'mehq.db');
  const instance = new DatabaseConstructor(dbPath);

  // WAL 모드: 동시 읽기 성능 향상
  instance.pragma('journal_mode = WAL');
  // 외래 키 제약 활성화
  instance.pragma('foreign_keys = ON');

  db = instance;
  return instance;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
