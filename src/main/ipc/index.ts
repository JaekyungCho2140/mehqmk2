import type Database from 'better-sqlite3';
import { registerSettingsIpc } from './settings';
import { registerProjectsIpc } from './projects';
import { registerDocumentsIpc } from './documents';
import { registerSegmentsIpc } from './segments';
import { registerTmIpc } from './tm';

export function registerAllIpc(db: Database.Database): void {
  registerSettingsIpc(db);
  registerProjectsIpc(db);
  registerDocumentsIpc(db);
  registerSegmentsIpc(db);
  registerTmIpc(db);
}
