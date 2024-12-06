//src/app/api/status/route.ts
import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const status = await db.checkConnection();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { isConnected: false, lastChecked: new Date().toISOString() },
      { status: 500 }
    );
  }
}
