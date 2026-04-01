export interface UserSettings {
  user_name: string;
  work_directory: string;
  ui_language: string;
  wizard_completed: boolean;
}

export type SettingsKey = keyof UserSettings;

export const DEFAULT_SETTINGS: UserSettings = {
  user_name: '',
  work_directory: '', // 런타임에 os.homedir()/Documents/mehQ로 결정
  ui_language: 'ko',
  wizard_completed: false,
};
