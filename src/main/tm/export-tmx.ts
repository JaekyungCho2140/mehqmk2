import fs from 'node:fs';
import type Database from 'better-sqlite3';

interface TuRow {
  source: string;
  target: string;
  created_by: string;
  modified_at: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function exportTmx(
  db: Database.Database,
  tmId: string,
  outputPath: string,
): { exported: number } {
  const tm = db
    .prepare('SELECT * FROM translation_memories WHERE id = ?')
    .get(tmId) as { source_lang: string; target_lang: string; name: string } | undefined;

  if (!tm) throw new Error('TM을 찾을 수 없습니다');

  const entries = db
    .prepare('SELECT source, target, created_by, modified_at FROM translation_units WHERE tm_id = ?')
    .all(tmId) as TuRow[];

  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<tmx version="1.4">',
    '  <header',
    `    creationtool="mehQ"`,
    `    creationtoolversion="0.1.0"`,
    `    segtype="sentence"`,
    `    o-tmf="mehQ"`,
    `    adminlang="en"`,
    `    srclang="${escapeXml(tm.source_lang)}"`,
    `    datatype="plaintext">`,
    '  </header>',
    '  <body>',
  ];

  for (const entry of entries) {
    lines.push('    <tu>');
    lines.push(`      <tuv xml:lang="${escapeXml(tm.source_lang)}">`);
    lines.push(`        <seg>${escapeXml(entry.source)}</seg>`);
    lines.push('      </tuv>');
    lines.push(`      <tuv xml:lang="${escapeXml(tm.target_lang)}">`);
    lines.push(`        <seg>${escapeXml(entry.target)}</seg>`);
    lines.push('      </tuv>');
    lines.push('    </tu>');
  }

  lines.push('  </body>');
  lines.push('</tmx>');
  lines.push('');

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');

  return { exported: entries.length };
}
