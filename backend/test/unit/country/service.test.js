const test = require('node:test');
const assert = require('node:assert/strict');

const CountryService = require('../../../src/application/services/CountryService');

test('CountryService delegates to use-cases', async () => {
    const repo = {
        findByCode: async () => ({ id: 1, code: 'BR' }),
        findAll: async () => [{ id: 1 }],
        findById: async () => ({ id: 1 }),
        create: async (payload) => ({ id: 1, ...payload }),
        update: async (id, payload) => ({ id, ...payload }),
        delete: async () => true,
    };

    const service = new CountryService(repo);

    assert.deepEqual(await service.getAll(), [{ id: 1 }]);
    assert.deepEqual(await service.getByCode('BR'), { id: 1, code: 'BR' });
});

test('CountryService create/update/delete flow works', async () => {
    const repo = {
        findByCode: async () => null,
        findAll: async () => [{ id: 1 }],
        findById: async (id) => (id === 1 ? { id: 1 } : null),
        create: async (payload) => ({ id: 1, ...payload }),
        update: async (id, payload) => ({ id, ...payload }),
        delete: async () => true,
    };

    const service = new CountryService(repo);

    await assert.deepEqual(await service.create({ name: 'Brazil', code: 'BR' }), {
        id: 1,
        name: 'Brazil',
        code: 'BR',
        flag: undefined,
    });
    await assert.deepEqual(await service.getById(1), { id: 1 });
    await assert.deepEqual(await service.update(1, { name: 'Portugal', code: 'PT' }), {
        id: 1,
        name: 'Portugal',
        code: 'PT',
        flag: undefined,
    });
    await assert.equal(await service.delete(1), undefined);
});