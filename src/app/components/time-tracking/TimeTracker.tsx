'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Label } from '@components/ui/label';
import { Clock, Loader2 } from 'lucide-react';
import { Timer } from './Timer';
import { useTimer } from '@/hooks/useTimer';
import { cn } from '@/lib/utils';

// TODO: Move these interfaces to a shared types file
interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
}

// TODO: Replace with API integration
const projects: Project[] = [
  { id: '1', name: 'Project A' },
  { id: '2', name: 'Project B' },
];

const tasks: Task[] = [
  { id: '1', name: 'Task 1' },
  { id: '2', name: 'Task 2' },
];

export const TimeTracker: React.FC = () => {
  const { user } = useUser();
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const { isRunning, formattedTime, start, pause, reset } = useTimer();

  // Simulate loading states for demonstration
  useEffect(() => {
    const loadData = async () => {
      // TODO: Replace with actual API calls specific to the logged-in user
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsProjectsLoading(false);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsTasksLoading(false);
    };
    loadData();
  }, []);

  const handleStart = async () => {
    if (!selectedTask || !selectedProject) {
      // TODO: Replace with proper toast notification
      alert('Please select both a task and project before starting the timer');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Add API call to start timer on backend for the specific user
      await new Promise(resolve => setTimeout(resolve, 500));
      start();
    } catch (error) {
      // TODO: Add proper error toast notification
      console.error('Failed to start timer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center space-x-2">
          <Clock className="text-primary h-6 w-6" />
          <span>Time Tracker for {user?.fullName || 'Employee'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Project</Label>
            <Select value={selectedProject} onValueChange={setSelectedProject} disabled={isProjectsLoading}>
              <SelectTrigger>
                <SelectValue>
                  {isProjectsLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading projects...</span>
                    </div>
                  ) : (
                    "Select a project"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Task</Label>
            <Select value={selectedTask} onValueChange={setSelectedTask} disabled={isTasksLoading}>
              <SelectTrigger>
                <SelectValue>
                  {isTasksLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading tasks...</span>
                    </div>
                  ) : (
                    "Select a task"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Timer
          isRunning={isRunning}
          formattedTime={formattedTime}
          onStart={handleStart}
          onPause={pause}
          onReset={reset}
          isLoading={isLoading}
        />

        {selectedTask && selectedProject && (
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Currently tracking:{' '}
              <span className="font-medium">
                {projects.find(p => p.id === selectedProject)?.name} -{' '}
                {tasks.find(t => t.id === selectedTask)?.name}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
