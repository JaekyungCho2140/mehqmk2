import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/types/ipc';
import type { SettingsKey, UserSettings } from '../shared/types/settings';
import type { Project, CreateProjectInput } from '../shared/types/project';
import type { Segment } from '../shared/types/segment';
import type { TranslationMemory, TranslationUnit, CreateTmInput, TmRole, TmMatch, TmSearchInput, AddTmEntryInput, ConcordanceInput, ConcordanceResultItem, FragmentMatchResult } from '../shared/types/tm';

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
  document: {
    import: (projectId: string, filePath?: string): Promise<unknown> =>
      ipcRenderer.invoke(IPC_CHANNELS.DOCUMENT_IMPORT, { projectId, filePath }),
    export: (documentId: string, projectId: string): Promise<unknown> =>
      ipcRenderer.invoke(IPC_CHANNELS.DOCUMENT_EXPORT, { documentId, projectId }),
  },
  segments: {
    list: (documentId: string): Promise<Segment[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.SEGMENTS_LIST, { documentId }),
    update: (id: string, fields: Partial<Segment>): Promise<Segment> =>
      ipcRenderer.invoke(IPC_CHANNELS.SEGMENTS_UPDATE, { id, ...fields }),
    bulkUpdate: (segments: Array<{ id: string } & Record<string, unknown>>): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.SEGMENTS_BULK_UPDATE, { segments }),
  },
  tm: {
    list: (): Promise<TranslationMemory[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.TM_LIST),
    get: (id: string): Promise<TranslationMemory | null> =>
      ipcRenderer.invoke(IPC_CHANNELS.TM_GET, { id }),
    create: (input: CreateTmInput): Promise<TranslationMemory> =>
      ipcRenderer.invoke(IPC_CHANNELS.TM_CREATE, input),
    delete: (id: string): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.TM_DELETE, { id }),
    linkToProject: (projectId: string, tmId: string, role?: TmRole): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.PROJECT_TM_LINK, { projectId, tmId, role }),
    unlinkFromProject: (projectId: string, tmId: string): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.PROJECT_TM_UNLINK, { projectId, tmId }),
    listByProject: (projectId: string): Promise<TranslationMemory[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.PROJECT_TM_LIST, { projectId }),
    search: (input: TmSearchInput): Promise<TmMatch[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.TM_SEARCH, input),
    addEntry: (input: AddTmEntryInput): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.TM_ADD_ENTRY, input),
    listEntries: (tmId: string): Promise<TranslationUnit[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.TM_LIST_ENTRIES, { tmId }),
    updateEntry: (id: string, fields: { source?: string; target?: string; flagged?: boolean }): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.TM_UPDATE_ENTRY, { id, ...fields }),
    deleteEntry: (id: string): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.TM_DELETE_ENTRY, { id }),
    importTmx: (tmId: string, filePath?: string): Promise<{ imported: number; skipped: number }> =>
      ipcRenderer.invoke(IPC_CHANNELS.TM_IMPORT_TMX, { tmId, filePath }),
    importCsv: (tmId: string, filePath?: string): Promise<{ imported: number; skipped: number }> =>
      ipcRenderer.invoke(IPC_CHANNELS.TM_IMPORT_CSV, { tmId, filePath }),
    exportTmx: (tmId: string): Promise<{ exported: number }> =>
      ipcRenderer.invoke(IPC_CHANNELS.TM_EXPORT_TMX, { tmId }),
    update: (id: string, fields: { allow_multiple?: boolean; allow_reverse?: boolean }): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.TM_UPDATE, { id, ...fields }),
    concordance: (input: ConcordanceInput): Promise<ConcordanceResultItem[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.TM_CONCORDANCE, input),
    fragment: (projectId: string, source: string, minCoverage?: number): Promise<FragmentMatchResult | null> =>
      ipcRenderer.invoke(IPC_CHANNELS.TM_FRAGMENT, { projectId, source, minCoverage }),
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;
