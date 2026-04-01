/** data-testid 기반 셀렉터 상수 */
export const SEL = {
  // Wizard
  WIZARD_CONTAINER: '[data-testid="wizard-container"]',
  WIZARD_STEP_INDICATOR: '[data-testid="wizard-step-indicator"]',

  // Step 1: Username
  STEP_USERNAME_INPUT: '[data-testid="step-username-input"]',
  STEP_USERNAME_ERROR: '[data-testid="step-username-error"]',

  // Step 2: WorkDir
  STEP_WORKDIR_PATH: '[data-testid="step-workdir-path"]',
  STEP_WORKDIR_BROWSE_BTN: '[data-testid="step-workdir-browse-btn"]',

  // Wizard buttons
  WIZARD_BACK_BTN: '[data-testid="wizard-back-btn"]',
  WIZARD_NEXT_BTN: '[data-testid="wizard-next-btn"]',
  WIZARD_FINISH_BTN: '[data-testid="wizard-finish-btn"]',

  // Dashboard
  DASHBOARD_CONTAINER: '[data-testid="dashboard-container"]',
  DASHBOARD_TITLE: '[data-testid="dashboard-title"]',
  DASHBOARD_EMPTY_MESSAGE: '[data-testid="dashboard-empty-message"]',
  DASHBOARD_NEW_PROJECT_BTN: '[data-testid="dashboard-new-project-btn"]',

  // Loading
  LOADING_SCREEN: '[data-testid="loading-screen"]',
} as const;
