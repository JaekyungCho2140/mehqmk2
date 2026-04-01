interface StepWorkDirProps {
  readonly workDirectory: string;
  readonly onBrowse: () => void;
  readonly error: string;
}

export function StepWorkDir({
  workDirectory,
  onBrowse,
  error,
}: StepWorkDirProps): React.ReactElement {
  return (
    <div className="step-content">
      <h2 className="step-title">작업 디렉토리</h2>
      <p className="step-subtitle">프로젝트가 저장될 기본 폴더를 선택하세요.</p>
      <div className="step-body">
        <div className="text-input-wrapper">
          <label className="text-input-label">폴더 경로</label>
          <div className="browse-row">
            <input
              className={`text-input browse-path ${error ? 'text-input--error' : ''}`}
              value={workDirectory}
              readOnly
              placeholder="폴더를 선택하세요"
              data-testid="step-workdir-path"
            />
            <button
              type="button"
              className="btn--browse"
              onClick={onBrowse}
              data-testid="step-workdir-browse-btn"
            >
              Browse...
            </button>
          </div>
          {error && <span className="text-input-error">{error}</span>}
        </div>
      </div>
    </div>
  );
}
