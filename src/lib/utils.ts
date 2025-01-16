// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseISO, format, isToday, isYesterday } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const passwordRegex = {
  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?~])/,
  message:
    "Password must contain one lowercase letter, one uppercase letter, one number, and one special character",
};

interface TimeLogEntry {
  id: string;
  start_time: string;
  end_time: string;
  total_active_time: number;
  pauses: any[];
  created_at: string;
  updated_at: string;
}

interface TimeLogGroup {
  header: {
    day: string;
    date: string;
    total: string;
  };
  entries: {
    id: string;
    task: string;
    title: string;
    person: string;
    startTime: string;
    endTime: string;
    duration: string;
  }[];
}
