const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

test('server boots without throwing', () => {
    const result = spawnSync(
        process.execPath,
        ['-e', "require('./src/server'); setTimeout(() => process.exit(0), 200)"],
        {
            cwd: path.resolve(__dirname, '../../..'),
            env: {
                ...process.env,
                PORT: '0',
            },
            encoding: 'utf8',
        }
    );

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Servidor rodando/);
});