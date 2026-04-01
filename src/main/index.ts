import { app, BrowserWindow } from 'electron';
import { createMainWindow } from './window';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

app.on('ready', () => {
  createMainWindow();
});

// macOS: Cmd+Q로 앱 완전 종료
app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  // macOS: dock 클릭 시 창이 없으면 새로 생성
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
