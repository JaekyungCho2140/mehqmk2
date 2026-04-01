import type { SettingsKey, UserSettings } from './settings';
import type { Project, CreateProjectInput } from './project';

export const IPC_CHANNELS = {
  SETTINGS_GET: 'settings:get',
  SETTINGS_GET_ALL: 'settings:get-all',
  SETTINGS_SET: 'settings:set',
  SETTINGS_SET_BULK: 'settings:set-bulk',
  DIALOG_SELECT_DIRECTORY: 'dialog:select-directory',
  PROJECT_LIST: 'project:list',
  PROJECT_GET: 'project:get',
  PROJECT_CREATE: 'project:create',
  PROJECT_UPDATE: 'project:update',
  PROJECT_DELETE: 'project:delete',
  PROJECT_OPEN: 'project:open',
} as const;

export interface IpcRequestMap {
  [IPC_CHANNELS.SETTINGS_GET]: { key: SettingsKey };
  [IPC_CHANNELS.SETTINGS_GET_ALL]: void;
  [IPC_CHANNELS.SETTINGS_SET]: { key: SettingsKey; value: unknown };
  [IPC_CHANNELS.SETTINGS_SET_BULK]: Partial<UserSettings>;
  [IPC_CHANNELS.DIALOG_SELECT_DIRECTORY]: { defaultPath?: string };
  [IPC_CHANNELS.PROJECT_LIST]: void;
  [IPC_CHANNELS.PROJECT_GET]: { id: string };
  [IPC_CHANNELS.PROJECT_CREATE]: CreateProjectInput;
  [IPC_CHANNELS.PROJECT_UPDATE]: { id: string } & Partial<Project>;
  [IPC_CHANNELS.PROJECT_DELETE]: { id: string };
  [IPC_CHANNELS.PROJECT_OPEN]: { id: string };
}

export interface IpcResponseMap {
  [IPC_CHANNELS.SETTINGS_GET]: unknown;
  [IPC_CHANNELS.SETTINGS_GET_ALL]: UserSettings;
  [IPC_CHANNELS.SETTINGS_SET]: void;
  [IPC_CHANNELS.SETTINGS_SET_BULK]: void;
  [IPC_CHANNELS.DIALOG_SELECT_DIRECTORY]: string | null;
  [IPC_CHANNELS.PROJECT_LIST]: Project[];
  [IPC_CHANNELS.PROJECT_GET]: Project | null;
  [IPC_CHANNELS.PROJECT_CREATE]: Project;
  [IPC_CHANNELS.PROJECT_UPDATE]: Project;
  [IPC_CHANNELS.PROJECT_DELETE]: void;
  [IPC_CHANNELS.PROJECT_OPEN]: Project;
}

export type IpcChannels = typeof IPC_CHANNELS;
