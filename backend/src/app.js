const express = require('express');
const cors = require('cors');
const db = require('./infrastructure/database/connection');
const CountryRepository = require('./infrastructure/repositories/CountryRepository');
const CountryService = require('./application/services/CountryService');
const CountryController = require('./infrastructure/http/controllers/CountryController');
const createCountryRoutes = require('./infrastructure/http/routes/countryRoutes');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const countryRepository = new CountryRepository();
  const countryService = new CountryService(countryRepository);
  const countryController = new CountryController({ countryService });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor rodando!' });
  });

  app.get('/health/db', async (req, res) => {
    try {
      await db.one('SELECT 1');
      res.json({ status: 'ok', message: 'Banco conectado!' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  app.use('/countries', createCountryRoutes(countryController));

  return app;
}

module.exports = createApp;
