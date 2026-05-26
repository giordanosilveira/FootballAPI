const test = require('node:test');
const assert = require('node:assert/strict');

const countryQueries = require('../../../src/infrastructure/database/queries/countryQueries');

test('country queries expose the expected SQL statements', () => {
    assert.ok(countryQueries.findAll.includes('FROM countries'));
    assert.ok(countryQueries.findById.includes('WHERE id = $1'));
    assert.ok(countryQueries.findByField.includes('$1:name'));
    assert.ok(countryQueries.save.includes('ON CONFLICT (code)'));
    assert.ok(countryQueries.update.includes('UPDATE countries'));
    assert.ok(countryQueries.delete.includes('DELETE FROM countries'));
    assert.ok(countryQueries.exists.includes('SELECT EXISTS'));
    assert.ok(countryQueries.count.includes('COUNT(*)'));
});