import { useState, useEffect, useCallback } from 'react';
import type { Project, CreateProjectInput } from '../../shared/types/project';

interface UseProjectsResult {
  readonly projects: Project[];
  readonly loading: boolean;
  readonly create: (input: CreateProjectInput) => Promise<Project>;
  readonly reload: () => Promise<void>;
}

export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const result = await window.electronAPI.project.list();
    setProjects(result);
    setLoading(false);
  }, []);

  const create = useCallback(
    async (input: CreateProjectInput) => {
      const project = await window.electronAPI.project.create(input);
      await reload();
      return project;
    },
    [reload],
  );

  useEffect(() => {
    let cancelled = false;
    window.electronAPI.project.list().then((result) => {
      if (!cancelled) {
        setProjects(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { projects, loading, create, reload };
}
