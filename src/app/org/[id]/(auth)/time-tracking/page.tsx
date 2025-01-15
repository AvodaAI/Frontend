// src/app/org/[id]/(auth)/time-tracking/page.tsx
"use client";

import { Button } from "@/app/components/ui/button";
import { formatTime } from "@/utils/timeFormatHandler";
import { Pause, Play, Timer, TimerOff } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TimerPage = () => {
  const { id: org_id } = useParams();
  const [tasks, setTasks] = useState<{ title: string; id: string }[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState(0); // time in seconds
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/assignedTask?organization_id=${org_id}&action=get-task`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch tasks.");
      const tasks = data.tasks.map((task: { id: string; title: string }) => ({
        id: task.id,
        title: task.title,
      }));
      setTasks(tasks || []);
    } catch (err) {
      setError("Failed to fetch tasks.");
    }
  };

  // Load timer state from localStorage on page load
  useEffect(() => {
    const storedState = localStorage.getItem("timerState");
    if (storedState) {
      const { isActive, isPaused, time } = JSON.parse(storedState);
      setIsActive(isActive);
      setIsPaused(isPaused);
      setTime(time);
    }
    checkTimerStatus();
    fetchTasks();
  }, []);

  // Persist the timer state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      isActive,
      isPaused,
      time,
    };
    localStorage.setItem("timerState", JSON.stringify(state));
  }, [isActive, isPaused, time]);

  // Update timer every second if it's active and not paused
  useEffect(() => {
    if (isActive && !isPaused) {
      const id = setInterval(() => {
        setTime((prevTime) => prevTime + 1); // Increment time by 1 second
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id); // Cleanup on unmount or when timer stops
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [isActive, isPaused]);

  const checkTimerStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timer/status?organization_id=${org_id}&action=get-tracker-status`, {
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to start timer.");
      }

      setSelectedTask(data.data.task_id);
      if (data.data) setIsActive(true);
      else if (data && data.data && data.data.status === "Paused") setIsPaused(true);
    } catch (err) {
      setError("Failed to fetch timer status.");
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    if (!selectedTask) {
      setError("Please select a task before starting the timer.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timer/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_id: Number(org_id),
          action: "timer-start",
          task_id: selectedTask,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || "Failed to start timer.");
      }

      setIsActive(true);
      setTime(0); // Reset time to 0 when clocked in
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start timer.");
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timer/pause`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_id: Number(org_id),
          task_id: selectedTask,
          action: "timer-pause",
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || "Failed to pause timer.");
      }

      setIsPaused(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to pause timer.");
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timer/resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_id: Number(org_id),
          task_id: selectedTask,
          action: "timer-resume",
        }),
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || "Failed to resume timer.");
      }
      setIsPaused(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resume timer.");
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timer/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_id: Number(org_id),
          task_id: selectedTask,
          action: "timer-stop",
        }),
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || "Failed to stop timer.");
      }
      setIsActive(false);
      setIsPaused(false);
      setTime(0); // Reset the time when stopped
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stop timer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <h1 style={{ fontSize: "24px" }}>Timer</h1>
      <div style={{ fontSize: "36px", fontWeight: "bold" }}>{formatTime(time)}</div>
      <select
        value={selectedTask || ""}
        onChange={(e) => {
          setError("");
          setSelectedTask(e.target.value);
        }}
        disabled={isActive}
        style={{ padding: "10px", fontSize: "16px" }}
      >
        <option value="" disabled>
          Select a task
        </option>
        {tasks.map((task: { id: string; title: string }) => (
          <option key={task.id} value={task.id}>
            {task.title}
          </option>
        ))}
      </select>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Button disabled={isActive} onClick={handleClockIn}>
            <Timer />
            Start Timer
          </Button>
          <Button onClick={isPaused ? handleResume : handlePause} disabled={!isActive}>
            {isPaused ? (
              <>
                <Play /> Resume Timer
              </>
            ) : (
              <>
                {" "}
                <Pause /> Pause Timer
              </>
            )}
          </Button>
          <Button onClick={handleStop} disabled={!isActive}>
            <TimerOff /> Stop Timer
          </Button>
        </>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default TimerPage;
