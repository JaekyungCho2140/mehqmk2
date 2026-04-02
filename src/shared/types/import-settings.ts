export interface ImportSettings {
  readonly filter: 'auto' | 'xliff' | 'po' | 'tmx' | 'mqxliff';
  readonly encoding: 'utf-8' | 'utf-16' | 'iso-8859-1';
  readonly inlineTags: 'preserve' | 'remove';
  readonly emptyTarget: 'empty' | 'copy-source';
}

export const DEFAULT_IMPORT_SETTINGS: ImportSettings = {
  filter: 'auto',
  encoding: 'utf-8',
  inlineTags: 'preserve',
  emptyTarget: 'empty',
};
