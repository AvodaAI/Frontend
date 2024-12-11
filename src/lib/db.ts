// @ts-nocheck
// src/lib/db.ts
import { Pool } from 'pg';

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
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  async initializeTables() {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        position VARCHAR(255),
        hire_date DATE,
        city VARCHAR(255),
        country VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await this.query(createUsersTable);
      console.log('Tables initialized successfully');
    } catch (error) {
      console.error('Error initializing tables:', error);
      throw error;
    }
  },

  pool
};

export default db;
