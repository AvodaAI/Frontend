'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Label } from '@components/ui/label';
import { Clock, Loader2 } from 'lucide-react';
import { Timer } from './Timer';
import { useTimer } from '@/hooks/useTimer';
import { Task } from '@/types/taskmanagement';
import { Project } from '@/types/taskmanagement';

export const TimeTracker: React.FC = () => {
  const [ user, setUser ] = useState<any>( null );
  const [ projects, setProjects ] = useState<Project[]>( [] );
  const [ tasks, setTasks ] = useState<Task[]>( [] );
  const [ selectedTask, setSelectedTask ] = useState( '' );
  const [ selectedProject, setSelectedProject ] = useState( '' );
  const [ isLoading, setIsLoading ] = useState( false );
  const [ isProjectsLoading, setIsProjectsLoading ] = useState( true );
  const [ isTasksLoading, setIsTasksLoading ] = useState( true );
  const { isRunning, formattedTime, start, pause, reset } = useTimer();

  useEffect( () => {
    const fetchUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if ( error ) {
        console.error( 'Error fetching user:', error.message );
        return;
      }
      setUser( user );
    };

    const fetchProjects = async () => {
      setIsProjectsLoading( true );
      const { data: projects, error } = await supabase
        .from( 'projects' ) // Assuming a "projects" table in your database
        .select( 'id, name' );
      if ( error ) {
        console.error( 'Error fetching projects:', error.message );
      } else {
        setProjects( projects || [] );
      }
      setIsProjectsLoading( false );
    };

    const fetchTasks = async () => {
      setIsTasksLoading( true );
      const { data: tasks, error } = await supabase
        .from( 'tasks' ) // Assuming a "tasks" table in your database
        .select( 'id, name' );
      if ( error ) {
        console.error( 'Error fetching tasks:', error.message );
      } else {
        setTasks( tasks || [] );
      }
      setIsTasksLoading( false );
    };

    fetchUser();
    fetchProjects();
    fetchTasks();
  }, [] );

  const handleStart = async () => {
    if ( !selectedTask || !selectedProject ) {
      alert( 'Please select both a task and project before starting the timer' );
      return;
    }

    try {
      setIsLoading( true );
      const { error } = await supabase
        .from( 'time_logs' ) // Assuming a "time_logs" table in your database
        .insert( {
          user_id: user?.id,
          task_id: selectedTask,
          project_id: selectedProject,
          start_time: new Date(),
        } );

      if ( error ) {
        console.error( 'Error starting timer:', error.message );
        return;
      }

      start();
    } catch ( error ) {
      console.error( 'Failed to start timer:', error );
    } finally {
      setIsLoading( false );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center space-x-2">
          <Clock className="text-primary h-6 w-6" />
          <span>Time Tracker for { user?.email || 'Employee' }</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Project</Label>
            <Select value={ selectedProject } onValueChange={ setSelectedProject } disabled={ isProjectsLoading }>
              <SelectTrigger>
                <SelectValue>
                  { isProjectsLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading projects...</span>
                    </div>
                  ) : (
                    'Select a project'
                  ) }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                { projects.map( ( project ) => (
                  <SelectItem key={ project.id } value={ project.id }>
                    { project.name }
                  </SelectItem>
                ) ) }
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Task</Label>
            <Select value={ selectedTask } onValueChange={ setSelectedTask } disabled={ isTasksLoading }>
              <SelectTrigger>
                <SelectValue>
                  { isTasksLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading tasks...</span>
                    </div>
                  ) : (
                    'Select a task'
                  ) }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                { tasks.map( ( task ) => (
                  <SelectItem key={ task.id } value={ task.id }>
                    { task.name }
                  </SelectItem>
                ) ) }
              </SelectContent>
            </Select>
          </div>
        </div>

        <Timer
          isRunning={ isRunning }
          formattedTime={ formattedTime }
          onStart={ handleStart }
          onPause={ pause }
          onReset={ reset }
          isLoading={ isLoading }
        />

        { selectedTask && selectedProject && (
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Currently tracking:{ ' ' }
              <span className="font-medium">
                { projects.find( ( p ) => p.id === selectedProject )?.name } -{ ' ' }
                { tasks.find( ( t ) => t.id === selectedTask )?.name }
              </span>
            </p>
          </div>
        ) }
      </CardContent>
    </Card>
  );
};
