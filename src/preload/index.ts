import { contextBridge } from 'electron';

// Phase 1-2에서 IPC 핸들러를 여기에 노출할 예정
contextBridge.exposeInMainWorld('mehQ', {
  platform: process.platform,
});
