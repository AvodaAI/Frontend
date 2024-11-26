//src/db/migrate.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { join } from 'path';

const pool = new Pool({
  host: '95.217.7.150',
  port: 5432,
  user: 'postgres',
  password: 'NbvKSY7Z0bF632qtN7afz4X2y6GO0kEihVjGRk4Pm7yUBoXSjfKdSr7zPDWihrmB',
  database: 'tests',
});

const db = drizzle(pool);

async function main() {
  console.log('Migration started...');
  await migrate(db, { migrationsFolder: join(__dirname, '../../drizzle') });
  console.log('Migration completed successfully');
  await pool.end();
}

main().catch((err) => {
  console.error('Migration failed', err);
  process.exit(1);
});
