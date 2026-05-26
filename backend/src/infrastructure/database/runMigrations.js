const fs = require('fs');
const path = require('path');

async function runMigrations(db, options = {}) {
  const migrationsDir = options.migrationsDir || path.join(__dirname, 'migrations');

  await db.none(`
    CREATE TABLE IF NOT EXISTS migrations (
      id         SERIAL PRIMARY KEY,
      filename   VARCHAR(255) UNIQUE NOT NULL,
      run_at     TIMESTAMP DEFAULT NOW()
    )
  `);

  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    const already = await db.oneOrNone(
      'SELECT id FROM migrations WHERE filename = $1',
      [file]
    );

    if (already) {
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    await db.none(sql);

    await db.none(
      'INSERT INTO migrations (filename) VALUES ($1)',
      [file]
    );
  }
}

module.exports = runMigrations;
