const test = require('node:test');
const assert = require('node:assert/strict');

const Create = require('../../../src/application/use-cases/shared/Create');
const ValidationError = require('../../../src/domain/errors/ValidationError');
const ConflictError = require('../../../src/domain/errors/ConflictError');

test('Create validates object input by default', async () => {
    const repository = {
        findByField: async () => [],
        save: async (input) => ({ id: 1, ...input }),
    };

    const useCase = new Create(repository, {
        resourceName: 'Country',
        uniqueField: 'code',
    });

    await assert.rejects(() => useCase.execute(null), ValidationError);
    await assert.rejects(() => useCase.execute('invalid'), ValidationError);
});

test('Create throws conflict using uniqueField + findByField', async () => {
    const repository = {
        findByField: async (_field, value) => (value === 'BR' ? [{ id: 10, code: 'BR' }] : []),
        save: async (input) => ({ id: 1, ...input }),
    };

    const useCase = new Create(repository, {
        resourceName: 'Country',
        uniqueField: 'code',
    });

    await assert.rejects(
        () => useCase.execute({ name: 'Brazil', code: 'BR' }),
        (error) => error instanceof ConflictError && error.message === "Country 'BR' already exists"
    );
});

test('Create persists with save when no conflict', async () => {
    const repository = {
        findByField: async () => [],
        save: async (input) => ({ id: 1, ...input }),
    };

    const useCase = new Create(repository, {
        resourceName: 'Country',
        uniqueField: 'code',
    });

    const result = await useCase.execute({ name: 'Brazil', code: 'BR' });

    assert.deepEqual(result, { id: 1, name: 'Brazil', code: 'BR' });
});

test('Create supports custom unique lookup strategy', async () => {
    const repository = {
        findByCode: async (code) => (code === 'BR' ? { id: 10, code } : null),
        create: async (input) => ({ id: 1, ...input }),
    };

    const useCase = new Create(repository, {
        resourceName: 'Country',
        getUniqueValue: (input) => input.code,
        findExistingEntity: async (input, repo) => repo.findByCode(input.code),
    });

    await assert.rejects(
        () => useCase.execute({ name: 'Brazil', code: 'BR' }),
        (error) => error instanceof ConflictError
    );

    const created = await useCase.execute({ name: 'Portugal', code: 'PT' });
    assert.deepEqual(created, { id: 1, name: 'Portugal', code: 'PT' });
});
