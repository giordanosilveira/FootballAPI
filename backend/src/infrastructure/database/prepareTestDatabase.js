require('dotenv').config();

const pgp = require('pg-promise')();
const { Client } = require('pg');
const runMigrations = require('./runMigrations');

function getTestDbName() {
  return process.env.DB_NAME_TEST || `${process.env.DB_NAME}_test`;
}

function assertSafeDbName(dbName) {
  if (!/^[a-zA-Z0-9_]+$/.test(dbName)) {
    throw new Error(`Invalid DB name: ${dbName}`);
  }
}

async function ensureDatabaseExists() {
  const testDbName = getTestDbName();
  assertSafeDbName(testDbName);

  const adminClient = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_ADMIN_NAME || 'postgres',
  });

  await adminClient.connect();

  const dbExists = await adminClient.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [testDbName]
  );

  if (dbExists.rowCount === 0) {
    await adminClient.query(`CREATE DATABASE ${testDbName}`);
    console.log(`Database created: ${testDbName}`);
  } else {
    console.log(`Database already exists: ${testDbName}`);
  }

  await adminClient.end();
}

async function migrateTestDatabase() {
  const testDbName = getTestDbName();

  const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: testDbName,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await runMigrations(db);
  await pgp.end();

  console.log(`Test database ready: ${testDbName}`);
}

async function main() {
  await ensureDatabaseExists();
  await migrateTestDatabase();
}

main().catch((error) => {
  console.error('Failed to prepare test database:', error);
  process.exit(1);
});
