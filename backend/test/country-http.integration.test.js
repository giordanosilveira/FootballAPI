const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const request = require('supertest');

const CountryController = require('../src/infrastructure/http/controllers/CountryController');
const createCountryRoutes = require('../src/infrastructure/http/routes/countryRoutes');

function makeApp(countryService) {
    const app = express();
    app.use(express.json());

    const controller = new CountryController({ countryService });
    app.use('/countries', createCountryRoutes(controller));

    return app;
}

function makeHttpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

test('POST /countries returns 201 and created payload', async () => {
    const app = makeApp({
        create: async (payload) => ({ id: 1, ...payload }),
        getAll: async () => [],
        getByCode: async () => null,
        getById: async () => null,
        update: async () => null,
        delete: async () => null,
    });

    const response = await request(app)
        .post('/countries')
        .send({ name: 'Brazil', code: 'BR', flag: 'br.svg' });

    assert.equal(response.status, 201);
    assert.deepEqual(response.body, {
        id: 1,
        name: 'Brazil',
        code: 'BR',
        flag: 'br.svg',
    });
});

test('GET /countries returns 200 with list', async () => {
    const app = makeApp({
        create: async () => null,
        getAll: async () => [{ id: 1, name: 'Brazil', code: 'BR' }],
        getByCode: async () => null,
        getById: async () => null,
        update: async () => null,
        delete: async () => null,
    });

    const response = await request(app).get('/countries');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, [{ id: 1, name: 'Brazil', code: 'BR' }]);
});

test('GET /countries/code/:code returns 200 and country', async () => {
    const app = makeApp({
        create: async () => null,
        getAll: async () => [],
        getByCode: async (code) => ({ id: 1, code }),
        getById: async () => null,
        update: async () => null,
        delete: async () => null,
    });

    const response = await request(app).get('/countries/code/BR');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { id: 1, code: 'BR' });
});

test('GET /countries/:id converts id to number and returns 200', async () => {
    let receivedId;
    const app = makeApp({
        create: async () => null,
        getAll: async () => [],
        getByCode: async () => null,
        getById: async (id) => {
            receivedId = id;
            return { id, name: 'Brazil' };
        },
        update: async () => null,
        delete: async () => null,
    });

    const response = await request(app).get('/countries/42');

    assert.equal(response.status, 200);
    assert.equal(receivedId, 42);
    assert.deepEqual(response.body, { id: 42, name: 'Brazil' });
});

test('PUT /countries/:id returns 200 with updated payload', async () => {
    const app = makeApp({
        create: async () => null,
        getAll: async () => [],
        getByCode: async () => null,
        getById: async () => null,
        update: async (id, payload) => ({ id, ...payload }),
        delete: async () => null,
    });

    const response = await request(app)
        .put('/countries/5')
        .send({ name: 'Portugal', code: 'PT', flag: 'pt.svg' });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
        id: 5,
        name: 'Portugal',
        code: 'PT',
        flag: 'pt.svg',
    });
});

test('DELETE /countries/:id returns 204', async () => {
    const app = makeApp({
        create: async () => null,
        getAll: async () => [],
        getByCode: async () => null,
        getById: async () => null,
        update: async () => null,
        delete: async () => true,
    });

    const response = await request(app).delete('/countries/1');

    assert.equal(response.status, 204);
    assert.equal(response.text, '');
});

test('controller propagates statusCode on domain errors', async () => {
    const app = makeApp({
        create: async () => {
            throw makeHttpError('Country already exists', 409);
        },
        getAll: async () => [],
        getByCode: async () => null,
        getById: async () => null,
        update: async () => null,
        delete: async () => null,
    });

    const response = await request(app)
        .post('/countries')
        .send({ name: 'Brazil', code: 'BR' });

    assert.equal(response.status, 409);
    assert.deepEqual(response.body, { message: 'Country already exists' });
});

test('controller uses fallback 500 when statusCode is missing', async () => {
    const app = makeApp({
        create: async () => {
            throw new Error('unexpected');
        },
        getAll: async () => [],
        getByCode: async () => null,
        getById: async () => null,
        update: async () => null,
        delete: async () => null,
    });

    const response = await request(app)
        .post('/countries')
        .send({ name: 'Brazil', code: 'BR' });

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, { message: 'unexpected' });
});
