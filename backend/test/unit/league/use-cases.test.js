const test = require('node:test');
const assert = require('node:assert/strict');

const CreateLeague = require('../../../src/application/use-cases/league/CreateLeague');
const GetAllLeagues = require('../../../src/application/use-cases/league/GetAllLeagues');
const GetLeagueById = require('../../../src/application/use-cases/league/GetLeagueById');
const GetLeagueByLeagueId = require('../../../src/application/use-cases/league/GetLeagueByLeagueId');
const UpdateLeague = require('../../../src/application/use-cases/league/UpdateLeague');
const DeleteLeague = require('../../../src/application/use-cases/league/DeleteLeague');
const ValidationError = require('../../../src/domain/errors/ValidationError');
const NotFoundError = require('../../../src/domain/errors/NotFoundError');
const ConflictError = require('../../../src/domain/errors/ConflictError');

test('CreateLeague validates required fields', async () => {
    const repo = {
        findByLeagueId: async () => null,
        create: async () => null,
    };

    const useCase = new CreateLeague(repo);

    await assert.rejects(() => useCase.execute({ name: 'Premier League', country_id: 1 }), ValidationError);
    await assert.rejects(() => useCase.execute({ leagueId: 39, country_id: 1 }), ValidationError);
    await assert.rejects(() => useCase.execute({ leagueId: 39, name: 'Premier League' }), ValidationError);
});

test('CreateLeague throws conflict when leagueId already exists', async () => {
    let createCalls = 0;
    const repo = {
        findByLeagueId: async () => ({ id: 1, leagueId: 39 }),
        create: async () => {
            createCalls += 1;
            return null;
        },
    };

    const useCase = new CreateLeague(repo);

    await assert.rejects(
        () => useCase.execute({ leagueId: 39, name: 'Premier League', country_id: 1 }),
        (error) => error instanceof ConflictError && error.message === "League '39' already exists"
    );

    assert.equal(createCalls, 0);
});

test('CreateLeague normalizes countryId to country_id before persisting', async () => {
    let receivedPayload;
    const repo = {
        findByLeagueId: async () => null,
        create: async (payload) => {
            receivedPayload = payload;
            return { id: 1, ...payload };
        },
    };

    const useCase = new CreateLeague(repo);

    const result = await useCase.execute({
        leagueId: 39,
        name: 'Premier League',
        type: 'League',
        logo: 'logo.svg',
        countryId: 44,
    });

    assert.equal(receivedPayload.country_id, 44);
    assert.equal(receivedPayload.countryId, undefined);
    assert.equal(result.id, 1);
    assert.equal(result.leagueId, 39);
});

test('GetAllLeagues delegates to repository', async () => {
    const repo = {
        findAll: async () => [{ id: 1 }],
    };

    const useCase = new GetAllLeagues(repo);
    assert.deepEqual(await useCase.execute(), [{ id: 1 }]);
});

test('GetLeagueById validates id and returns league', async () => {
    const repo = {
        findById: async (id) => (id === 1 ? { id: 1, name: 'Premier League' } : null),
    };

    const useCase = new GetLeagueById(repo);

    await assert.rejects(() => useCase.execute(), ValidationError);
    await assert.rejects(() => useCase.execute('1'), ValidationError);
    assert.deepEqual(await useCase.execute(1), { id: 1, name: 'Premier League' });
});

test('GetLeagueByLeagueId validates and throws not found when missing', async () => {
    const repo = {
        findByLeagueId: async () => null,
    };

    const useCase = new GetLeagueByLeagueId(repo);

    await assert.rejects(() => useCase.execute(), ValidationError);
    await assert.rejects(() => useCase.execute(123), NotFoundError);
});

test('GetLeagueByLeagueId returns league when found', async () => {
    const repo = {
        findByLeagueId: async (leagueId) => ({ leagueId, name: 'Premier League' }),
    };

    const useCase = new GetLeagueByLeagueId(repo);
    assert.deepEqual(await useCase.execute(39), { leagueId: 39, name: 'Premier League' });
});

test('UpdateLeague validates and updates existing league', async () => {
    const repo = {
        findById: async (id) => (id === 1 ? { id: 1 } : null),
        update: async (id, payload) => ({ id, ...payload }),
    };

    const useCase = new UpdateLeague(repo);

    await assert.rejects(() => useCase.execute(undefined, {}), ValidationError);
    await assert.rejects(() => useCase.execute('1', {}), ValidationError);
    await assert.rejects(() => useCase.execute(99, {}), NotFoundError);

    assert.deepEqual(
        await useCase.execute(1, { leagueId: 39, name: 'Premier League', country_id: 44 }),
        { id: 1, leagueId: 39, name: 'Premier League', country_id: 44 }
    );
});

test('DeleteLeague validates and deletes existing league', async () => {
    const repo = {
        findById: async (id) => (id === 1 ? { id: 1 } : null),
        delete: async () => true,
    };

    const useCase = new DeleteLeague(repo);

    await assert.rejects(() => useCase.execute(undefined), ValidationError);
    await assert.rejects(() => useCase.execute('1'), ValidationError);
    await assert.rejects(() => useCase.execute(99), NotFoundError);
    await assert.equal(await useCase.execute(1), undefined);
});
