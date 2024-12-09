// src/app/status/page.tsx
'use server';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';
import db from '@/lib/db';
import SupabaseStatus from '@/utils/supabase/status';
import { Container } from '@components/container';
import { Section } from '@components/section';
export default async function StatusPage() {
  const status = await db.checkConnection();
  const supabaseStatus = await SupabaseStatus.checkConnection();


  return (
    <Container className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant={status.isConnected ? "default" : "destructive"} className="relative">
            <div className="flex items-center justify-center gap-4">
              {status.isConnected ? (
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              )}
              <div className="space-y-1">
                <AlertTitle className="font-semibold">
                  {status.isConnected ? "Database Connection: All Systems Operational" : "Database Connection: System Issues Detected"}
                </AlertTitle>
                <AlertDescription className="text-sm opacity-90">
                  Last checked: {new Date(status.lastChecked).toLocaleString()}
                </AlertDescription>
              </div>
            </div>
          </Alert>
          <Alert variant={status.isConnected ? "default" : "destructive"} className="relative">
            <div className="flex items-center justify-center gap-4">
              {status.isConnected ? (
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              )}
              <div className="space-y-1">
                <AlertTitle className="font-semibold">
                  {supabaseStatus.isConnected ? "Supabase Connection: All Systems Operational" : "Supabase Connection: System Issues Detected"}
                </AlertTitle>
                <AlertDescription className="text-sm opacity-90">
                  Last checked: {new Date(supabaseStatus.lastChecked).toLocaleString()}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </CardContent>
      </Card>
    </Container>
  );
}
