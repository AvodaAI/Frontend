//src/db/migrate.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { join } from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
