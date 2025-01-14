// @ts-nocheck
// src/lib/db.ts
import { Pool } from 'pg';
import { log } from '@/utils/logger';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = {
  async checkConnection() {
    try {
      const client = await pool.connect();
      client.release();
      return { isConnected: true, lastChecked: new Date().toISOString() };
    } catch (error) {
      return { isConnected: false, lastChecked: new Date().toISOString() };
    }
  },

  async query(text, params = []) {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      } catch (error) {
        log('Database query error:', error);
        throw error;
      throw error;
    }
  },

  pool
};

export default db;
