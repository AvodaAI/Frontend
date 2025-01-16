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

export function formatTimeLogs(data: TimeLogEntry[]): {
  todayData: TimeLogGroup;
  yesterdayData: TimeLogGroup;
  othersData: TimeLogGroup;
} {
  const todayData: TimeLogGroup = {
    header: {
      day: "Today",
      date: format(new Date(), "d MMM yyyy"),
      total: "00:00:00",
    },
    entries: [],
  };
  const yesterdayData: TimeLogGroup = {
    header: {
      day: "Yesterday",
      date: format(new Date(Date.now() - 86400000), "d MMM yyyy"),
      total: "00:00:00",
    },
    entries: [],
  };
  const othersData: TimeLogGroup = {
    header: { day: "Previous", date: "", total: "00:00:00" },
    entries: [],
  };

  let totalTodayTimeInSeconds = 0;
  let totalYesterdayTimeInSeconds = 0;
  let totalOthersTimeInSeconds = 0;

  data.forEach((entry) => {
    const startTime = parseISO(entry.start_time);
    const endTime = parseISO(entry.end_time);
    const durationInSeconds = (endTime.getTime() - startTime.getTime()) / 1000; // duration in seconds
    const duration = formatDuration(durationInSeconds); // Format the duration as HH:mm:ss

    const entryData = {
      id: entry.id,
      task: "Task Name", // Replace with actual task name if needed
      title: "Developer", // Replace with actual title if needed
      person: "Beharudin Musa", // Replace with actual person if needed
      startTime: format(startTime, "HH:mm"),
      endTime: format(endTime, "HH:mm"),
      duration,
    };

    if (isToday(startTime)) {
      totalTodayTimeInSeconds += durationInSeconds;
      todayData.entries.push(entryData);
    } else if (isYesterday(startTime)) {
      totalYesterdayTimeInSeconds += durationInSeconds;
      yesterdayData.entries.push(entryData);
    } else {
      totalOthersTimeInSeconds += durationInSeconds;
      othersData.entries.push(entryData);
    }
  });

  // Calculate the total time in HH:mm:ss format
  todayData.header.total = formatDuration(totalTodayTimeInSeconds);
  yesterdayData.header.total = formatDuration(totalYesterdayTimeInSeconds);
  othersData.header.total = formatDuration(totalOthersTimeInSeconds);

  return { todayData, yesterdayData, othersData };
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600); // Calculate hours
  const minutes = Math.floor((seconds % 3600) / 60); // Calculate minutes
  const remainingSeconds = Math.floor(seconds % 60); // Calculate remaining seconds

  // Format the duration as HH:mm:ss
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(remainingSeconds).padStart(2, "0")}`;
}
