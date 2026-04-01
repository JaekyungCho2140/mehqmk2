import { useCallback } from 'react';
import { FileDropZone, type FileEntry } from '../../components/FileDropZone';

interface ProjectDocumentsProps {
  readonly files: FileEntry[];
  readonly onFilesChange: (files: FileEntry[]) => void;
}

export function ProjectDocuments({
  files,
  onFilesChange,
}: ProjectDocumentsProps): React.ReactElement {
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
    // 현재는 드래그앤드롭만 지원, Browse는 향후 IPC 확장
  }, []);

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
      </div>
    </div>
  );
}
