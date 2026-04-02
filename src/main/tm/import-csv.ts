import fs from 'node:fs';
import type Database from 'better-sqlite3';
import crypto from 'node:crypto';

export interface CsvImportResult {
  readonly imported: number;
  readonly skipped: number;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export function importCsv(
  db: Database.Database,
  tmId: string,
  filePath: string,
): CsvImportResult {
  const content = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '');
  const lines = content.split(/\r?\n/).filter((l) => l.trim());

  if (lines.length === 0) throw new Error('빈 CSV 파일');

  // Detect header
  const firstLine = parseCsvLine(lines[0]);
  const hasHeader =
    firstLine.length >= 2 &&
    (firstLine[0].toLowerCase() === 'source' || firstLine[0].toLowerCase() === 'src');
  const startIdx = hasHeader ? 1 : 0;

  const insertStmt = db.prepare(
    `INSERT OR REPLACE INTO translation_units
       (id, tm_id, source, target, created_by, modified_by)
     VALUES (?, ?, ?, ?, 'csv-import', 'csv-import')`,
  );

  let imported = 0;
  let skipped = 0;

  const runBatch = db.transaction(() => {
    for (let i = startIdx; i < lines.length; i++) {
      const fields = parseCsvLine(lines[i]);
      const source = fields[0] ?? '';
      const target = fields[1] ?? '';

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

  return { imported, skipped };
}
