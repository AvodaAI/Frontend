//src/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  host: '95.217.7.150',
  port: 5432,
  user: 'postgres',
  password: 'NbvKSY7Z0bF632qtN7afz4X2y6GO0kEihVjGRk4Pm7yUBoXSjfKdSr7zPDWihrmB',
  database: 'tests',
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
