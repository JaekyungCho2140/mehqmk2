export type TmRole = 'working' | 'master' | 'reference';

export interface TranslationMemory {
  readonly id: string;
  readonly name: string;
  readonly source_lang: string;
  readonly target_lang: string;
  readonly description: string;
  readonly role: TmRole;
  readonly allow_multiple: boolean;
  readonly allow_reverse: boolean;
  readonly entry_count: number;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface TranslationUnit {
  readonly id: string;
  readonly tm_id: string;
  readonly source: string;
  readonly target: string;
  readonly prev_source: string | null;
  readonly next_source: string | null;
  readonly context_id: string | null;
  readonly created_by: string;
  readonly created_at: string;
  readonly modified_by: string;
  readonly modified_at: string;
  readonly document_name: string;
  readonly project_name: string;
  readonly client: string;
  readonly domain: string;
  readonly flagged: boolean;
}

export interface CreateTmInput {
  readonly name: string;
  readonly source_lang: string;
  readonly target_lang: string;
  readonly description?: string;
  readonly role?: TmRole;
}

export interface ProjectTmLink {
  readonly project_id: string;
  readonly tm_id: string;
  readonly role: TmRole;
  readonly rank: number;
}
