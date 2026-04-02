import type Database from 'better-sqlite3';
import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/types/ipc';
import { TmRepository } from '../../db/repositories/tm';
import type { CreateTmInput, TmRole } from '../../shared/types/tm';

export function registerTmIpc(db: Database.Database): void {
  const tmRepo = new TmRepository(db);

  ipcMain.handle(IPC_CHANNELS.TM_LIST, () => {
    return tmRepo.list();
  });

  ipcMain.handle(IPC_CHANNELS.TM_GET, (_event, payload: { id: string }) => {
    return tmRepo.get(payload.id);
  });

  ipcMain.handle(IPC_CHANNELS.TM_CREATE, (_event, payload: CreateTmInput) => {
    if (tmRepo.nameExists(payload.name)) {
      throw new Error(`'${payload.name}' TM이 이미 존재합니다`);
    }
    return tmRepo.create(payload);
  });

  ipcMain.handle(IPC_CHANNELS.TM_DELETE, (_event, payload: { id: string }) => {
    tmRepo.delete(payload.id);
  });

  ipcMain.handle(
    IPC_CHANNELS.PROJECT_TM_LINK,
    (_event, payload: { projectId: string; tmId: string; role?: TmRole }) => {
      tmRepo.linkToProject(payload.projectId, payload.tmId, payload.role ?? 'working');
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.PROJECT_TM_UNLINK,
    (_event, payload: { projectId: string; tmId: string }) => {
      tmRepo.unlinkFromProject(payload.projectId, payload.tmId);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.PROJECT_TM_LIST,
    (_event, payload: { projectId: string }) => {
      return tmRepo.listByProject(payload.projectId);
    },
  );
}
