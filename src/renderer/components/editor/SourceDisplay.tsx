interface SourceDisplayProps {
  readonly html: string;
}

export function SourceDisplay({ html }: SourceDisplayProps): React.ReactElement {
  return (
    <div
      className="source-display"
      data-testid="edit-panel-source"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
