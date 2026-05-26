const test = require('node:test');
const assert = require('node:assert/strict');

const CreateCountry = require('../src/application/use-cases/country/CreateCountry');
const GetAllCountries = require('../src/application/use-cases/country/GetAllCountries');
const GetCountryByCode = require('../src/application/use-cases/country/GetCountryByCode');
const GetCountryById = require('../src/application/use-cases/country/GetCountryById');
const UpdateCountry = require('../src/application/use-cases/country/UpdateCountry');
const DeleteCountry = require('../src/application/use-cases/country/DeleteCountry');
const ValidationError = require('../src/domain/errors/ValidationError');
const NotFoundError = require('../src/domain/errors/NotFoundError');
const ConflictError = require('../src/domain/errors/ConflictError');

test('CreateCountry validates input', async () => {
    const repo = {
        findByCode: async () => null,
        create: async () => null,
    };
    const useCase = new CreateCountry(repo);

    await assert.rejects(() => useCase.execute({ name: '', code: 'BR' }), ValidationError);
    await assert.rejects(() => useCase.execute({ name: 'Brazil', code: '' }), ValidationError);
});

test('CreateCountry throws conflict when code already exists', async () => {
    let createCalls = 0;
    const repo = {
        findByCode: async () => ({ id: 1 }),
        create: async () => {
            createCalls += 1;
            return null;
        },
    };
    const useCase = new CreateCountry(repo);

    await assert.rejects(
        () => useCase.execute({ name: 'Brazil', code: 'BR', flag: 'br.svg' }),
        (error) => error instanceof ConflictError && error.message === "Country 'BR' already exists"
    );
    assert.equal(createCalls, 0);
});

test('CreateCountry creates a country when code is new', async () => {
    const createdCountry = { id: 1, name: 'Brazil', code: 'BR', flag: 'br.svg' };
    const repo = {
        findByCode: async () => null,
        create: async (payload) => ({ id: 1, ...payload }),
    };
    const useCase = new CreateCountry(repo);

    const result = await useCase.execute({ name: 'Brazil', code: 'BR', flag: 'br.svg' });

    assert.deepEqual(result, createdCountry);
});

test('GetAllCountries delegates to repository', async () => {
    const countries = [{ id: 1 }, { id: 2 }];
    const repo = {
        findAll: async () => countries,
    };
    const useCase = new GetAllCountries(repo);

    assert.deepEqual(await useCase.execute(), countries);
});

test('GetCountryByCode throws not found when missing', async () => {
    const repo = {
        findByCode: async () => null,
    };
    const useCase = new GetCountryByCode(repo);

    await assert.rejects(
        () => useCase.execute('ZZ'),
        (error) => error instanceof NotFoundError && error.statusCode === 404
    );
});

test('GetCountryById validates id and loads country', async () => {
    const repo = {
        findById: async (id) => (id === 10 ? { id: 10, name: 'Brazil' } : null),
    };
    const useCase = new GetCountryById(repo);

    await assert.rejects(() => useCase.execute(), ValidationError);
    await assert.rejects(() => useCase.execute('10'), ValidationError);
    await assert.deepEqual(await useCase.execute(10), { id: 10, name: 'Brazil' });
});

test('GetCountryById throws not found when id is missing from repo', async () => {
    const repo = {
        findById: async () => null,
    };
    const useCase = new GetCountryById(repo);

    await assert.rejects(() => useCase.execute(99), NotFoundError);
});

test('UpdateCountry validates and delegates to repository', async () => {
    const repo = {
        findById: async (id) => (id === 1 ? { id: 1 } : null),
        update: async (id, payload) => ({ id, ...payload }),
    };
    const useCase = new UpdateCountry(repo);

    await assert.rejects(() => useCase.execute(undefined, {}), ValidationError);
    await assert.rejects(() => useCase.execute('1', {}), ValidationError);
    await assert.rejects(() => useCase.execute(99, {}), NotFoundError);
    await assert.deepEqual(await useCase.execute(1, { name: 'Portugal', code: 'PT', flag: 'pt.svg' }), {
        id: 1,
        name: 'Portugal',
        code: 'PT',
        flag: 'pt.svg',
    });
});

test('DeleteCountry validates and deletes existing country', async () => {
    const repo = {
        findById: async (id) => (id === 1 ? { id: 1 } : null),
        delete: async () => true,
    };
    const useCase = new DeleteCountry(repo);

    await assert.rejects(() => useCase.execute(undefined), ValidationError);
    await assert.rejects(() => useCase.execute('1'), ValidationError);
    await assert.rejects(() => useCase.execute(99), NotFoundError);
    await assert.equal(await useCase.execute(1), undefined);
});