import type { Segment } from '../../shared/types/segment';

function escapePo(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

export function exportPo(segments: Segment[], targetLang: string): string {
  const lines: string[] = [];

  // PO 헤더
  lines.push('msgid ""');
  lines.push('msgstr ""');
  lines.push(`"Content-Type: text/plain; charset=UTF-8\\n"`);
  lines.push(`"Language: ${targetLang}\\n"`);
  lines.push('');

  for (const seg of segments) {
    // fuzzy 플래그
    if (seg.status === 'edited') {
      lines.push('#, fuzzy');
    }

    lines.push(`msgid "${escapePo(seg.source)}"`);
    lines.push(`msgstr "${escapePo(seg.target)}"`);
    lines.push('');
  }

  return lines.join('\n');
}
