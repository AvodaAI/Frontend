// src/app/org/[id]/(auth)/time-logs/page.tsx
"use client"

import { Heading } from '@/app/components/ui/heading';
import { TimeLogsTable } from '@/app/components/ui/tiem-logs-table';
import { useEffect, useState } from 'react';
import { columns } from './components/columns';
import Header from './components/Header';
import { TimeEntry, TimeLogGroup } from '@/types/timeLog';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { formatTimeLogs } from '@/lib/utils';

const TimelogsPage = () => {
  const [searchTask, setSearchTask] = useState('')
  const [loading, setLoading] = useState(false);
  const [timelogs, setTimelogs] = useState<any[]>([]);
  const { id: org_id } = useParams()

  useEffect(() => {
    fetchTimelogs();
  }, []);

  const fetchTimelogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timer/timelogs?organization_id=${org_id}&action=get-timelog`, { credentials: "include" });
      const data = await response.json();
      if (response.ok) {
        setTimelogs(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch timelogs.');
      }
    } catch (error) {
      setLoading(false);
      throw new Error('Failed to fetch timelogs.');
    } finally {
      setLoading(false);
    }
  };
  const { todayData, yesterdayData, othersData } = formatTimeLogs(timelogs);

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
        {todayData.entries.length > 0 && <TimeLogsTable
          searchKey="name"
          clickable={true}
          columns={columns}
          data={todayData.entries}
          header={todayData.header}
        />
        }

        {yesterdayData.entries.length > 0 && <TimeLogsTable
          searchKey="name"
          clickable={true}
          columns={columns}
          data={yesterdayData.entries}
          header={yesterdayData.header}
        />}

        {othersData.entries.length > 0 && <TimeLogsTable
          searchKey="name"
          clickable={true}
          columns={columns}
          data={othersData.entries}
          header={othersData.header}
        />}
      </div>
    </div>
  );
};

export default TimelogsPage;
