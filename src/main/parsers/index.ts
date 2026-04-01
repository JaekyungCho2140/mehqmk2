import path from 'node:path';
import type { ParseResult } from './types';
import { parseXliff } from './xliff';
import { parsePo } from './po';
import { parseTmx } from './tmx';
import { parseMehqXliff } from './mehq-xliff';

const PARSER_MAP: Record<string, (filePath: string) => ParseResult> = {
  '.xliff': parseXliff,
  '.xlf': parseXliff,
  '.po': parsePo,
  '.tmx': parseTmx,
  '.mqxliff': parseMehqXliff,
};

export function detectAndParse(filePath: string): ParseResult {
  const ext = path.extname(filePath).toLowerCase();
  const parser = PARSER_MAP[ext];
  if (!parser) throw new Error(`지원하지 않는 형식: ${ext}`);
  return parser(filePath);
}

export function getSupportedExtensions(): string[] {
  return Object.keys(PARSER_MAP);
}

export { type ParseResult } from './types';
