require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./infrastructure/database/connection'); // importa a conexão

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor rodando!' });
});

// Rota temporária para testar o banco — vamos remover depois
app.get('/health/db', async (req, res) => {
  try {
    await db.one('SELECT 1');
    res.json({ status: 'ok', message: 'Banco conectado!' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// O listen sempre por último
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});