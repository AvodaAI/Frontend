// src/app/org/[id]/(auth)/time-logs/page.tsx
"use client"

import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { useState } from 'react';
import TimeLogs from './components/TimeLogs';

const TimelogsPage = () => {
  const [searchTask, setSearchTask] = useState('')
  const [error, setError] = useState<string | null>(null);


  // const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTask(event.target.value);
  // };


  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      {/* <Header searchTask={searchTask} onChange={onSearchChange} /> */}

      {!error && (<TimeLogs />)}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TimelogsPage;
