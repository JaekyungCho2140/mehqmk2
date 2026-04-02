import { XMLParser } from 'fast-xml-parser';
import fs from 'node:fs';
import type Database from 'better-sqlite3';
import crypto from 'node:crypto';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type XmlNode = any;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  preserveOrder: false,
  trimValues: false,
});

function getTextContent(node: unknown): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (node && typeof node === 'object' && '#text' in node)
    return String((node as Record<string, unknown>)['#text']);
  return '';
}

function ensureArray(val: XmlNode): XmlNode[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

export interface TmxImportResult {
  readonly imported: number;
  readonly skipped: number;
  readonly sourceLang: string;
  readonly targetLang: string;
}

export function importTmx(
  db: Database.Database,
  tmId: string,
  filePath: string,
): TmxImportResult {
  const content = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '');
  const data = parser.parse(content);

  const tmx = data['tmx'];
  if (!tmx) throw new Error('유효하지 않은 TMX 파일');

  const body = tmx['body'];
  const tus = ensureArray(body['tu']);

  let sourceLang = '';
  let targetLang = '';

  if (tus.length > 0) {
    const tuvs = ensureArray(tus[0]['tuv']);
    if (tuvs.length >= 2) {
      sourceLang = String(tuvs[0]['@_xml:lang'] ?? tuvs[0]['@_lang'] ?? '');
      targetLang = String(tuvs[1]['@_xml:lang'] ?? tuvs[1]['@_lang'] ?? '');
    }
  }

  const insertStmt = db.prepare(
    `INSERT OR REPLACE INTO translation_units
       (id, tm_id, source, target, created_by, modified_by)
     VALUES (?, ?, ?, ?, 'tmx-import', 'tmx-import')`,
  );

  let imported = 0;
  let skipped = 0;

  const runBatch = db.transaction(() => {
    for (const tu of tus) {
      const tuvs = ensureArray(tu['tuv']);

      let source = '';
      let target = '';

      for (const tuv of tuvs) {
        const lang = String(tuv['@_xml:lang'] ?? tuv['@_lang'] ?? '');
        const text = getTextContent(tuv['seg']);
        if (lang === sourceLang) source = text;
        else if (lang === targetLang) target = text;
      }

      if (!source && tuvs.length >= 1) source = getTextContent(tuvs[0]['seg']);
      if (!target && tuvs.length >= 2) target = getTextContent(tuvs[1]['seg']);

      if (!source.trim()) {
        skipped++;
        continue;
      }

      insertStmt.run(crypto.randomUUID(), tmId, source, target);
      imported++;
    }
  });

  runBatch();

  // Update entry_count
  db.prepare(
    `UPDATE translation_memories
     SET entry_count = (SELECT COUNT(*) FROM translation_units WHERE tm_id = ?),
         updated_at = datetime('now')
     WHERE id = ?`,
  ).run(tmId, tmId);

  return { imported, skipped, sourceLang, targetLang };
}
