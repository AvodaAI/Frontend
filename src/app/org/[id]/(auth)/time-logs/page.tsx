// src/app/org/[id]/(auth)/time-logs/page.tsx
"use client"

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const TimelogsPage = () => {
  const { id: org_id }=useParams()
  const [timelogs, setTimelogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError(data.error || 'Failed to fetch timelogs.');
      }
    } catch (error) {
      setLoading(false);
      throw new Error('Failed to fetch timelogs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <h1 style={{ fontSize: '24px' }}>Timelogs</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {timelogs && timelogs.length > 0 ? (
            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Start Time</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>End Time</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Active Time (seconds)</th>
                </tr>
              </thead>
              <tbody>
                {timelogs.map((timelog) => (
                  <tr key={timelog.start_time}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {new Date(timelog.start_time).toLocaleString()}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {new Date(timelog.end_time).toLocaleString()}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {timelog.total_active_time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No timelogs found.</p>
          )}
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TimelogsPage;
