// src/types/timeLog.ts
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