const test = require('node:test');
const assert = require('node:assert/strict');

const CountryController = require('../src/infrastructure/http/controllers/CountryController');
const { createMockResponse } = require('./helpers');

test('CountryController returns expected status codes and payloads', async () => {
    const countryService = {
        create: async (payload) => ({ id: 1, ...payload }),
        getAll: async () => [{ id: 1 }],
        getByCode: async (code) => ({ id: 1, code }),
        getById: async (id) => ({ id, name: 'Brazil' }),
        update: async (id, payload) => ({ id, ...payload }),
        delete: async () => true,
    };

    const controller = new CountryController({ countryService });

    const createRes = createMockResponse();
    await controller.create({ body: { name: 'Brazil', code: 'BR' } }, createRes);
    assert.equal(createRes.statusCode, 201);
    assert.deepEqual(createRes.body, { id: 1, name: 'Brazil', code: 'BR' });

    const getAllRes = createMockResponse();
    await controller.getAll({}, getAllRes);
    assert.equal(getAllRes.statusCode, 200);
    assert.deepEqual(getAllRes.body, [{ id: 1 }]);

    const codeRes = createMockResponse();
    await controller.getByCode({ params: { code: 'BR' } }, codeRes);
    assert.equal(codeRes.statusCode, 200);
    assert.deepEqual(codeRes.body, { id: 1, code: 'BR' });

    const idRes = createMockResponse();
    await controller.getById({ params: { id: '1' } }, idRes);
    assert.equal(idRes.statusCode, 200);
    assert.deepEqual(idRes.body, { id: 1, name: 'Brazil' });

    const updateRes = createMockResponse();
    await controller.update({ params: { id: '1' }, body: { name: 'Portugal' } }, updateRes);
    assert.equal(updateRes.statusCode, 200);
    assert.deepEqual(updateRes.body, { id: 1, name: 'Portugal' });

    const deleteRes = createMockResponse();
    await controller.delete({ params: { id: '1' } }, deleteRes);
    assert.equal(deleteRes.statusCode, 204);
    assert.equal(deleteRes.body, undefined);
});

test('CountryController preserves error status code', async () => {
    const countryService = {
        create: async () => {
            const error = new Error('bad request');
            error.statusCode = 400;
            throw error;
        },
        getAll: async () => [],
        getByCode: async () => null,
        getById: async () => null,
        update: async () => null,
        delete: async () => null,
    };

    const controller = new CountryController({ countryService });
    const response = createMockResponse();

    await controller.create({ body: {} }, response);

    assert.equal(response.statusCode, 400);
    assert.deepEqual(response.body, { message: 'bad request' });
});