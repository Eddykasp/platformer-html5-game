var Block = require('./block');

var Lava = function () {
    var block = new Block(24, 24);
    block.x += 3;
    block.y += 3;
    block.c = '#990000';
    block.draw = function (ctx) {
        ctx.fillStyle = block.c;
        ctx.fillRect(block.x, block.y, block.w, block.h);
    };
    return block;
};

module.exports = Lava;
