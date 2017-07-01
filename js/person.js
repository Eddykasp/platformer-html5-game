var Person = function(px, py, ctx){
    this.px = px;
    this.py = py;
    this.xv = 0;
    this.yv = 0;
    this.onG = false;
    this.c = '#ffffff';
    this.animationReady = true;
    this.sprites = [
        function () {
            ctx.fillStyle = this.c;
            ctx.fillRect(this.px - 5, this.py - 20, 10, 20);
            ctx.fillStyle = 'black';
            if (this.xv > 0.05){
                ctx.fillRect(this.px + 1, this.py - 17, 2, 3);
            } else if (this.xv < -0.05) {
                ctx.fillRect(this.px - 3, this.py - 17, 2, 3);
            } else {
                ctx.fillRect(this.px + 1, this.py - 17, 2, 3);
                ctx.fillRect(this.px - 3, this.py - 17, 2, 3);
            }
        },
        function () {
            ctx.fillStyle = this.c;
            ctx.fillRect(this.px - 5,this.py - 17, 10, 17);
            ctx.fillRect(this.px - 7, this.py - 5, 14, 5);
            ctx.fillStyle = 'black';
            if(this.xv > 0.05){
                ctx.fillRect(this.px + 1, this.py - 15, 2, 3);
            } else if(this.xv < -0.05){
                ctx.fillRect(this.px - 3, this.py - 15, 2, 3);
            } else {
                ctx.fillRect(this.px + 1, this.py - 15, 2, 3);
                ctx.fillRect(this.px - 3, this.py - 15, 2, 3);
            }
        }
    ];
    this.draw = this.sprites[1];
    this.move = function () {
        this.px += this.xv;
        this.py += this.yv;
    };
    this.update = function (holdUp) {
        // is called every frame
        if (this.onG && holdUp) {
            this.yv =- 10;
        }
        if (this.onG) {
            this.animationReady = true;
        } else {
            this.animationReady = false;
        }
        if (this.animationReady) {
            this.draw = this.sprites[1];
        } else {
            this.draw = this.sprites[0];
        }
    };
};

module.exports = Person;
