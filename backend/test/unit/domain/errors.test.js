const test = require('node:test');
const assert = require('node:assert/strict');

const AppError = require('../../../src/domain/errors/AppError');
const ConflictError = require('../../../src/domain/errors/ConflictError');
const NotFoundError = require('../../../src/domain/errors/NotFoundError');
const ValidationError = require('../../../src/domain/errors/ValidationError');

test('AppError stores message and status code', () => {
    const error = new AppError('boom');

    assert.equal(error.message, 'boom');
    assert.equal(error.statusCode, 500);
    assert.equal(error.name, 'AppError');
});

test('ConflictError formats message and status code', () => {
    const error = new ConflictError('Country', 'BR');

    assert.equal(error.message, "Country 'BR' already exists");
    assert.equal(error.statusCode, 409);
    assert.equal(error.resource, 'Country');
    assert.equal(error.identifier, 'BR');
});

test('NotFoundError formats message and status code', () => {
    const error = new NotFoundError('Country', 10);

    assert.equal(error.message, "Country '10' not found");
    assert.equal(error.statusCode, 404);
    assert.equal(error.resource, 'Country');
    assert.equal(error.identifier, 10);
});

test('ValidationError stores bad request code', () => {
    const error = new ValidationError('Invalid data');

    assert.equal(error.message, 'Invalid data');
    assert.equal(error.statusCode, 400);
});