import type { SettingsKey, UserSettings } from './settings';
import type { Project, CreateProjectInput } from './project';
import type { Segment } from './segment';
import type { TranslationMemory, TranslationUnit, CreateTmInput, TmRole, TmMatch, TmSearchInput, AddTmEntryInput } from './tm';

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
  PROJECT_CLONE: 'project:clone',
  DOCUMENT_IMPORT: 'document:import',
  SEGMENTS_LIST: 'segments:list',
  SEGMENTS_UPDATE: 'segments:update',
  SEGMENTS_BULK_UPDATE: 'segments:bulk-update',
  DOCUMENT_EXPORT: 'document:export',
  TM_LIST: 'tm:list',
  TM_GET: 'tm:get',
  TM_CREATE: 'tm:create',
  TM_DELETE: 'tm:delete',
  PROJECT_TM_LINK: 'project-tm:link',
  PROJECT_TM_UNLINK: 'project-tm:unlink',
  PROJECT_TM_LIST: 'project-tm:list',
  TM_SEARCH: 'tm:search',
  TM_ADD_ENTRY: 'tm:add-entry',
  TM_LIST_ENTRIES: 'tm:list-entries',
  TM_UPDATE_ENTRY: 'tm:update-entry',
  TM_DELETE_ENTRY: 'tm:delete-entry',
  TM_IMPORT_TMX: 'tm:import-tmx',
  TM_IMPORT_CSV: 'tm:import-csv',
  TM_EXPORT_TMX: 'tm:export-tmx',
  TM_UPDATE: 'tm:update',
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
  [IPC_CHANNELS.PROJECT_CLONE]: { id: string; newName: string };
  [IPC_CHANNELS.DOCUMENT_IMPORT]: { projectId: string; filePath?: string };
  [IPC_CHANNELS.SEGMENTS_LIST]: { documentId: string };
  [IPC_CHANNELS.SEGMENTS_UPDATE]: { id: string } & Record<string, unknown>;
  [IPC_CHANNELS.SEGMENTS_BULK_UPDATE]: {
    segments: Array<{ id: string } & Record<string, unknown>>;
  };
  [IPC_CHANNELS.TM_LIST]: void;
  [IPC_CHANNELS.TM_GET]: { id: string };
  [IPC_CHANNELS.TM_CREATE]: CreateTmInput;
  [IPC_CHANNELS.TM_DELETE]: { id: string };
  [IPC_CHANNELS.PROJECT_TM_LINK]: { projectId: string; tmId: string; role?: TmRole };
  [IPC_CHANNELS.PROJECT_TM_UNLINK]: { projectId: string; tmId: string };
  [IPC_CHANNELS.PROJECT_TM_LIST]: { projectId: string };
  [IPC_CHANNELS.TM_SEARCH]: TmSearchInput;
  [IPC_CHANNELS.TM_ADD_ENTRY]: AddTmEntryInput;
  [IPC_CHANNELS.TM_LIST_ENTRIES]: { tmId: string };
  [IPC_CHANNELS.TM_UPDATE_ENTRY]: { id: string; source?: string; target?: string; flagged?: boolean };
  [IPC_CHANNELS.TM_DELETE_ENTRY]: { id: string };
  [IPC_CHANNELS.TM_IMPORT_TMX]: { tmId: string; filePath?: string };
  [IPC_CHANNELS.TM_IMPORT_CSV]: { tmId: string; filePath?: string };
  [IPC_CHANNELS.TM_EXPORT_TMX]: { tmId: string };
  [IPC_CHANNELS.TM_UPDATE]: { id: string; allow_multiple?: boolean; allow_reverse?: boolean };
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
  [IPC_CHANNELS.PROJECT_CLONE]: Project;
  [IPC_CHANNELS.DOCUMENT_IMPORT]: unknown;
  [IPC_CHANNELS.SEGMENTS_LIST]: Segment[];
  [IPC_CHANNELS.SEGMENTS_UPDATE]: Segment;
  [IPC_CHANNELS.SEGMENTS_BULK_UPDATE]: void;
  [IPC_CHANNELS.TM_LIST]: TranslationMemory[];
  [IPC_CHANNELS.TM_GET]: TranslationMemory | null;
  [IPC_CHANNELS.TM_CREATE]: TranslationMemory;
  [IPC_CHANNELS.TM_DELETE]: void;
  [IPC_CHANNELS.PROJECT_TM_LINK]: void;
  [IPC_CHANNELS.PROJECT_TM_UNLINK]: void;
  [IPC_CHANNELS.PROJECT_TM_LIST]: TranslationMemory[];
  [IPC_CHANNELS.TM_SEARCH]: TmMatch[];
  [IPC_CHANNELS.TM_ADD_ENTRY]: void;
  [IPC_CHANNELS.TM_LIST_ENTRIES]: TranslationUnit[];
  [IPC_CHANNELS.TM_UPDATE_ENTRY]: void;
  [IPC_CHANNELS.TM_DELETE_ENTRY]: void;
  [IPC_CHANNELS.TM_IMPORT_TMX]: { imported: number; skipped: number };
  [IPC_CHANNELS.TM_IMPORT_CSV]: { imported: number; skipped: number };
  [IPC_CHANNELS.TM_EXPORT_TMX]: { exported: number };
  [IPC_CHANNELS.TM_UPDATE]: void;
}

export type IpcChannels = typeof IPC_CHANNELS;
