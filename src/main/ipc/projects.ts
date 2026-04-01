import { ipcMain } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import type Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../shared/types/ipc';
import type { CreateProjectInput } from '../../shared/types/project';
import { ProjectRepository } from '../../db/repositories/projects';
import { SettingsRepository } from '../../db/repositories/settings';

export function registerProjectsIpc(db: Database.Database): void {
  const projectRepo = new ProjectRepository(db);
  const settingsRepo = new SettingsRepository(db);

  ipcMain.handle(IPC_CHANNELS.PROJECT_LIST, () => {
    return projectRepo.list();
  });

  ipcMain.handle(IPC_CHANNELS.PROJECT_GET, (_event, payload: { id: string }) => {
    return projectRepo.get(payload.id);
  });

  ipcMain.handle(IPC_CHANNELS.PROJECT_CREATE, (_event, input: CreateProjectInput) => {
    // 중복 이름 체크
    if (projectRepo.nameExists(input.name)) {
      throw new Error('이 이름의 프로젝트가 이미 존재합니다');
    }

    // 디렉토리 결정
    const workDir = settingsRepo.get('work_directory') as string;
    const projectDir = input.directory || path.join(workDir, input.name);

    // 디렉토리 생성
    fs.mkdirSync(projectDir, { recursive: true });

    const createdBy = settingsRepo.get('user_name') as string;

    return projectRepo.create({ ...input, directory: projectDir }, createdBy);
  });

  ipcMain.handle(
    IPC_CHANNELS.PROJECT_UPDATE,
    (_event, payload: { id: string } & Record<string, unknown>) => {
      const { id, ...fields } = payload;
      return projectRepo.update(id, fields);
    },
  );

  ipcMain.handle(IPC_CHANNELS.PROJECT_DELETE, (_event, payload: { id: string }) => {
    projectRepo.delete(payload.id);
  });

  ipcMain.handle(IPC_CHANNELS.PROJECT_OPEN, (_event, payload: { id: string }) => {
    return projectRepo.open(payload.id);
  });
}
