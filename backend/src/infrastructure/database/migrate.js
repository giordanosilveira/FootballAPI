require('dotenv').config();

const fs = require('fs');
const path = require('path');
const db = require('./connection');

async function runMigrations() {
  // Cria a tabela de controle se não existir
  // Ela guarda quais migrations já foram executadas
  await db.none(`
    CREATE TABLE IF NOT EXISTS migrations (
      id         SERIAL PRIMARY KEY,
      filename   VARCHAR(255) UNIQUE NOT NULL,
      run_at     TIMESTAMP DEFAULT NOW()
    )
  `);

  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).sort(); // sort garante a ordem

  for (const file of files) {
    // Verifica se essa migration já foi executada
    const already = await db.oneOrNone(
      'SELECT id FROM migrations WHERE filename = $1',
      [file]
    );

    if (already) {
      console.log(`⏭  Já executada: ${file}`);
      continue;
    }

    // Lê e executa o SQL
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    await db.none(sql);

    // Registra na tabela de controle
    await db.none(
      'INSERT INTO migrations (filename) VALUES ($1)',
      [file]
    );

    console.log(`✅ Executada: ${file}`);
  }

  console.log('Migrations concluídas!');
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('Erro nas migrations:', err);
  process.exit(1);
});