import { ipcMain, dialog, BrowserWindow } from 'electron';
import { IPC_CHANNELS } from '../../shared/types/ipc';
import type { SettingsKey, UserSettings } from '../../shared/types/settings';
import { SettingsRepository } from '../../db/repositories/settings';
import type Database from 'better-sqlite3';

export function registerSettingsIpc(db: Database.Database): void {
  const repo = new SettingsRepository(db);

  ipcMain.handle(
    IPC_CHANNELS.SETTINGS_GET,
    (_event, payload: { key: SettingsKey }) => {
      return repo.get(payload.key);
    }
  );

  ipcMain.handle(IPC_CHANNELS.SETTINGS_GET_ALL, () => {
    return repo.getAll();
  });

  ipcMain.handle(
    IPC_CHANNELS.SETTINGS_SET,
    (_event, payload: { key: SettingsKey; value: unknown }) => {
      repo.set(payload.key, payload.value);
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.SETTINGS_SET_BULK,
    (_event, payload: Partial<UserSettings>) => {
      repo.setBulk(payload);
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.DIALOG_SELECT_DIRECTORY,
    async (_event, payload?: { defaultPath?: string }) => {
      const win = BrowserWindow.getFocusedWindow();
      const result = await dialog.showOpenDialog(win!, {
        properties: ['openDirectory'],
        defaultPath: payload?.defaultPath,
      });

      if (result.canceled || result.filePaths.length === 0) {
        return null;
      }
      return result.filePaths[0];
    }
  );
}
