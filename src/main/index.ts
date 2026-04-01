import { app, BrowserWindow } from 'electron';
import { createMainWindow } from './window';
import { getDatabase, closeDatabase } from '../db/database';
import { runMigrations } from '../db/migrations/index';
import { registerAllIpc } from './ipc/index';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// electron-squirrel-startup는 Windows 전용 — macOS에서는 스킵
if (process.platform === 'win32') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    if (require('electron-squirrel-startup')) {
      app.quit();
    }
  } catch {
    // 모듈 없으면 무시
  }
}

app.on('ready', () => {
  try {
    // DB 초기화 + 마이그레이션
    const db = getDatabase();
    runMigrations(db);

    // IPC 핸들러 등록
    registerAllIpc(db);
  } catch (err) {
    console.error('[mehQ] DB initialization failed:', err);
  }

  // 윈도우 생성
  createMainWindow();
});

// macOS: Cmd+Q로 앱 완전 종료
app.on('window-all-closed', () => {
  app.quit();
});

app.on('before-quit', () => {
  closeDatabase();
});

app.on('activate', () => {
  // macOS: dock 클릭 시 창이 없으면 새로 생성
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
