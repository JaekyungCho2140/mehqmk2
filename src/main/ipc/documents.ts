import { ipcMain, dialog, BrowserWindow } from 'electron';
import path from 'node:path';
import crypto from 'node:crypto';
import type Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../shared/types/ipc';
import { parseXliff } from '../parsers/xliff';
import { SegmentRepository } from '../../db/repositories/segments';

export function registerDocumentsIpc(db: Database.Database): void {
  const segmentRepo = new SegmentRepository(db);

  ipcMain.handle(
    IPC_CHANNELS.DOCUMENT_IMPORT,
    async (_event, payload: { projectId: string; filePath?: string }) => {
      let filePath = payload.filePath;

      // 파일 경로가 없으면 다이얼로그로 선택
      if (!filePath) {
        const win = BrowserWindow.getFocusedWindow();
        const result = await dialog.showOpenDialog(win!, {
          filters: [
            { name: 'XLIFF', extensions: ['xliff', 'xlf'] },
            { name: 'All Files', extensions: ['*'] },
          ],
          properties: ['openFile'],
        });
        if (result.canceled || result.filePaths.length === 0) return null;
        filePath = result.filePaths[0];
      }

      // 파서 실행
      const parsed = parseXliff(filePath);

      // documents 테이블에 삽입
      const docId = crypto.randomUUID();
      const fileName = path.basename(filePath);
      const format = parsed.format === 'xliff-2.0' ? 'xliff-2.0' : 'xliff';

      db.prepare(
        `INSERT INTO documents (id, project_id, name, format, file_path, seg_count)
         VALUES (?, ?, ?, ?, ?, ?)`,
      ).run(docId, payload.projectId, fileName, format, filePath, parsed.segments.length);

      // segments 테이블에 일괄 삽입
      segmentRepo.bulkInsert(
        docId,
        parsed.segments.map((s) => ({
          source: s.source,
          target: s.target,
          status: s.status,
          contextId: s.contextId,
          notes: s.notes,
        })),
      );

      return {
        id: docId,
        project_id: payload.projectId,
        name: fileName,
        format,
        file_path: filePath,
        seg_count: parsed.segments.length,
      };
    },
  );
}
