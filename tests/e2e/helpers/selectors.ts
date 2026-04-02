/** data-testid 기반 셀렉터 상수 */
export const SEL = {
  // Welcome Wizard
  WIZARD_CONTAINER: '[data-testid="wizard-container"]',
  WIZARD_STEP_INDICATOR: '[data-testid="wizard-step-indicator"]',
  STEP_USERNAME_INPUT: '[data-testid="step-username-input"]',
  STEP_USERNAME_ERROR: '[data-testid="step-username-error"]',
  STEP_WORKDIR_PATH: '[data-testid="step-workdir-path"]',
  STEP_WORKDIR_BROWSE_BTN: '[data-testid="step-workdir-browse-btn"]',
  WIZARD_BACK_BTN: '[data-testid="wizard-back-btn"]',
  WIZARD_NEXT_BTN: '[data-testid="wizard-next-btn"]',
  WIZARD_FINISH_BTN: '[data-testid="wizard-finish-btn"]',

  // Dashboard
  DASHBOARD_CONTAINER: '[data-testid="dashboard-container"]',
  DASHBOARD_TITLE: '[data-testid="dashboard-title"]',
  DASHBOARD_EMPTY_MESSAGE: '[data-testid="dashboard-empty-message"]',
  DASHBOARD_NEW_PROJECT_BTN: '[data-testid="dashboard-new-project-btn"]',
  DASHBOARD_SEARCH_FILTER: '[data-testid="dashboard-search-filter"]',
  PROJECT_GRID: '[data-testid="project-grid"]',

  // New Project Wizard
  NEW_PROJECT_WIZARD: '[data-testid="new-project-wizard"]',
  NEW_PROJECT_NAME_INPUT: '[data-testid="new-project-name-input"]',
  NEW_PROJECT_SOURCE_LANG: '[data-testid="new-project-source-lang"]',
  NEW_PROJECT_SOURCE_LANG_DROPDOWN: '[data-testid="new-project-source-lang-dropdown"]',
  NEW_PROJECT_TARGET_LANG: '[data-testid="new-project-target-lang"]',
  NEW_PROJECT_TARGET_LANG_DROPDOWN: '[data-testid="new-project-target-lang-dropdown"]',
  NEW_PROJECT_CLIENT_INPUT: '[data-testid="new-project-client-input"]',
  NEW_PROJECT_FINISH_BTN: '[data-testid="new-project-finish-btn"]',
  NEW_PROJECT_CANCEL_BTN: '[data-testid="new-project-cancel-btn"]',

  // Details Pane
  DETAILS_PANE: '[data-testid="details-pane"]',
  DETAILS_PANE_TITLE: '[data-testid="details-pane-title"]',
  DETAILS_PANE_OPEN_BTN: '[data-testid="details-pane-open-btn"]',
  DETAILS_PANE_CLONE_BTN: '[data-testid="details-pane-clone-btn"]',
  DETAILS_PANE_DELETE_BTN: '[data-testid="details-pane-delete-btn"]',

  // Context Menu
  CONTEXT_MENU: '[data-testid="context-menu"]',

  // Clone Dialog
  CLONE_DIALOG: '[data-testid="clone-dialog"]',
  CLONE_DIALOG_NAME_INPUT: '[data-testid="clone-dialog-name-input"]',
  CLONE_DIALOG_CONFIRM: '[data-testid="clone-dialog-confirm"]',

  // Confirm Dialog (Delete)
  CONFIRM_DIALOG: '[data-testid="confirm-dialog"]',
  CONFIRM_DIALOG_CONFIRM: '[data-testid="confirm-dialog-confirm"]',
  CONFIRM_DIALOG_CANCEL: '[data-testid="confirm-dialog-cancel"]',

  // Project Home
  PROJECT_HOME: '[data-testid="project-home"]',
  PROJECT_HOME_BACK_BTN: '[data-testid="project-home-back-btn"]',
  TAB_GENERAL: '[data-testid="tab-general"]',
  TAB_REPORTS: '[data-testid="tab-reports"]',
  TAB_SETTINGS: '[data-testid="tab-settings"]',
  GENERAL_TAB: '[data-testid="general-tab"]',
  REPORTS_TAB: '[data-testid="reports-tab"]',
  SETTINGS_TAB: '[data-testid="settings-tab"]',
  SETTINGS_NAME_INPUT: '[data-testid="settings-name-input"]',
  SETTINGS_SAVE_BTN: '[data-testid="settings-save-btn"]',
  TOAST: '[data-testid="toast"]',

  // Editor
  OPEN_EDITOR_BTN: '[data-testid="open-editor-btn"]',
  TRANSLATION_EDITOR: '[data-testid="translation-editor"]',
  EDITOR_BACK_BTN: '[data-testid="editor-back-btn"]',
  SEGMENT_GRID: '[data-testid="segment-grid"]',
  EDIT_PANEL: '[data-testid="edit-panel"]',
  EDIT_PANEL_SOURCE: '[data-testid="edit-panel-source"]',
  TIPTAP_EDITOR: '[data-testid="tiptap-editor"]',
  EDITOR_STATUSBAR: '[data-testid="editor-statusbar"]',
  FILTER_BAR: '[data-testid="filter-bar"]',
  FILTER_SOURCE: '[data-testid="filter-source"]',
  FILTER_TARGET: '[data-testid="filter-target"]',
  FILTER_SORT_SELECT: '[data-testid="filter-sort-select"]',
  TOOLBAR_BOLD: '[data-testid="toolbar-bold"]',
  TOOLBAR_ITALIC: '[data-testid="toolbar-italic"]',
  TOOLBAR_UNDERLINE: '[data-testid="toolbar-underline"]',
  CHANGE_STATUS_DIALOG: '[data-testid="change-status-dialog"]',
  CHANGE_STATUS_APPLY: '[data-testid="change-status-apply"]',

  // Loading
  LOADING_SCREEN: '[data-testid="loading-screen"]',

  // TM
  CREATE_TM_DIALOG: '[data-testid="create-tm-dialog"]',
  CREATE_TM_NAME_INPUT: '[data-testid="create-tm-name-input"]',
  CREATE_TM_SOURCE_LANG: '[data-testid="create-tm-source-lang"]',
  CREATE_TM_TARGET_LANG: '[data-testid="create-tm-target-lang"]',
  CREATE_TM_DESCRIPTION: '[data-testid="create-tm-description"]',
  CREATE_TM_CONFIRM: '[data-testid="create-tm-confirm"]',
  CREATE_TM_ROLE_WORKING: '[data-testid="create-tm-role-working"]',
  CREATE_TM_ROLE_MASTER: '[data-testid="create-tm-role-master"]',
  CREATE_TM_ROLE_REFERENCE: '[data-testid="create-tm-role-reference"]',

  // Wizard TM Step
  WIZARD_TM_STEP: '[data-testid="wizard-tm-step"]',
  WIZARD_CREATE_TM_BTN: '[data-testid="wizard-create-tm-btn"]',
  WIZARD_TM_EMPTY: '[data-testid="wizard-tm-empty"]',
  WIZARD_TM_LIST: '[data-testid="wizard-tm-list"]',
  NEW_PROJECT_NEXT_BTN: '[data-testid="new-project-next-btn"]',
  NEW_PROJECT_BACK_BTN: '[data-testid="new-project-back-btn"]',
} as const;
