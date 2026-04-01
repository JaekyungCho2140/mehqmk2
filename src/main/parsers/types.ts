import type { SegmentStatus } from '../../shared/types/segment';

export interface ParsedSegment {
  readonly index: number;
  readonly source: string;
  readonly target: string;
  readonly contextId?: string;
  readonly notes?: string;
  readonly status: SegmentStatus;
}

export interface ParseResult {
  readonly format: 'xliff-1.2' | 'xliff-2.0';
  readonly sourceLanguage: string;
  readonly targetLanguage: string;
  readonly segments: ParsedSegment[];
  readonly originalFileName?: string;
}
