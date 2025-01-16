// src/types/timeLog.ts
import { RowData, TableMeta } from "@tanstack/react-table";

export interface TimeLog {
    id: number;
    user_id: number;
    task_id: string;
    description?: string | null;
    organization_id?: string | null;
    start_time: Date;
    end_time: Date | null;
    duration_minutes: number | null;
    status: string | null;
    locked: boolean;
    locked_time?: Date | null;
    created_at: Date;
    updated_at: Date;
    created_by?: string | null;
    updated_by?: string | null;
}

export interface TimeEntry {
  id: string
  title: string
  task: string
  person: string
  startTime: string
  endtime: string
  duration: string
}

export interface Header {
  day: string;
  date: string;
  total: string,
}

export interface TimeLogGroup {
  header: Header;
  entries: TimeEntry[];
}

export interface CustomTableMeta<TData extends RowData> extends TableMeta<TData> {
  headerProps: Header;
}
