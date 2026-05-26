const test = require('node:test');
const assert = require('node:assert/strict');

const createCountryRoutes = require('../../../src/infrastructure/http/routes/countryRoutes');

test('country routes register the expected endpoints', () => {
    const controller = {
        create() {},
        getAll() {},
        getByCode() {},
        getById() {},
        update() {},
        delete() {},
    };

    const router = createCountryRoutes(controller);
    const routes = router.stack
        .filter((layer) => layer.route)
        .map((layer) => ({
            path: layer.route.path,
            methods: Object.keys(layer.route.methods),
        }));

    assert.deepEqual(routes, [
        { path: '/', methods: ['post'] },
        { path: '/', methods: ['get'] },
        { path: '/code/:code', methods: ['get'] },
        { path: '/:id', methods: ['get'] },
        { path: '/:id', methods: ['put'] },
        { path: '/:id', methods: ['delete'] },
    ]);
});