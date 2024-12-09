// src/types/activityLog.ts
export interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  subject: string;
  timestamp: string;
  details: string;
}