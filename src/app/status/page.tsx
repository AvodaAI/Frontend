// src/app/status/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function StatusPage() {
  const [status, setStatus] = useState<{ isConnected: boolean; lastChecked: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error checking status:', error);
      setStatus({ isConnected: false, lastChecked: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 3 * 60 * 1000); // Check every 3 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">System Status</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          {status && (
            <Alert variant={status.isConnected ? "default" : "destructive"}>
              {status.isConnected ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {status.isConnected ? "Connected" : "Disconnected"}
              </AlertTitle>
              <AlertDescription>
                Last checked: {new Date(status.lastChecked).toLocaleString()}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
