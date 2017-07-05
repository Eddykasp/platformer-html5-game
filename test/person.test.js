var test = require('tape');
var Person = require('../js/person');

test('person constructor', t => {
    var p = new Person(0, 0);
    t.equal(p.px, 0);
    t.equal(p.py, 0);
    t.equal(p.xv, 0);
    t.equal(p.yv, 0);
    t.equal(p.onG, false);
    t.equal(p.c, '#ffffff');
    t.end();
});
