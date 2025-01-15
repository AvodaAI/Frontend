// src/app/org/[id]/(auth)/time-logs/page.tsx
"use client"

import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Heading } from '@/app/components/ui/heading';
import { Input } from '@/app/components/ui/input';
import { TimeLog } from '@/types/timeLog';
import { Clock, Play, Plus } from 'lucide-react';
import { useState } from 'react';

interface TimeEntry {
  id: string
  title: string
  person: string
  startTime: string
  endtime: string
  duration: string
}

interface timeLogGroup {
  date: string;
  entries: TimeEntry[];
}

const TimelogsPage = () => {
  const [searchTask, setSearchTask] = useState('')
  const data: timeLogGroup[] = [
    {
      date: "Today, 1 Jan 2025",
      entries: [
        {
          id: '1', title: 'Create Design System', person: "Samrun Run", startTime: "13:26", endtime: "14:39", duration: '1:26:17'
        },
        {
          id: '2', title: 'finishing About Page', person: "Behar musa", startTime: "15:26", endtime: "17:39", duration: '1:26:17'
        }
      ]
    },
    {
      date: "Yesterday, 31 Dec 2024",
      entries: [
        {
          id: '3', title: 'Create Design System', person: "Samrun Run", startTime: "13:26", endtime: "14:39", duration: '1:26:17'
        },
      ]
    },
  ]

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <Heading
        title={`Time Logs (6)`}
        description="Here's a list of all logged times"
      />
      <Card className='flex flex-col space-y-2 sm:flex-row p-3 justify-between my-5'>
        <div className='flex-1 sm:grid sm:grid-cols-2 lg:grid-cols-3'>
          <Input
            placeholder="What are you working on"
            value={searchTask}
            onChange={(event) => setSearchTask(event.target.value)
            }
            className="w-full border-transparent bg-muted shadow-none text-xs"
          />
        </div>
        <div className='flex space-x-3 sm:px-3'>
          <Button variant={'outline'} className='border-dashed text-blue-500 hover:text-blue-500' size={'sm'}>
            <Plus size={18} />
            <span>Task</span>
          </Button>
          <Button variant={'outline'} className='border-dashed px-2' size={'sm'}>
            <Clock size={18} />
            <span>00:00:00</span>
          </Button>

          <Button className='border-dashed' size={'sm'}>
            <Play size={18} />
            <span>Start</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TimelogsPage;
