import type Database from 'better-sqlite3';
import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/types/ipc';
import { TmRepository } from '../../db/repositories/tm';
import type { CreateTmInput, TmRole, TmSearchInput, AddTmEntryInput } from '../../shared/types/tm';
import { TmMatchEngine } from '../tm/match-engine';

export function registerTmIpc(db: Database.Database): void {
  const tmRepo = new TmRepository(db);
  const matchEngine = new TmMatchEngine(db);

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

  ipcMain.handle(IPC_CHANNELS.TM_SEARCH, (_event, payload: TmSearchInput) => {
    return matchEngine.search(payload.projectId, {
      source: payload.source,
      prevSource: payload.prevSource,
      nextSource: payload.nextSource,
      contextId: payload.contextId,
    });
  });

  ipcMain.handle(IPC_CHANNELS.TM_ADD_ENTRY, (_event, payload: AddTmEntryInput) => {
    tmRepo.addEntry(payload);
  });

  ipcMain.handle(IPC_CHANNELS.TM_LIST_ENTRIES, (_event, payload: { tmId: string }) => {
    return tmRepo.listEntries(payload.tmId);
  });

  ipcMain.handle(
    IPC_CHANNELS.TM_UPDATE_ENTRY,
    (_event, payload: { id: string; source?: string; target?: string; flagged?: boolean }) => {
      tmRepo.updateEntry(payload.id, payload);
    },
  );

  ipcMain.handle(IPC_CHANNELS.TM_DELETE_ENTRY, (_event, payload: { id: string }) => {
    tmRepo.deleteEntry(payload.id);
  });
}
