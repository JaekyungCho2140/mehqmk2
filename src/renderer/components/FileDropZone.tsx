import { useState, useCallback, useRef } from 'react';

const SUPPORTED_EXTENSIONS = ['.xliff', '.xlf', '.po', '.tmx', '.mqxliff'];

interface FileEntry {
  readonly path: string;
  readonly name: string;
  readonly format: string;
  readonly size: number;
  readonly supported: boolean;
}

interface FileDropZoneProps {
  readonly files: FileEntry[];
  readonly onFilesAdd: (files: FileEntry[]) => void;
  readonly onFileRemove: (index: number) => void;
  readonly onRemoveAll: () => void;
  readonly onBrowse: () => void;
}

function getFormat(name: string): { format: string; supported: boolean } {
  const ext = name.substring(name.lastIndexOf('.')).toLowerCase();
  const supported = SUPPORTED_EXTENSIONS.includes(ext);
  const formatMap: Record<string, string> = {
    '.xliff': 'XLIFF',
    '.xlf': 'XLIFF',
    '.po': 'PO Gettext',
    '.tmx': 'TMX',
    '.mqxliff': 'mehQ XLIFF',
  };
  return { format: formatMap[ext] ?? ext.toUpperCase().replace('.', ''), supported };
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export type { FileEntry };
export { getFormat };

export function FileDropZone({
  files,
  onFilesAdd,
  onFileRemove,
  onRemoveAll,
  onBrowse,
}: FileDropZoneProps): React.ReactElement {
  const [dragOver, setDragOver] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);

      const droppedFiles = Array.from(e.dataTransfer.files).map((f) => {
        const { format, supported } = getFormat(f.name);
        // Electron extends File with .path
        const filePath = (f as File & { path: string }).path;
        return {
          path: filePath,
          name: f.name,
          format,
          size: f.size,
          supported,
        };
      });
      onFilesAdd(droppedFiles);
    },
    [onFilesAdd],
  );

  return (
    <div className="file-drop-zone-wrapper">
      <div
        ref={dropRef}
        className={`file-drop-zone ${dragOver ? 'file-drop-zone--active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={onBrowse}
        data-testid="file-drop-zone"
      >
        {files.length === 0 ? (
          <p className="file-drop-zone-text">파일을 드래그하거나 클릭하여 추가</p>
        ) : (
          <div className="file-drop-list">
            {files.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className={`file-drop-item ${!file.supported ? 'file-drop-item--unsupported' : ''}`}
              >
                <span className="file-drop-item-name">{file.name}</span>
                <span className="file-drop-item-format">{file.format}</span>
                <span className="file-drop-item-size">{formatSize(file.size)}</span>
                {!file.supported && <span className="file-drop-item-warn">미지원</span>}
                <button
                  className="file-drop-item-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileRemove(i);
                  }}
                  data-testid="file-remove-btn"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="file-drop-actions">
        <button className="btn-secondary-full" onClick={onBrowse} data-testid="file-browse-btn">
          Import Files...
        </button>
        {files.length > 0 && (
          <button className="btn-text-danger" onClick={onRemoveAll}>
            Remove All
          </button>
        )}
      </div>
    </div>
  );
}
