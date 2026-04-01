import type Database from 'better-sqlite3';
import type { SettingsKey, UserSettings } from '../../shared/types/settings';
import { DEFAULT_SETTINGS } from '../../shared/types/settings';
import { app } from 'electron';
import path from 'node:path';
import os from 'node:os';

function getDefaultWorkDirectory(): string {
  return path.join(os.homedir(), 'Documents', 'mehQ');
}

function resolveDefaults(): UserSettings {
  return {
    ...DEFAULT_SETTINGS,
    work_directory: getDefaultWorkDirectory(),
  };
}

export class SettingsRepository {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  get(key: SettingsKey): unknown {
    const row = this.db
      .prepare('SELECT value FROM user_settings WHERE key = ?')
      .get(key) as { value: string } | undefined;

    if (!row) {
      const defaults = resolveDefaults();
      return defaults[key];
    }

    return JSON.parse(row.value);
  }

  getAll(): UserSettings {
    const rows = this.db
      .prepare('SELECT key, value FROM user_settings')
      .all() as Array<{ key: string; value: string }>;

    const defaults = resolveDefaults();
    const stored: Record<string, unknown> = {};

    for (const row of rows) {
      stored[row.key] = JSON.parse(row.value);
    }

    return {
      ...defaults,
      ...stored,
    } as UserSettings;
  }

  set(key: SettingsKey, value: unknown): void {
    this.db
      .prepare('INSERT OR REPLACE INTO user_settings (key, value) VALUES (?, ?)')
      .run(key, JSON.stringify(value));
  }

  setBulk(settings: Partial<UserSettings>): void {
    const upsert = this.db.prepare(
      'INSERT OR REPLACE INTO user_settings (key, value) VALUES (?, ?)'
    );

    const runInTransaction = this.db.transaction(() => {
      for (const [key, value] of Object.entries(settings)) {
        upsert.run(key, JSON.stringify(value));
      }
    });

    runInTransaction();
  }
}
