import type Database from 'better-sqlite3';
import { registerSettingsIpc } from './settings';

export function registerAllIpc(db: Database.Database): void {
  registerSettingsIpc(db);
}
