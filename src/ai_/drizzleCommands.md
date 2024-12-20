- drizzle-kit generate: lets you generate SQL migration files based on your Drizzle schema either upon declaration or on subsequent changes.
- drizzle-kit migrate: lets you apply generated SQL migration files to your database.
- drizzle-kit pull: lets you pull(introspect) database schema, convert it to Drizzle schema and save it to your codebase.
- drizzle-kit push: lets you push your Drizzle schema to database either upon declaration or on subsequent schema changes.
- drizzle-kit studio: will connect to your database and spin up proxy server for Drizzle Studio which you can use for convenient database browsing.
- drizzle-kit check: will walk through all generate migrations and check for any race conditions(collisions) of generated migrations.
- drizzle-kit up: used to upgrade snapshots of previously generated migrations.