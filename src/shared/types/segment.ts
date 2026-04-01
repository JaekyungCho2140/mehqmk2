export type SegmentStatus =
  | 'not-started'
  | 'edited'
  | 'pre-translated'
  | 'assembled'
  | 'confirmed'
  | 'r1-confirmed'
  | 'r2-confirmed'
  | 'locked'
  | 'rejected';

export interface Segment {
  readonly id: string;
  readonly index: number;
  source: string;
  target: string;
  status: SegmentStatus;
  locked: boolean;
  matchRate: number | null;
  modified: boolean;
  confirmedBy: string | null;
  confirmedAt: string | null;
}
