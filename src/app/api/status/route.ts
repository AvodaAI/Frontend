//src/app/api/status/route.ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import db from '@/lib/db'

const app = new Hono()

app.get('/api/status', async (c) => {
  try {
    const status = await db.checkConnection();
    return c.json(status);
  } catch (error) {
    return c.json(
      { isConnected: false, lastChecked: new Date().toISOString() },
      { status: 500 }
    );
  }
}

);

export const GET = handle(app)