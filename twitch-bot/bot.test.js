const assert = require('assert');
const stdout = require("test-console").stdout;
const bot = require('./bot.js');

it('Should parse message', function () {
    const output = stdout.inspectSync(() => bot.message(null, null, "!HEAL - Show must go on!", false));
    assert.equal(1, output.length);
    assert.equal('EXT.events["0"] = "HEAL"\n', output[0]);
});

it('Dont should parse message - no command char', function () {
    const output = stdout.inspectSync(() => bot.message(null, null, "HEAL - Show must go on!", false));
    assert.equal(0, output.length);
});

it('Dont should parse message - incorrect command', function () {
    const output = stdout.inspectSync(() => bot.message(null, null, "!heal - Show must go on!", false));
    assert.equal(0, output.length);
});
