import { ipcMain } from 'electron';
import type Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../shared/types/ipc';
import { SegmentRepository } from '../../db/repositories/segments';

export function registerSegmentsIpc(db: Database.Database): void {
  const segmentRepo = new SegmentRepository(db);

  ipcMain.handle(IPC_CHANNELS.SEGMENTS_LIST, (_event, payload: { documentId: string }) => {
    return segmentRepo.listByDocument(payload.documentId);
  });

  ipcMain.handle(
    IPC_CHANNELS.SEGMENTS_UPDATE,
    (_event, payload: { id: string } & Record<string, unknown>) => {
      const { id, ...fields } = payload;
      return segmentRepo.update(id, fields);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.SEGMENTS_BULK_UPDATE,
    (_event, payload: { segments: Array<{ id: string } & Record<string, unknown>> }) => {
      segmentRepo.bulkUpdate(payload.segments);
    },
  );
}
