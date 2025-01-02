"use client"

import { Button } from '@/app/components/ui/button';
import { Pause, Play, Timer, TimerOff } from 'lucide-react';
import { useEffect, useState } from 'react';

const TimerPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState(0); // time in seconds
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Load timer state from localStorage on page load
  useEffect(() => {
    const storedState = localStorage.getItem('timerState');
    if (storedState) {
      const { isActive, isPaused, time } = JSON.parse(storedState);
      setIsActive(isActive);
      setIsPaused(isPaused);
      setTime(time);
    }
    checkTimerStatus();
  }, []);

  // Persist the timer state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      isActive,
      isPaused,
      time,
    };
    localStorage.setItem('timerState', JSON.stringify(state));
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timer/status?organization_id=88&action=get-tracker-status`, {
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to start timer.');
      }

      if (data.data) setIsActive(true);
      else if (data && data.data && data.data.status === "Paused") setIsPaused(true);
    } catch (err) {
      setError('Failed to fetch timer status.');
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timer/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization_id: 88,
          action: "timer-start"
        }),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || 'Failed to start timer.');
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization_id: 88,
          action: "timer-pause"
        }),
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || 'Failed to pause timer.');
      }

      setIsPaused(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause timer.');
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timer/resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization_id: 88,
          action: "timer-resume"
        }),
        credentials: 'include'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || 'Failed to resume timer.');
      }
      setIsPaused(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume timer.');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timer/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization_id: 88,
          action: "timer-stop"
        }),
        credentials: 'include'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || 'Failed to stop timer.');
      }
      setIsActive(false);
      setIsPaused(false);
      setTime(0); // Reset the time when stopped
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop timer.');
    } finally {
      setLoading(false);
    }
  };

  // Format time in HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <h1 style={{ fontSize: '24px' }}>Timer</h1>
      <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
        {formatTime(time)}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Button disabled={isActive} onClick={handleClockIn}>
            <Timer />Start Timer
          </Button>
          <Button onClick={isPaused ? handleResume : handlePause} disabled={!isActive}>
            {isPaused
              ? <><Play /> Resume Timer</>
              : <> <Pause /> Pause Timer</>}
          </Button>
          <Button onClick={handleStop} disabled={!isActive}>
            <TimerOff /> Stop Timer
          </Button>
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TimerPage;
