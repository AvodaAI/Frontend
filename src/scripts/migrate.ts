//src/scripts/migrate.ts
const fs = require('fs').promises;
const path = require('path');
const db = require('@/lib/db');
import { log } from "@/utils/logger";

interface Employee {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  position: string;
  city?: string;
  country?: string;
  hire_date: string;
  created_at?: string;
}

interface User {
  id: string;
  email: string;
  password: string;
}

async function readJsonFile(filePath: string): Promise<any[]> {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

async function migrateEmployees() {
  const employees: Employee[] = await readJsonFile(path.join(process.cwd(), 'src/app/data/employees.json'));
  
  for (const employee of employees) {
    try {
      await db.query(
        `INSERT INTO users (first_name, last_name, email, position, city, country, hire_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (email) DO UPDATE SET
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         position = EXCLUDED.position,
         city = EXCLUDED.city,
         country = EXCLUDED.country,
         hire_date = EXCLUDED.hire_date`,
        [
          employee.first_name,
          employee.last_name,
          employee.email,
          employee.position,
          employee.city || null,
          employee.country || null,
          employee.hire_date
        ]
      );
      log(`Migrated employee: ${employee.email}`);
    } catch (error) {
      log(`Error migrating employee ${employee.email}:`, error);
    }
  }
}

async function migrateUsers() {
  const users: User[] = await readJsonFile(path.join(process.cwd(), 'src/app/data/users.json'));
  
  for (const user of users) {
    try {
      await db.query(
        `INSERT INTO users (email, password)
         VALUES ($1, $2)
         ON CONFLICT (email) DO UPDATE SET
         password = EXCLUDED.password`,
        [user.email, user.password]
      );
      log(`Migrated user: ${user.email}`);
    } catch (error) {
      log(`Error migrating user ${user.email}:`, error);
    }
  }
}

async function verifyMigration() {
  log('Verifying migration...');
  
  const jsonEmployees = await readJsonFile(path.join(process.cwd(), 'src/app/data/employees.json'));
  
  // Check if data exists in the database
  const dbEmployees = await db.query('SELECT * FROM users WHERE email IS NOT NULL');
  
  // Compare counts
  // Compare counts
  const jsonCount = jsonEmployees.length;
  const dbCount = dbEmployees.rows.length;
  log(`JSON employees: ${jsonCount}, DB users: ${dbCount}`);

  if (jsonCount !== dbCount) {
    throw new Error(`Migration verification failed: Count mismatch (JSON: ${jsonCount}, DB: ${dbCount})`);
  }
  return true;
}

async function main() {
  try {
    log('Starting migration...');
    await db.initializeTables();
    
    log('Migrating employees...');
    await migrateEmployees();
    
    log('Migrating users...');
    await migrateUsers();
    
    log('Verifying migration...');
    await verifyMigration();
    
    log('Migration completed.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (db.pool) {
      await db.pool.end();
    }
  }
}

main();
