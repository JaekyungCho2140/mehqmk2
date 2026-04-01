import type Database from 'better-sqlite3';
import { registerSettingsIpc } from './settings';
import { registerProjectsIpc } from './projects';

export function registerAllIpc(db: Database.Database): void {
  registerSettingsIpc(db);
  registerProjectsIpc(db);
}
