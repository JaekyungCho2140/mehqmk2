import { useState, useEffect, useCallback } from 'react';
import type { UserSettings } from '../../shared/types/settings';

declare global {
  interface Window {
    electronAPI: {
      platform: string;
      settings: {
        get: (key: string) => Promise<unknown>;
        getAll: () => Promise<UserSettings>;
        set: (key: string, value: unknown) => Promise<void>;
        setBulk: (settings: Partial<UserSettings>) => Promise<void>;
      };
      dialog: {
        selectDirectory: (options?: { defaultPath?: string }) => Promise<string | null>;
      };
    };
  }
}

interface UseSettingsResult {
  readonly settings: UserSettings | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly saveBulk: (partial: Partial<UserSettings>) => Promise<void>;
  readonly reload: () => Promise<void>;
}

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      const result = await window.electronAPI.settings.getAll();
      setSettings(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveBulk = useCallback(async (partial: Partial<UserSettings>) => {
    await window.electronAPI.settings.setBulk(partial);
    setSettings((prev) => (prev ? { ...prev, ...partial } : prev));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { settings, loading, error, saveBulk, reload };
}
