var Block = require('./block.js');

var Platform = function (x, y, c) {
    var block = new Block(x, y, 30, 30);
    block.c = c;
    block.draw = function (ctx) {
        ctx.fillStyle = block.c;

        ctx.fillRect(block.x, block.y, block.w, 2);
        ctx.fillRect(block.x + block.w - 2, block.y, 2, block.h);
        ctx.fillRect(block.x, block.y + block.h - 2, block.w, 2);
        ctx.fillRect(block.x, block.y, 2, block.h);

        ctx.fillRect(block.x + 4, block.y + 4, block.w - 8, block.h - 8);
    };
    return block;
};

module.exports = Platform;
