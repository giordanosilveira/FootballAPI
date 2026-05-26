const test = require('node:test');
const assert = require('node:assert/strict');

const GetById = require('../../../src/application/use-cases/shared/GetById');
const ValidationError = require('../../../src/domain/errors/ValidationError');
const NotFoundError = require('../../../src/domain/errors/NotFoundError');

test('GetById validates default integer id and returns entity', async () => {
    const repository = {
        findById: async (id) => ({ id, name: 'entity' }),
    };

    const useCase = new GetById(repository, { resourceName: 'Country' });
    const result = await useCase.execute(10);

    assert.deepEqual(result, { id: 10, name: 'entity' });
});

test('GetById throws default validation errors', async () => {
    const repository = {
        findById: async () => null,
    };

    const useCase = new GetById(repository, { resourceName: 'Country' });

    await assert.rejects(() => useCase.execute(), ValidationError);
    await assert.rejects(() => useCase.execute('10'), ValidationError);
});

test('GetById throws NotFoundError with configured resource name', async () => {
    const repository = {
        findById: async () => null,
    };

    const useCase = new GetById(repository, { resourceName: 'League' });

    await assert.rejects(
        () => useCase.execute(99),
        (error) => error instanceof NotFoundError && error.message === "League '99' not found"
    );
});

test('GetById accepts custom validation strategy for non-integer ids', async () => {
    const repository = {
        findById: async (id) => ({ id, slug: 'premier-league' }),
    };

    const validateSlugId = (id) => {
        if (typeof id !== 'string' || id.length < 3) {
            throw new ValidationError('ID must be a slug string');
        }
    };

    const useCase = new GetById(repository, {
        resourceName: 'League',
        validateId: validateSlugId,
    });

    await assert.rejects(() => useCase.execute(123), ValidationError);
    await assert.deepEqual(await useCase.execute('epl'), { id: 'epl', slug: 'premier-league' });
});
