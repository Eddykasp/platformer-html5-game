var Block = function (w, h) {
    this.x = Math.floor(Math.random()*30)*30;
    this.y = Math.floor(Math.random()*30)*30;
    this.w = w;
    this.h = h;
    this.draw = function () {};
    this.update = function () {};
    this.t = -1;
    this.c = 'white';
    this.pointIsInside = function(point){
        return (point.x > this.x && point.x < this.x + this.w &&
            point.y >this.y && point.y < this.y + this.h);
    };
};

module.exports = Block;
