import { ipcMain, dialog, BrowserWindow } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type Database from 'better-sqlite3';
import { IPC_CHANNELS } from '../../shared/types/ipc';
import { detectAndParse } from '../parsers/index';
import { exportDocument, getExportExtension } from '../exporters/index';
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
            { name: 'Bilingual Files', extensions: ['xliff', 'xlf', 'po', 'tmx', 'mqxliff'] },
            { name: 'All Files', extensions: ['*'] },
          ],
          properties: ['openFile'],
        });
        if (result.canceled || result.filePaths.length === 0) return null;
        filePath = result.filePaths[0];
      }

      // 파서 레지스트리로 자동 감지 + 파싱
      const parsed = detectAndParse(filePath);

      // documents 테이블에 삽입
      const docId = crypto.randomUUID();
      const fileName = path.basename(filePath);
      const ext = path.extname(filePath).toLowerCase().replace('.', '');
      const format = ext === 'po' ? 'po' : ext === 'tmx' ? 'tmx' : parsed.format;

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

  ipcMain.handle(
    IPC_CHANNELS.DOCUMENT_EXPORT,
    async (_event, payload: { documentId: string; projectId: string }) => {
      // 문서 조회
      const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(payload.documentId) as
        | { name: string; format: string }
        | undefined;
      if (!doc) throw new Error('문서를 찾을 수 없습니다');

      // 프로젝트 조회 (언어 정보)
      const project = db
        .prepare('SELECT source_lang, target_lang FROM projects WHERE id = ?')
        .get(payload.projectId) as { source_lang: string; target_lang: string } | undefined;
      if (!project) throw new Error('프로젝트를 찾을 수 없습니다');

      // 세그먼트 조회
      const segments = segmentRepo.listByDocument(payload.documentId);

      // 저장 경로 선택
      const ext = getExportExtension(doc.format);
      const defaultName = doc.name.replace(/\.[^.]+$/, '') + '_translated' + ext;
      const win = BrowserWindow.getFocusedWindow();
      const result = await dialog.showSaveDialog(win!, {
        defaultPath: defaultName,
        filters: [{ name: 'Translated File', extensions: [ext.replace('.', '')] }],
      });
      if (result.canceled || !result.filePath) return null;

      // Export
      const content = exportDocument({
        segments,
        format: doc.format,
        sourceLang: project.source_lang,
        targetLang: project.target_lang,
        originalFile: doc.name,
      });

      fs.writeFileSync(result.filePath, content, 'utf-8');
      return { filePath: result.filePath };
    },
  );
}
