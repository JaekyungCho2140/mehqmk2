import type { Segment } from '../../shared/types/segment';
import { exportXliff12, exportXliff20 } from './xliff';
import { exportPo } from './po';

interface ExportOptions {
  readonly segments: Segment[];
  readonly format: string;
  readonly sourceLang: string;
  readonly targetLang: string;
  readonly originalFile: string;
}

export function exportDocument(options: ExportOptions): string {
  const { segments, format, sourceLang, targetLang, originalFile } = options;

  switch (format) {
    case 'xliff-2.0':
      return exportXliff20(segments, sourceLang, targetLang, originalFile);
    case 'po':
      return exportPo(segments, targetLang);
    case 'xliff':
    case 'xliff-1.2':
    default:
      return exportXliff12(segments, sourceLang, targetLang, originalFile);
  }
}

export function getExportExtension(format: string): string {
  switch (format) {
    case 'po':
      return '.po';
    case 'tmx':
      return '.tmx';
    default:
      return '.xliff';
  }
}
