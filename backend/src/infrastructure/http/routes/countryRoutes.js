const express = require('express');

function createCountryRoutes(countryController) {
    const router = express.Router();

    router.post('/', countryController.create);
    router.get('/', countryController.getAll);
    router.get('/code/:code', countryController.getByCode);
    router.get('/:id', countryController.getById);
    router.put('/:id', countryController.update);
    router.delete('/:id', countryController.delete);

    return router;
}

module.exports = createCountryRoutes;
