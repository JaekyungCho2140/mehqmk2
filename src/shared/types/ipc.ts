import type { SettingsKey, UserSettings } from './settings';

export const IPC_CHANNELS = {
  SETTINGS_GET: 'settings:get',
  SETTINGS_GET_ALL: 'settings:get-all',
  SETTINGS_SET: 'settings:set',
  SETTINGS_SET_BULK: 'settings:set-bulk',
  DIALOG_SELECT_DIRECTORY: 'dialog:select-directory',
} as const;

export interface IpcRequestMap {
  [IPC_CHANNELS.SETTINGS_GET]: { key: SettingsKey };
  [IPC_CHANNELS.SETTINGS_GET_ALL]: void;
  [IPC_CHANNELS.SETTINGS_SET]: { key: SettingsKey; value: unknown };
  [IPC_CHANNELS.SETTINGS_SET_BULK]: Partial<UserSettings>;
  [IPC_CHANNELS.DIALOG_SELECT_DIRECTORY]: { defaultPath?: string };
}

export interface IpcResponseMap {
  [IPC_CHANNELS.SETTINGS_GET]: unknown;
  [IPC_CHANNELS.SETTINGS_GET_ALL]: UserSettings;
  [IPC_CHANNELS.SETTINGS_SET]: void;
  [IPC_CHANNELS.SETTINGS_SET_BULK]: void;
  [IPC_CHANNELS.DIALOG_SELECT_DIRECTORY]: string | null;
}

export type IpcChannels = typeof IPC_CHANNELS;
