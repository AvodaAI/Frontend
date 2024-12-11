// src/app/components/time-tracking/Timer.tsx
import React from "react";
import { Play, Pause, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface TimerProps {
  isRunning: boolean;
  formattedTime: string;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  isRunning,
  formattedTime,
  onStart,
  onPause,
  onReset,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-4xl font-mono font-bold">{formattedTime}</div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={isRunning ? onPause : onStart}
          disabled={isLoading}
          className={cn(
            "rounded-full",
            isRunning ? "hover:bg-yellow-100" : "hover:bg-green-100",
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isRunning ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          disabled={isLoading}
          className="rounded-full hover:bg-gray-100"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
