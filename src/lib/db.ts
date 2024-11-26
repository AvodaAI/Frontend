// @ts-nocheck
// src/lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: '95.217.7.150',
  port: 5432,
  user: 'postgres',
  password: 'NbvKSY7Z0bF632qtN7afz4X2y6GO0kEihVjGRk4Pm7yUBoXSjfKdSr7zPDWihrmB',
  database: 'tests',
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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createEmployeesTable = `
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        position VARCHAR(255) NOT NULL,
        hire_date DATE NOT NULL,
        city VARCHAR(255),
        country VARCHAR(255)
      );
    `;

    try {
      await this.query(createUsersTable);
      await this.query(createEmployeesTable);
      console.log('Tables initialized successfully');
    } catch (error) {
      console.error('Error initializing tables:', error);
      throw error;
    }
  },

  pool
};

export default db;
