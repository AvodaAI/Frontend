// src/app/org/[id]/(auth)/time-logs/page.tsx
"use client"

import { Heading } from '@/app/components/ui/heading';
import { TimeLogsTable } from '@/app/components/ui/tiem-logs-table';
import { useState } from 'react';
import { columns } from './components/columns';
import Header from './components/Header';
import { TimeEntry, TimeLogGroup } from '@/types/timeLog';

const TimelogsPage = () => {
  const [searchTask, setSearchTask] = useState('')
  const todayData: TimeLogGroup = {
    header: {
      day: "Today",
      date: "1 Jan 2025",
      total: '06:24:45',
    },
    entries: [
      {
        id: '1', task: 'Create Design System', title: 'Developer', person: "Samrun Run", startTime: "13:26", endtime: "14:39", duration: '1:26:17'
      },
      {
        id: '2', task: 'Finishing About Page', title: 'Designer', person: "Behar musa", startTime: "15:26", endtime: "17:39", duration: '1:26:17'
      },
      {
        id: '3', task: 'Create Design System', title: 'Developer', person: "Samrun Run", startTime: "13:26", endtime: "14:39", duration: '1:26:17'
      },
      {
        id: '4', task: 'Finishing About Page', title: 'Designer', person: "Behar musa", startTime: "15:26", endtime: "17:39", duration: '1:26:17'
      }
    ]
  }


  const yesterdayData: TimeLogGroup = {
    header: {
      day: "Yesterday",
      date: "31 Dec 2024",
      total: '06:24:45',
    },
    entries: [
      {
        id: '5', task: 'Create Design System', title: 'Developer', person: "Samrun Run", startTime: "13:26", endtime: "14:39", duration: '1:26:17'
      },
      {
        id: '6', task: 'Create Design System', title: 'Developer', person: "Samrun Run", startTime: "13:26", endtime: "14:39", duration: '1:26:17'
      },
    ]
  }


  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTask(event.target.value);
  };


  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <Heading
        title={`Time Logs (6)`}
        description="Here's a list of all logged times"
      />
      <Header searchTask={searchTask} onChange={onSearchChange} />
      <div className='flex flex-col space-y-5'>
        <TimeLogsTable
          searchKey="name"
          clickable={true}
          columns={columns}
          data={todayData.entries}
          header={todayData.header}
        />

        <TimeLogsTable
          searchKey="name"
          clickable={true}
          columns={columns}
          data={yesterdayData.entries}
          header={yesterdayData.header}
        />
      </div>
    </div>
  );
};

export default TimelogsPage;
