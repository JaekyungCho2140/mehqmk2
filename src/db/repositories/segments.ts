import type Database from 'better-sqlite3';
import type { Segment } from '../../shared/types/segment';
import crypto from 'node:crypto';

interface DbSegmentRow {
  id: string;
  document_id: string;
  index_num: number;
  source: string;
  target: string;
  status: string;
  locked: number;
  match_rate: number | null;
  modified: number;
  confirmed_by: string | null;
  confirmed_at: string | null;
  context_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function rowToSegment(row: DbSegmentRow): Segment {
  return {
    id: row.id,
    index: row.index_num,
    source: row.source,
    target: row.target,
    status: row.status as Segment['status'],
    locked: row.locked === 1,
    matchRate: row.match_rate,
    modified: row.modified === 1,
    confirmedBy: row.confirmed_by,
    confirmedAt: row.confirmed_at,
  };
}

export class SegmentRepository {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  listByDocument(documentId: string): Segment[] {
    const rows = this.db
      .prepare('SELECT * FROM segments WHERE document_id = ? ORDER BY index_num ASC')
      .all(documentId) as DbSegmentRow[];
    return rows.map(rowToSegment);
  }

  update(
    id: string,
    fields: Partial<
      Pick<Segment, 'target' | 'status' | 'locked' | 'modified' | 'confirmedBy' | 'confirmedAt'>
    >,
  ): Segment {
    const sets: string[] = ["updated_at = datetime('now')"];
    const values: unknown[] = [];

    if (fields.target !== undefined) {
      sets.push('target = ?');
      values.push(fields.target);
    }
    if (fields.status !== undefined) {
      sets.push('status = ?');
      values.push(fields.status);
    }
    if (fields.locked !== undefined) {
      sets.push('locked = ?');
      values.push(fields.locked ? 1 : 0);
    }
    if (fields.modified !== undefined) {
      sets.push('modified = ?');
      values.push(fields.modified ? 1 : 0);
    }
    if (fields.confirmedBy !== undefined) {
      sets.push('confirmed_by = ?');
      values.push(fields.confirmedBy);
    }
    if (fields.confirmedAt !== undefined) {
      sets.push('confirmed_at = ?');
      values.push(fields.confirmedAt);
    }

    values.push(id);
    this.db.prepare(`UPDATE segments SET ${sets.join(', ')} WHERE id = ?`).run(...values);

    const row = this.db.prepare('SELECT * FROM segments WHERE id = ?').get(id) as DbSegmentRow;
    return rowToSegment(row);
  }

  bulkInsert(
    documentId: string,
    segments: Array<{
      source: string;
      target: string;
      status: string;
      contextId?: string;
      notes?: string;
    }>,
  ): void {
    const stmt = this.db.prepare(
      `INSERT INTO segments (id, document_id, index_num, source, target, status, context_id, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );

    const runInTransaction = this.db.transaction(() => {
      segments.forEach((seg, i) => {
        stmt.run(
          crypto.randomUUID(),
          documentId,
          i + 1,
          seg.source,
          seg.target,
          seg.status,
          seg.contextId ?? null,
          seg.notes ?? null,
        );
      });
    });

    runInTransaction();
  }

  bulkUpdate(
    updates: Array<{
      id: string;
      target?: string;
      status?: string;
      locked?: boolean;
      modified?: boolean;
      confirmedBy?: string | null;
      confirmedAt?: string | null;
    }>,
  ): void {
    const runInTransaction = this.db.transaction(() => {
      for (const u of updates) {
        this.update(u.id, {
          target: u.target,
          status: u.status as Segment['status'],
          locked: u.locked,
          modified: u.modified,
          confirmedBy: u.confirmedBy,
          confirmedAt: u.confirmedAt,
        });
      }
    });

    runInTransaction();
  }
}
