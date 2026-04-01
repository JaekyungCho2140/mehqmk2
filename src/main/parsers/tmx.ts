import { XMLParser } from 'fast-xml-parser';
import fs from 'node:fs';
import type { ParseResult, ParsedSegment } from './types';

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

export function parseTmx(filePath: string): ParseResult {
  const content = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '');
  const data = parser.parse(content);

  const tmx = data['tmx'];
  if (!tmx) throw new Error('유효하지 않은 TMX 파일');

  const body = tmx['body'];
  const tus = ensureArray(body['tu']);

  // 첫 TU에서 언어 감지
  let sourceLang = '';
  let targetLang = '';

  if (tus.length > 0) {
    const tuvs = ensureArray(tus[0]['tuv']);
    if (tuvs.length >= 2) {
      sourceLang = String(tuvs[0]['@_xml:lang'] ?? tuvs[0]['@_lang'] ?? '');
      targetLang = String(tuvs[1]['@_xml:lang'] ?? tuvs[1]['@_lang'] ?? '');
    }
  }

  const segments: ParsedSegment[] = tus.map((tu: XmlNode, i: number) => {
    const tuvs = ensureArray(tu['tuv']);

    let source = '';
    let target = '';

    for (const tuv of tuvs) {
      const lang = String(tuv['@_xml:lang'] ?? tuv['@_lang'] ?? '');
      const seg = tuv['seg'];
      const text = getTextContent(seg);

      if (lang === sourceLang) {
        source = text;
      } else if (lang === targetLang) {
        target = text;
      }
    }

    // 언어 매칭 실패 시 순서로 대체
    if (!source && tuvs.length >= 1) {
      source = getTextContent(tuvs[0]['seg']);
    }
    if (!target && tuvs.length >= 2) {
      target = getTextContent(tuvs[1]['seg']);
    }

    return {
      index: i + 1,
      source,
      target,
      status: target.trim() ? 'pre-translated' : 'not-started',
    };
  });

  return {
    format: 'xliff-1.2',
    sourceLanguage: sourceLang,
    targetLanguage: targetLang,
    segments,
  };
}
