var Block = function (w, h) {
    this.x = Math.floor(Math.random()*30)*30;
    this.y = Math.floor(Math.random()*30)*30;
    this.w = w;
    this.h = h;
    this.draw = function () {};
    this.c = 'white';
};

module.exports = Block;
