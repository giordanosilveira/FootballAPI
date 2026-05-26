const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

require('dotenv').config();

const originalDbName = process.env.DB_NAME;
const testDbName = process.env.DB_NAME_TEST || `${process.env.DB_NAME}_test`;
process.env.DB_NAME = testDbName;

const db = require('../../../src/infrastructure/database/connection');
const createApp = require('../../../src/app');

let app;

async function resetCountriesTable() {
    await db.none('TRUNCATE TABLE countries RESTART IDENTITY CASCADE');
}

test.before(async () => {
    app = createApp();
    await resetCountriesTable();
});

test.after(async () => {
    await resetCountriesTable();
    process.env.DB_NAME = originalDbName;
});

test.beforeEach(async () => {
    await resetCountriesTable();
});

test('POST /countries persists data in database', async () => {
    const response = await request(app)
        .post('/countries')
        .send({ name: 'Brazil', code: 'BR', flag: 'br.svg' });

    assert.equal(response.status, 201);
    assert.equal(response.body.name, 'Brazil');
    assert.equal(response.body.code, 'BR');

    const row = await db.one('SELECT name, code, flag FROM countries WHERE code = $1', ['BR']);
    assert.equal(row.name, 'Brazil');
    assert.equal(row.code, 'BR');
    assert.equal(row.flag, 'br.svg');
});

test('GET /countries returns rows from database', async () => {
    await db.none(
        'INSERT INTO countries (name, code, flag, updated_at) VALUES ($1, $2, $3, NOW())',
        ['Brazil', 'BR', 'br.svg']
    );

    const response = await request(app).get('/countries');

    assert.equal(response.status, 200);
    assert.equal(response.body.length, 1);
    assert.equal(response.body[0].code, 'BR');
});

test('GET /countries/code/:code returns the requested row', async () => {
    await db.none(
        'INSERT INTO countries (name, code, flag, updated_at) VALUES ($1, $2, $3, NOW())',
        ['Portugal', 'PT', 'pt.svg']
    );

    const response = await request(app).get('/countries/code/PT');

    assert.equal(response.status, 200);
    assert.equal(response.body.name, 'Portugal');
    assert.equal(response.body.code, 'PT');
});

test('PUT /countries/:id updates row in database', async () => {
    const created = await db.one(
        'INSERT INTO countries (name, code, flag, updated_at) VALUES ($1, $2, $3, NOW()) RETURNING id',
        ['Brazil', 'BR', 'br.svg']
    );

    const response = await request(app)
        .put(`/countries/${created.id}`)
        .send({ name: 'Brasil', code: 'BR', flag: 'brazil.svg' });

    assert.equal(response.status, 200);
    assert.equal(response.body.name, 'Brasil');
    assert.equal(response.body.flag, 'brazil.svg');

    const row = await db.one('SELECT name, flag FROM countries WHERE id = $1', [created.id]);
    assert.equal(row.name, 'Brasil');
    assert.equal(row.flag, 'brazil.svg');
});

test('DELETE /countries/:id removes row from database', async () => {
    const created = await db.one(
        'INSERT INTO countries (name, code, flag, updated_at) VALUES ($1, $2, $3, NOW()) RETURNING id',
        ['Argentina', 'AR', 'ar.svg']
    );

    const response = await request(app).delete(`/countries/${created.id}`);

    assert.equal(response.status, 204);

    const rows = await db.manyOrNone('SELECT id FROM countries WHERE id = $1', [created.id]);
    assert.equal(rows.length, 0);
});

test('POST /countries returns 409 on duplicated code', async () => {
    await db.none(
        'INSERT INTO countries (name, code, flag, updated_at) VALUES ($1, $2, $3, NOW())',
        ['Brazil', 'BR', 'br.svg']
    );

    const response = await request(app)
        .post('/countries')
        .send({ name: 'Brasil', code: 'BR', flag: 'brazil.svg' });

    assert.equal(response.status, 409);
    assert.match(response.body.message, /already exists/i);
});

test('GET /countries/:id returns 404 when country does not exist', async () => {
    const response = await request(app).get('/countries/9999');

    assert.equal(response.status, 404);
    assert.match(response.body.message, /not found/i);
});
