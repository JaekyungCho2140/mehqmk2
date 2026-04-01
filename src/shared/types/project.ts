export type ProjectStatus =
  | 'not-started'
  | 'in-progress'
  | 'translation-done'
  | 'r1-done'
  | 'r2-done'
  | 'completed';

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly source_lang: string;
  readonly target_lang: string;
  readonly client: string;
  readonly domain: string;
  readonly subject: string;
  readonly description: string;
  readonly directory: string;
  readonly deadline: string | null;
  readonly status: ProjectStatus;
  readonly created_by: string;
  readonly created_at: string;
  readonly last_accessed: string;
}

export interface CreateProjectInput {
  readonly name: string;
  readonly source_lang: string;
  readonly target_lang: string;
  readonly client?: string;
  readonly domain?: string;
  readonly subject?: string;
  readonly description?: string;
  readonly directory?: string;
  readonly deadline?: string | null;
}

export interface Document {
  readonly id: string;
  readonly project_id: string;
  readonly name: string;
  readonly format: string;
  readonly file_path: string;
  readonly seg_count: number;
  readonly progress: number;
  readonly imported_at: string;
}
