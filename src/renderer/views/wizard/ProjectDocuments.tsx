import { useState, useCallback } from 'react';
import { FileDropZone, type FileEntry } from '../../components/FileDropZone';
import { ImportSettingsDialog } from '../../components/ImportSettingsDialog';
import type { ImportSettings } from '../../../shared/types/import-settings';

interface ProjectDocumentsProps {
  readonly files: FileEntry[];
  readonly onFilesChange: (files: FileEntry[]) => void;
  readonly importSettings?: ImportSettings;
  readonly onImportSettingsChange?: (settings: ImportSettings) => void;
}

export function ProjectDocuments({
  files,
  onFilesChange,
  onImportSettingsChange,
}: ProjectDocumentsProps): React.ReactElement {
  const [showSettings, setShowSettings] = useState(false);

  const handleFilesAdd = useCallback(
    (newFiles: FileEntry[]) => {
      onFilesChange([...files, ...newFiles]);
    },
    [files, onFilesChange],
  );

  const handleFileRemove = useCallback(
    (index: number) => {
      onFilesChange(files.filter((_, i) => i !== index));
    },
    [files, onFilesChange],
  );

  const handleRemoveAll = useCallback(() => {
    onFilesChange([]);
  }, [onFilesChange]);

  const handleBrowse = useCallback(() => {
    // 현재는 드래그앤드롭만 지원
  }, []);

  const handleSettingsConfirm = useCallback(
    (settings: ImportSettings) => {
      onImportSettingsChange?.(settings);
      setShowSettings(false);
    },
    [onImportSettingsChange],
  );

  return (
    <div className="step-content">
      <h2 className="step-title">Documents</h2>
      <p className="step-subtitle">번역할 문서를 추가하세요. XLIFF, PO, TMX 형식을 지원합니다.</p>
      <div className="step-body">
        <FileDropZone
          files={files}
          onFilesAdd={handleFilesAdd}
          onFileRemove={handleFileRemove}
          onRemoveAll={handleRemoveAll}
          onBrowse={handleBrowse}
        />
        {files.length > 0 && (
          <button
            className="btn-secondary-full"
            style={{ marginTop: 'var(--spacing-sm)', width: 'auto' }}
            onClick={() => setShowSettings(true)}
            data-testid="import-with-options-btn"
          >
            Import with options...
          </button>
        )}
      </div>

      {showSettings && (
        <ImportSettingsDialog
          onConfirm={handleSettingsConfirm}
          onCancel={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
