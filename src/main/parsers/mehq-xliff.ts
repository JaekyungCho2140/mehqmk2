import { parseXliff } from './xliff';
import type { ParseResult } from './types';

/**
 * mehQ XLIFF (.mqxliff) 파서
 * 표준 XLIFF에 mehQ 확장 메타데이터를 추가한 형식.
 * 현재는 표준 XLIFF 파서로 위임, 향후 mehQ 전용 속성 처리 추가.
 */
export function parseMehqXliff(filePath: string): ParseResult {
  return parseXliff(filePath);
}
