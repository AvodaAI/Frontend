// src/types/timeLog.ts
import { RowData, TableMeta } from "@tanstack/react-table";

interface Pauses {
  start: string;
  end: string;
}

export interface TimeLog {
  id: number;
  task?: string;
  name?: string;
  user_id?: number;
  task_id?: string;
  description?: string | null;
  organization_id?: string | null;
  pauses: Pauses[];
  start_time: Date;
  end_time: Date | null;
  duration_minutes?: number | null;
  TimeLogStatus?: string | null;
  locked?: boolean;
  locked_time?: Date | null;
  created_at: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
  total_active_time: number;
}
