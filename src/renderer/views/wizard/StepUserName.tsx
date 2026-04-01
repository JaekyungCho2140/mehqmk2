import { TextInput } from '../../components/TextInput';

interface StepUserNameProps {
  readonly userName: string;
  readonly onUserNameChange: (name: string) => void;
  readonly error: string;
}

export function StepUserName({
  userName,
  onUserNameChange,
  error,
}: StepUserNameProps): React.ReactElement {
  return (
    <div className="step-content">
      <h2 className="step-title">Welcome to mehQ</h2>
      <p className="step-subtitle">
        번역 작업을 시작하기 전에 기본 설정을 완료해주세요.
      </p>
      <div className="step-body">
        <TextInput
          label="사용자 이름"
          value={userName}
          onChange={(e) => onUserNameChange(e.target.value)}
          placeholder="이름을 입력하세요"
          maxLength={100}
          error={error}
          hint="이 이름은 번역 메모리와 변경 이력에 기록됩니다."
          autoFocus
        />
      </div>
    </div>
  );
}
