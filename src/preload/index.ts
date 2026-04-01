import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/types/ipc';
import type { SettingsKey, UserSettings } from '../shared/types/settings';
import type { Project, CreateProjectInput } from '../shared/types/project';

const electronAPI = {
  platform: process.platform,
  settings: {
    get: (key: SettingsKey): Promise<unknown> =>
      ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET, { key }),
    getAll: (): Promise<UserSettings> => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET_ALL),
    set: (key: SettingsKey, value: unknown): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SET, { key, value }),
    setBulk: (settings: Partial<UserSettings>): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SET_BULK, settings),
  },
  dialog: {
    selectDirectory: (options?: { defaultPath?: string }): Promise<string | null> =>
      ipcRenderer.invoke(IPC_CHANNELS.DIALOG_SELECT_DIRECTORY, options),
  },
  project: {
    list: (): Promise<Project[]> => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_LIST),
    get: (id: string): Promise<Project | null> =>
      ipcRenderer.invoke(IPC_CHANNELS.PROJECT_GET, { id }),
    create: (input: CreateProjectInput): Promise<Project> =>
      ipcRenderer.invoke(IPC_CHANNELS.PROJECT_CREATE, input),
    update: (id: string, fields: Partial<Project>): Promise<Project> =>
      ipcRenderer.invoke(IPC_CHANNELS.PROJECT_UPDATE, { id, ...fields }),
    delete: (id: string): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_DELETE, { id }),
    open: (id: string): Promise<Project> => ipcRenderer.invoke(IPC_CHANNELS.PROJECT_OPEN, { id }),
    clone: (id: string, newName: string): Promise<Project> =>
      ipcRenderer.invoke(IPC_CHANNELS.PROJECT_CLONE, { id, newName }),
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;
