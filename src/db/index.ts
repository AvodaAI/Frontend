//src/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export async function checkConnection() {
  try {
    const client = await pool.connect();
    client.release();
    return { isConnected: true, lastChecked: new Date().toISOString() };
  } catch (error) {
    return { isConnected: false, lastChecked: new Date().toISOString() };
  }
}
