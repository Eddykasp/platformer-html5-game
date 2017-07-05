var test = require('tape');
var Person = require('../js/person');

test('person constructor', t => {
    var p = new Person(0, 0);
    t.equal(p.px, 0, 'x position');
    t.equal(p.py, 0, 'y position');
    t.equal(p.xv, 0, 'x velocity');
    t.equal(p.yv, 0, 'y velocity');
    t.equal(p.onG, false, 'is on ground');
    t.equal(p.c, '#ffffff', 'colour is default white');
    t.end();
});

test('person move positive x / positive y', t => {
    var p = new Person(0, 0);
    t.equal(p.px, 0, 'x position before moving');
    t.equal(p.py, 0, 'y position before moving');
    p.xv = 10;
    p.yv = 10;
    p.move();
    t.equal(p.px, 10, 'x position after moving');
    t.equal(p.py, 10, 'y position after moving');
    t.end();
});

test('person move positive x / negative y', t => {
    var p = new Person(0, 0);
    t.equal(p.px, 0, 'x position before moving');
    t.equal(p.py, 0, 'y position before moving');
    p.xv = 10;
    p.yv = -10;
    p.move();
    t.equal(p.px, 10, 'x position after moving');
    t.equal(p.py, -10, 'y position after moving');
    t.end();
});

test('person move negative x / positive y', t => {
    var p = new Person(0, 0);
    t.equal(p.px, 0, 'x position before moving');
    t.equal(p.py, 0, 'y position before moving');
    p.xv = -10;
    p.yv = 10;
    p.move();
    t.equal(p.px, -10, 'x position after moving');
    t.equal(p.py, 10, 'y position after moving');
    t.end();
});

test('person move negative x / negative y', t => {
    var p = new Person(0, 0);
    t.equal(p.px, 0, 'x position before moving');
    t.equal(p.py, 0, 'y position before moving');
    p.xv = -10;
    p.yv = -10;
    p.move();
    t.equal(p.px, -10, 'x position after moving');
    t.equal(p.py, -10, 'y position after moving');
    t.end();
});
