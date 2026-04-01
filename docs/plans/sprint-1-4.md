# Sprint 1-4: Playwright E2E + ESLint/Prettier + Dashboard 셸 보완

## Scope

Playwright Electron E2E 테스트 인프라를 구축하고, ESLint + Prettier 코드 품질 도구를 설정하며, Sprint 1-1~1-3의 통합 E2E 테스트를 작성한다. Dashboard 셸의 기본 레이아웃도 보완한다.

### 생성/수정할 파일

```
playwright.config.ts                        # Playwright 설정 (Electron용)
tests/e2e/helpers/electron.ts               # Electron 앱 launch/close 헬퍼
tests/e2e/helpers/selectors.ts              # data-testid 기반 셀렉터 상수
tests/e2e/app-launch.spec.ts               # 앱 시작 테스트
tests/e2e/welcome-wizard.spec.ts           # Welcome Wizard 전체 플로우 테스트
tests/e2e/settings-persistence.spec.ts     # 설정 영속성 테스트
tests/fixtures/                             # 테스트 픽스처 디렉토리 (빈)
.eslintrc.cjs                               # ESLint 설정
.prettierrc                                 # Prettier 설정
.prettierignore                             # Prettier 무시 목록
package.json                                # (수정) scripts + devDependencies 추가
src/renderer/views/Dashboard.tsx            # (수정) 기본 레이아웃 보완
src/renderer/views/WelcomeWizard.tsx        # (수정) data-testid 속성 추가
src/renderer/views/wizard/StepUserName.tsx  # (수정) data-testid 추가
src/renderer/views/wizard/StepWorkDir.tsx   # (수정) data-testid 추가
src/renderer/views/wizard/StepLanguage.tsx  # (수정) data-testid 추가
src/renderer/components/Button.tsx          # (수정) data-testid 추가
src/renderer/components/TextInput.tsx       # (수정) data-testid 추가
```

## Technical Prerequisites (Planner 확인)

- [x] Playwright는 `_electron.launch()`로 Electron 앱 직접 테스트 가능
- [x] Electron E2E에서는 브라우저 설치 불필요 (Electron 자체가 Chromium)
- [x] `@playwright/test` 패키지로 충분 (별도 Electron 플러그인 불필요)
- [x] ESLint v9 flat config 또는 v8 .eslintrc 패턴 모두 가능

## 핵심 데이터 모델

추가 데이터 모델 없음.

### data-testid 규칙

```
명명 규칙: {컴포넌트}-{요소}
예시:
  wizard-container
  wizard-step-indicator
  wizard-step-1, wizard-step-2, wizard-step-3
  wizard-title
  wizard-subtitle
  step-username-input
  step-username-error
  step-workdir-path
  step-workdir-browse-btn
  step-language-radio-en, step-language-radio-ko, ...
  wizard-back-btn
  wizard-next-btn
  wizard-finish-btn
  dashboard-container
  dashboard-title
  dashboard-empty-message
  dashboard-new-project-btn
```

## 주요 동작 흐름

### 1. Playwright Electron 테스트 실행

```
입력: `npm run test:e2e`
과정:
  1. Playwright가 Electron 앱을 `_electron.launch({ args: ['.'] })` 로 시작
  2. 첫 BrowserWindow를 가져옴 (`electronApp.firstWindow()`)
  3. 각 테스트 실행 (page 객체로 DOM 조작)
  4. 테스트 종료 후 `electronApp.close()`
출력: 테스트 결과 (pass/fail), 스크린샷 (실패 시)
```

### 2. E2E 테스트 시나리오

#### app-launch.spec.ts
```
테스트 1: "앱이 정상 시작됨"
  - Electron 앱 launch
  - window title === "mehQ" 확인
  - 창이 visible 상태 확인

테스트 2: "최초 실행 시 Wizard 표시"
  - 앱 시작 (클린 DB)
  - [data-testid="wizard-container"]가 존재 확인
  - [data-testid="wizard-step-1"].classList에 active 포함 확인
```

#### welcome-wizard.spec.ts
```
테스트 3: "Step 1 — 이름 미입력 시 Next 비활성"
  - [data-testid="step-username-input"] 비어있음
  - [data-testid="wizard-next-btn"].disabled === true

테스트 4: "Step 1 → Step 2 → Step 3 → Finish 전체 플로우"
  - step-username-input에 "TestUser" 입력
  - wizard-next-btn 클릭 → Step 2 표시 확인
  - step-workdir-path에 기본 경로 표시 확인
  - wizard-next-btn 클릭 → Step 3 표시 확인
  - step-language-radio-en이 기본 선택 확인
  - wizard-finish-btn 클릭 → dashboard-container 표시 확인

테스트 5: "Back 버튼으로 이전 단계 이동, 입력값 유지"
  - Step 1에서 이름 입력 → Step 2 → Back
  - step-username-input의 value === 입력한 이름
```

#### settings-persistence.spec.ts
```
테스트 6: "Wizard 완료 후 재시작 시 Dashboard 바로 표시"
  - Wizard 전체 완료 (테스트 4와 동일)
  - electronApp.close()
  - 새로 launch
  - dashboard-container 표시 확인 (wizard-container 없음)

테스트 7: "Wizard 중단 후 재시작 시 Wizard 처음부터"
  - Step 2까지 진행 후 앱 종료
  - 새로 launch
  - wizard-container 표시, Step 1부터 시작
```

### 3. ESLint 규칙

```
extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'prettier']
rules:
  - no-console: warn (개발 중 허용, 나중에 error로)
  - @typescript-eslint/no-unused-vars: error
  - @typescript-eslint/explicit-function-return-type: off (React 컴포넌트 반환타입 자동)
  - react/react-in-jsx-scope: off (React 17+)
  - react/prop-types: off (TypeScript 사용)
```

### 4. Prettier 설정

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

## playwright.config.ts 스펙

```typescript
// 핵심 설정
{
  testDir: './tests/e2e',
  timeout: 30000,           // Electron 시작이 느릴 수 있으므로 30초
  retries: 1,               // 불안정한 Electron 테스트 대비
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'electron', testMatch: '**/*.spec.ts' }
  ],
}
```

## Electron 테스트 헬퍼

```typescript
// tests/e2e/helpers/electron.ts
// launchApp(): ElectronApplication + Page 반환
// - userData를 임시 디렉토리로 설정 (테스트 격리)
// - 각 테스트마다 클린 DB 보장
// closeApp(): 앱 종료 + 임시 디렉토리 정리

// 핵심: app.getPath('userData')를 테스트별 임시 경로로 오버라이드
// 방법: 환경변수 또는 --user-data-dir CLI 인수
```

## package.json scripts 추가

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "lint": "eslint src/ tests/ --ext .ts,.tsx",
    "lint:fix": "eslint src/ tests/ --ext .ts,.tsx --fix",
    "format": "prettier --write 'src/**/*.{ts,tsx,css}' 'tests/**/*.ts'",
    "format:check": "prettier --check 'src/**/*.{ts,tsx,css}' 'tests/**/*.ts'"
  }
}
```

## Acceptance Criteria

- [ ] `npm run test:e2e` 실행 시 모든 E2E 테스트 통과 (7개)
- [ ] `npm run lint` 실행 시 에러 0개
- [ ] `npm run format:check` 실행 시 모든 파일 포맷 통과
- [ ] Playwright 실패 시 스크린샷 자동 저장 (test-results/ 디렉토리)
- [ ] 테스트 간 DB 격리 (한 테스트의 설정이 다른 테스트에 영향 안 줌)
- [ ] 모든 인터랙션 가능 요소에 data-testid 부여

## QA Checklist

- [ ] `npm run test:e2e` → 7개 테스트 모두 PASS
- [ ] `npm run lint` → 에러 0
- [ ] `npm run format:check` → 포맷 위반 0
- [ ] 테스트 실패 시 test-results/에 스크린샷 생성 확인
- [ ] Playwright HTML 리포트 (`npx playwright show-report`)로 결과 확인 가능

## Regression Checklist

- [ ] Sprint 1-1: 앱 시작, 창 크기, React HMR
- [ ] Sprint 1-2: DB 생성, IPC 동작
- [ ] Sprint 1-3: Wizard 전체 플로우, 설정 저장/복원

## Known Gaps (memoQ 대비)

- memoQ의 QA 자동화는 범위 밖. 이 E2E는 mehQ 자체 품질 보증용
- 성능 테스트 (5만+ 세그먼트)는 Phase 14에서 추가

## Verification Questions (Generator가 구현 전에 확인)

- [ ] `_electron.launch()`에서 `--user-data-dir` 인수로 테스트 격리가 가능한가?
- [ ] Forge의 빌드 없이 소스에서 직접 Electron 테스트가 가능한가, 아니면 `npm run package` 후 테스트해야 하는가?
- [ ] ESLint v9 flat config vs v8 legacy 중 Forge 템플릿과 호환되는 쪽은?

## Dependencies

- Sprint 1-1, 1-2, 1-3 모두 완료 필수

## Out of Scope

- CI/CD 파이프라인 (GitHub Actions 등)
- 단위 테스트 프레임워크 (Jest/Vitest — 필요 시 Phase 2에서)
- 커버리지 측정 (Phase 2에서 추가 가능)
