const test = require('node:test');
const assert = require('node:assert/strict');

const db = require('../src/infrastructure/database/connection');
const BaseRepository = require('../src/infrastructure/repositories/BaseRepository');
const CountryRepository = require('../src/infrastructure/repositories/CountryRepository');

function withDbStub(stubbedMethods, fn) {
    const original = {};

    for (const [method, implementation] of Object.entries(stubbedMethods)) {
        original[method] = db[method];
        db[method] = implementation;
    }

    return Promise.resolve(fn()).finally(() => {
        for (const [method, implementation] of Object.entries(original)) {
            db[method] = implementation;
        }
    });
}

test('BaseRepository basic operations use the database layer correctly', async () => {
    const repo = new BaseRepository({
        findAll: 'SELECT * FROM items',
        findById: 'SELECT * FROM items WHERE id = $1',
        findByField: 'SELECT * FROM items WHERE $1:name = $2',
        save: 'INSERT INTO items(name) VALUES($1) RETURNING *',
        update: 'UPDATE items SET name = $2 WHERE id = $1 RETURNING *',
        delete: 'DELETE FROM items WHERE id = $1',
        exists: 'SELECT EXISTS(SELECT 1 FROM items WHERE id = $1)',
        count: 'SELECT COUNT(*) FROM items',
    });

    repo.toEntity = (row) => row;

    await withDbStub(
        {
            manyOrNone: async () => [{ id: 1 }, { id: 2 }],
            oneOrNone: async (query) => {
                if (query.startsWith('SELECT * FROM items WHERE id = $1')) {
                    return { id: 1 };
                }

                if (query.startsWith('UPDATE items SET name = $2 WHERE id = $1')) {
                    return { id: 1, name: 'Brazil' };
                }

                return null;
            },
            one: async (query) => {
                if (query.startsWith('INSERT INTO items(name) VALUES($1) RETURNING *')) {
                    return { id: 3, name: 'Portugal' };
                }

                if (query.startsWith('SELECT EXISTS')) {
                    return { exists: true };
                }

                if (query.startsWith('SELECT COUNT(*)')) {
                    return { count: 3 };
                }

                return { id: 3, name: 'Portugal' };
            },
            result: async () => ({ rowCount: 1 }),
        },
        async () => {
            assert.deepEqual(await repo.findAll(), [{ id: 1 }, { id: 2 }]);
            assert.deepEqual(await repo.findById(1), { id: 1 });
            assert.deepEqual(await repo.findByField('name', 'Portugal'), [{ id: 1 }, { id: 2 }]);
            assert.deepEqual(await repo.save({ name: 'Portugal' }), { id: 3, name: 'Portugal' });
            assert.deepEqual(await repo.update(1, { name: 'Brazil' }), { id: 1, name: 'Brazil' });
            assert.equal(await repo.delete(1), true);
            assert.equal(await repo.exists(1), true);
            assert.equal(await repo.count(), 3);
        }
    );
});

test('BaseRepository rejects disallowed find fields', async () => {
    const repo = new BaseRepository({
        findByField: 'SELECT * FROM items WHERE $1:name = $2',
    }, {
        allowedFindFields: ['name'],
    });

    await assert.rejects(() => repo.findByField('code', 'BR'), /Field not allowed/);
});

test('CountryRepository maps entity and persistence correctly', () => {
    const repo = new CountryRepository();

    assert.equal(typeof repo.findByCode, 'function');

    const entity = repo.toEntity({
        id: 1,
        name: 'Brazil',
        code: 'BR',
        flag: 'br.svg',
        created_at: '2026-01-01',
        updated_at: '2026-01-02',
    });

    assert.equal(entity.name, 'Brazil');
    assert.equal(entity.code, 'BR');
    assert.equal(entity.flag, 'br.svg');

    assert.deepEqual(repo.toPersistence({ name: 'Brazil', code: 'BR', flag: 'br.svg' }), ['Brazil', 'BR', 'br.svg']);
});

test('CountryRepository findByCode returns first matching country', async () => {
    const repo = new CountryRepository();

    await withDbStub(
        {
            manyOrNone: async () => [
                { id: 1, name: 'Brazil', code: 'BR', flag: 'br.svg' },
                { id: 2, name: 'Portugal', code: 'PT', flag: 'pt.svg' },
            ],
        },
        async () => {
            const country = await repo.findByCode('BR');

            assert.equal(country.name, 'Brazil');
            assert.equal(country.code, 'BR');
        }
    );
});