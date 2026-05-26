require('dotenv').config();

const db = require('./connection');
const runMigrations = require('./runMigrations');

async function migrate() {
  await runMigrations(db);

  console.log('Migrations concluídas!');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Erro nas migrations:', err);
  process.exit(1);
});