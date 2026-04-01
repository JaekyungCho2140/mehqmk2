import { XMLParser } from 'fast-xml-parser';
import fs from 'node:fs';
import type { ParseResult, ParsedSegment } from './types';
import type { SegmentStatus } from '../../shared/types/segment';

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

function determineStatus(target: string): SegmentStatus {
  return target.trim() ? 'pre-translated' : 'not-started';
}

function ensureArray(val: XmlNode): XmlNode[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

function parseXliff12(data: XmlNode): ParseResult {
  const xliff = data['xliff'];
  const files = ensureArray(xliff['file']);
  const file = files[0];
  if (!file) throw new Error('XLIFF 1.2: <file> 요소 없음');

  const sourceLang = String(file['@_source-language'] ?? '');
  const targetLang = String(file['@_target-language'] ?? '');
  const originalFile = String(file['@_original'] ?? '');

  const body = file['body'];
  const units = ensureArray(body['trans-unit']);

  const segments: ParsedSegment[] = units.map((unit: XmlNode, i: number) => {
    const source = getTextContent(unit['source']);
    const target = getTextContent(unit['target']);
    const note = unit['note'] ? getTextContent(unit['note']) : undefined;
    const contextId = String(unit['@_id'] ?? unit['@_resname'] ?? '');

    return {
      index: i + 1,
      source,
      target,
      contextId: contextId || undefined,
      notes: note,
      status: determineStatus(target),
    };
  });

  return {
    format: 'xliff-1.2',
    sourceLanguage: sourceLang,
    targetLanguage: targetLang,
    segments,
    originalFileName: originalFile || undefined,
  };
}

function parseXliff20(data: XmlNode): ParseResult {
  const xliff = data['xliff'];
  const sourceLang = String(xliff['@_srcLang'] ?? '');
  const targetLang = String(xliff['@_trgLang'] ?? '');

  const files = ensureArray(xliff['file']);
  const file = files[0];
  if (!file) throw new Error('XLIFF 2.0: <file> 요소 없음');

  const originalFile = String(file['@_original'] ?? '');
  const units = ensureArray(file['unit']);

  const segments: ParsedSegment[] = units.map((unit: XmlNode, i: number) => {
    const segmentNode = unit['segment'];
    const source = segmentNode ? getTextContent(segmentNode['source']) : '';
    const target = segmentNode ? getTextContent(segmentNode['target']) : '';
    const contextId = String(unit['@_id'] ?? '');

    return {
      index: i + 1,
      source,
      target,
      contextId: contextId || undefined,
      status: determineStatus(target),
    };
  });

  return {
    format: 'xliff-2.0',
    sourceLanguage: sourceLang,
    targetLanguage: targetLang,
    segments,
    originalFileName: originalFile || undefined,
  };
}

export function parseXliff(filePath: string): ParseResult {
  const content = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, ''); // BOM 제거
  const data = parser.parse(content);

  const xliff = data['xliff'];
  if (!xliff) throw new Error('유효하지 않은 XLIFF 파일');

  const version = String(xliff['@_version'] ?? '');

  if (version.startsWith('2')) {
    return parseXliff20(data);
  }
  return parseXliff12(data);
}
