# Sprint 1-3: Welcome Wizard UI

## Scope

앱 최초 실행 시 표시되는 3단계 Welcome Wizard를 구현한다. 사용자 이름, 작업 디렉토리, UI 언어를 수집하여 SQLite에 저장하고, 완료 후 Dashboard 뷰로 전환한다. 최초 실행 감지 로직도 포함.

### 생성/수정할 파일

```
src/renderer/App.tsx                       # (수정) 라우팅: wizard_completed 여부에 따라 Wizard/Dashboard 분기
src/renderer/views/WelcomeWizard.tsx        # Wizard 메인 컨테이너 (3단계 스텝퍼)
src/renderer/views/wizard/StepUserName.tsx  # Step 1: 사용자 이름 입력
src/renderer/views/wizard/StepWorkDir.tsx   # Step 2: 작업 디렉토리 선택
src/renderer/views/wizard/StepLanguage.tsx  # Step 3: UI 언어 선택
src/renderer/views/Dashboard.tsx            # 빈 Dashboard 셸 (Phase 2에서 확장)
src/renderer/components/Button.tsx          # 재사용 버튼 컴포넌트
src/renderer/components/TextInput.tsx       # 재사용 텍스트 입력 컴포넌트
src/renderer/hooks/useSettings.ts           # settings IPC 래퍼 훅
src/renderer/styles/wizard.css              # Wizard 전용 스타일
src/renderer/styles/components.css          # 공통 컴포넌트 스타일
```

## Technical Prerequisites (Planner 확인)

- [x] Sprint 1-2의 IPC 레이어(settings:get-all, settings:set-bulk, dialog:select-directory) 사용
- [x] React 상태 관리: useState로 충분 (전역 상태 라이브러리 불필요)
- [x] 라우팅: react-router 불필요 — 조건부 렌더링으로 Wizard/Dashboard 전환

## 핵심 데이터 모델

Sprint 1-2에서 정의한 `UserSettings` 재사용. 추가 모델 없음.

Wizard 로컬 상태:

```typescript
interface WizardState {
  currentStep: 1 | 2 | 3;
  userName: string;        // Step 1에서 수집
  workDirectory: string;   // Step 2에서 수집
  uiLanguage: string;      // Step 3에서 수집
}
```

## 주요 동작 흐름

### 1. 앱 시작 → Wizard/Dashboard 분기

```
입력: 앱 시작, renderer 마운트
과정:
  1. App.tsx에서 window.electronAPI.settings.getAll() 호출
  2. wizard_completed 값 확인
출력:
  - wizard_completed === false → WelcomeWizard 렌더링
  - wizard_completed === true → Dashboard 렌더링
로딩 중: 빈 화면 + 스피너 (깜빡임 방지)
```

### 2. Step 1: 사용자 이름 입력

```
입력: 사용자가 텍스트 필드에 이름 입력
검증:
  - 빈 문자열 → "이름을 입력해주세요" 에러 메시지 (빨간색)
  - trim() 적용, 앞뒤 공백 제거
  - 최대 100자 제한
출력: "Next" 버튼 활성화 → Step 2로 이동
```

### 3. Step 2: 작업 디렉토리 선택

```
입력: 경로 표시 필드 + "Browse..." 버튼
기본값: os.homedir() + '/Documents/mehQ' (main에서 계산하여 settings 기본값으로)
과정:
  - "Browse..." 클릭 → window.electronAPI.dialog.selectDirectory() 호출
  - 다이얼로그에서 폴더 선택 → 경로 갱신
  - 취소 → 기존 경로 유지
검증:
  - 경로가 빈 문자열이면 "작업 디렉토리를 선택해주세요" 에러
출력: "Next" 버튼 → Step 3으로 이동
"Back" 버튼 → Step 1로 이동
```

### 4. Step 3: UI 언어 선택

```
입력: 라디오 버튼 또는 드롭다운 목록
옵션:
  - English (en) ← 기본 선택
  - 한국어 (ko)
  - 日本語 (ja)
  - 中文 (zh)
검증: 항상 하나가 선택되어 있으므로 검증 불필요
출력:
  "Finish" 버튼 클릭 시:
    1. settings.setBulk({ user_name, work_directory, ui_language, wizard_completed: true }) 호출
    2. 저장 성공 → Dashboard 뷰로 전환
    3. 저장 실패 → 에러 토스트 표시
"Back" 버튼 → Step 2로 이동
```

### 5. Edge Cases

```
- 앱 강제 종료 후 재시작 (Wizard 미완료): wizard_completed=false → Wizard 다시 표시
- Wizard 도중 창 닫기: 저장 없이 종료. 다음 실행 시 Wizard 처음부터
- 이미 Wizard 완료 후 재실행: Dashboard 바로 표시
- 작업 디렉토리가 존재하지 않는 경로: 경고 없이 저장 (실제 프로젝트 생성 시 mkdir)
```

## 시각적 스펙

### Wizard 컨테이너

```
레이아웃: 수직 중앙 정렬, 수평 중앙 정렬
카드 크기: width 480px, min-height 400px
카드 배경: var(--color-bg-primary)
카드 그림자: 0 4px 24px rgba(0, 0, 0, 0.12)
카드 border-radius: 12px
카드 padding: var(--spacing-xl) (32px)
```

### 스텝 인디케이터

```
위치: 카드 상단
형태: 3개의 원형 스텝 (1 — 2 — 3), 점선 연결
활성 스텝 원: background var(--color-accent-primary, #2563eb), 색상 #ffffff, 24x24px
비활성 스텝 원: background var(--color-bg-tertiary, #e8e8e8), 색상 var(--color-text-muted), 24x24px
완료 스텝 원: background var(--color-accent-primary), 체크마크 아이콘
연결선: 1px solid var(--color-border-default)
```

### Step 1 레이아웃

```
제목: "Welcome to mehQ" (font-size: 20px, font-weight: 600, color: var(--color-text-primary))
부제목: "번역 작업을 시작하기 전에 기본 설정을 완료해주세요." (font-size: var(--font-size-base), color: var(--color-text-secondary))
간격: 제목 아래 var(--spacing-sm), 부제목 아래 var(--spacing-lg)
라벨: "사용자 이름" (font-size: var(--font-size-sm), font-weight: 500)
입력 필드: width 100%, height 40px, border 1px solid var(--color-border-default), border-radius 6px, padding 0 12px
  - focus: border-color var(--color-border-focus), box-shadow 0 0 0 2px rgba(37,99,235,0.15)
  - 에러: border-color #ef4444, 에러 텍스트 color #ef4444 font-size var(--font-size-sm)
도움말: "이 이름은 번역 메모리와 변경 이력에 기록됩니다." (color: var(--color-text-muted), font-size: var(--font-size-sm))
```

### Step 2 레이아웃

```
제목: "작업 디렉토리" (20px, 600)
부제목: "프로젝트가 저장될 기본 폴더를 선택하세요."
경로 표시: readonly 텍스트 필드 (width calc(100% - 100px)) + "Browse..." 버튼 (width 88px, margin-left 12px)
  - 경로 텍스트: overflow ellipsis, direction rtl (끝부분 표시)
Browse 버튼: background var(--color-bg-secondary), border 1px solid var(--color-border-default), height 40px, border-radius 6px
  - hover: background var(--color-bg-tertiary)
```

### Step 3 레이아웃

```
제목: "인터페이스 언어" (20px, 600)
부제목: "mehQ의 UI 언어를 선택하세요."
옵션 목록: 수직 라디오 버튼, 각 항목 height 44px, padding-left 12px
  - 라디오 원: 16x16px, border 2px solid var(--color-border-default)
  - 선택 시: border-color var(--color-accent-primary), 내부 원 8px var(--color-accent-primary)
  - 라벨: margin-left 10px, font-size var(--font-size-base)
```

### 하단 버튼 영역

```
위치: 카드 하단, border-top 1px solid var(--color-border-default), padding-top var(--spacing-md)
Back 버튼 (Step 2, 3): 좌측 정렬, background transparent, color var(--color-text-secondary), border none
  - hover: color var(--color-text-primary)
Next/Finish 버튼: 우측 정렬, background var(--color-accent-primary), color #ffffff, height 40px, min-width 100px, border-radius 6px, font-weight 500
  - hover: background var(--color-accent-hover)
  - disabled (이름 미입력): opacity 0.5, cursor not-allowed
Step 1: "Next" 만 표시
Step 2: "Back" + "Next"
Step 3: "Back" + "Finish"
```

### Dashboard 셸 (빈 상태)

```
전체 화면 레이아웃
상단: "mehQ Dashboard" 텍스트 (24px, 600, 좌측 정렬, padding var(--spacing-lg))
중앙: "프로젝트가 없습니다. 새 프로젝트를 생성하세요." 텍스트 (중앙 정렬, color var(--color-text-muted))
하단 우측: "+ New Project" 버튼 (비활성, Phase 2에서 기능 연결)
```

## Acceptance Criteria

- [ ] 최초 실행 시 (wizard_completed=false) Welcome Wizard 표시
- [ ] Step 1: 이름 입력 필수, 빈 문자열 시 에러 메시지, "Next" 비활성
- [ ] Step 2: 기본 경로 표시, "Browse..." 클릭 시 OS 폴더 선택 다이얼로그 열림
- [ ] Step 3: 4개 언어 옵션, 기본 "English" 선택
- [ ] "Finish" 클릭 시 설정이 SQLite에 저장되고 Dashboard로 전환
- [ ] 앱 재시작 시 Dashboard 바로 표시 (Wizard 스킵)
- [ ] 스텝 인디케이터가 현재 단계를 올바르게 표시
- [ ] Back 버튼으로 이전 단계 이동 시 입력값 유지
- [ ] 모든 색상/크기가 CSS 변수 사용

## QA Checklist

- [ ] 최초 실행 → Wizard 표시 (Step 1부터)
- [ ] 이름 비워둔 채 Next → 에러 메시지 표시, 진행 불가
- [ ] 이름 입력 → Next → Step 2 표시, 기본 경로 있음
- [ ] Browse → 폴더 선택 → 경로 갱신
- [ ] Browse → 취소 → 기존 경로 유지
- [ ] Step 2 → Next → Step 3, 언어 4개 옵션 표시
- [ ] Back → Step 2, 입력값 유지
- [ ] Finish → Dashboard 전환
- [ ] 앱 종료 → 재시작 → Dashboard 바로 표시
- [ ] Wizard 중간에 앱 종료 → 재시작 → Wizard 처음부터

## Regression Checklist

- [ ] Sprint 1-1: 창 열림, 제목 "mehQ", 크기 제한, React HMR
- [ ] Sprint 1-2: DB 파일 생성, settings IPC 동작, selectDirectory 다이얼로그

## Known Gaps (memoQ 대비)

- memoQ에는 Welcome Wizard 없음 (mehQ 고유 기능)
- UI 언어 변경의 즉시 반영은 Phase 13에서 구현 (현재는 저장만)
- 실제 i18n 시스템 (번역 파일)은 Phase 13에서 구축

## Verification Questions (Generator가 구현 전에 확인)

- [ ] Sprint 1-2의 IPC API(settings:get-all, settings:set-bulk, dialog:select-directory)가 정상 동작하는가?
- [ ] `os.homedir()` 값을 renderer에서 가져올 방법: 별도 IPC 필요한가, 아니면 settings 기본값으로 main에서 미리 설정하는가?

## Dependencies

- Sprint 1-2 완료 필수 (SQLite + IPC)

## Out of Scope

- 실제 i18n 번역 파일 시스템 (Phase 13)
- Options에서 설정 변경 UI (Phase 13)
- Dashboard 프로젝트 목록 (Phase 2)
- New Project Wizard (Phase 2)
