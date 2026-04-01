import fs from 'node:fs';
import type { ParseResult, ParsedSegment } from './types';

function unescapePo(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

function extractString(lines: string[], startIdx: number): { value: string; endIdx: number } {
  const parts: string[] = [];
  let i = startIdx;

  while (i < lines.length) {
    const line = lines[i].trim();
    const match = line.match(/^"(.*)"$/);
    if (match) {
      parts.push(unescapePo(match[1]));
      i++;
    } else {
      break;
    }
  }

  return { value: parts.join(''), endIdx: i };
}

export function parsePo(filePath: string): ParseResult {
  const content = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '');
  const lines = content.split('\n');

  const segments: ParsedSegment[] = [];
  let sourceLang = '';
  let targetLang = '';
  let currentNotes = '';
  let index = 1;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // 번역자 주석
    if (
      line.startsWith('#') &&
      !line.startsWith('#,') &&
      !line.startsWith('#.') &&
      !line.startsWith('#:') &&
      !line.startsWith('#|')
    ) {
      currentNotes = line.slice(1).trim();
      i++;
      continue;
    }

    // 헤더에서 언어 감지
    if (line.startsWith('"Language:')) {
      const match = line.match(/"Language:\s*(\w+)/);
      if (match) targetLang = match[1];
    }

    // msgid
    if (line.startsWith('msgid ')) {
      const msgidMatch = line.match(/^msgid\s+"(.*)"$/);
      if (!msgidMatch) {
        i++;
        continue;
      }

      let source = unescapePo(msgidMatch[1]);
      i++;

      // 연속 문자열
      const cont = extractString(lines, i);
      source += cont.value;
      i = cont.endIdx;

      // msgid가 비어있으면 헤더 — 건너뜀
      if (!source) {
        while (i < lines.length && lines[i].trim() !== '') i++;
        continue;
      }

      // msgid_plural 체크
      let plural = '';
      if (i < lines.length && lines[i].trim().startsWith('msgid_plural ')) {
        const pluralMatch = lines[i].trim().match(/^msgid_plural\s+"(.*)"$/);
        if (pluralMatch) plural = unescapePo(pluralMatch[1]);
        i++;
        const pluralCont = extractString(lines, i);
        plural += pluralCont.value;
        i = pluralCont.endIdx;
      }

      // msgstr (단수)
      if (i < lines.length && lines[i].trim().startsWith('msgstr ')) {
        const msgstrMatch = lines[i].trim().match(/^msgstr\s+"(.*)"$/);
        const target = msgstrMatch ? unescapePo(msgstrMatch[1]) : '';
        i++;
        const targetCont = extractString(lines, i);
        const fullTarget = target + targetCont.value;
        i = targetCont.endIdx;

        segments.push({
          index: index++,
          source,
          target: fullTarget,
          notes: currentNotes || undefined,
          status: fullTarget.trim() ? 'pre-translated' : 'not-started',
        });
      }

      // msgstr[0], msgstr[1] (복수형)
      while (i < lines.length && lines[i].trim().match(/^msgstr\[\d+\]/)) {
        const pluralMsgMatch = lines[i].trim().match(/^msgstr\[\d+\]\s+"(.*)"$/);
        const target = pluralMsgMatch ? unescapePo(pluralMsgMatch[1]) : '';
        i++;
        const targetCont = extractString(lines, i);
        const fullTarget = target + targetCont.value;
        i = targetCont.endIdx;

        const segSource = segments.length === index - 1 ? source : plural || source;
        segments.push({
          index: index++,
          source: segSource,
          target: fullTarget,
          notes: currentNotes || undefined,
          status: fullTarget.trim() ? 'pre-translated' : 'not-started',
        });
      }

      currentNotes = '';
      continue;
    }

    i++;
  }

  return {
    format: 'xliff-1.2', // PO는 자체 포맷이지만 ParseResult 호환
    sourceLanguage: sourceLang || 'en',
    targetLanguage: targetLang || '',
    segments,
  };
}
