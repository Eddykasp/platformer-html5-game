var Person = function(px, py){
    this.px = px;
    this.py = py;
    this.xv = 0;
    this.yv = 0;
    this.onG = false;
    this.c = '#ffffff';
    this.animationReady = true;
    this.sprites = [
        function (ctx) {
            ctx.fillStyle = this.c;
            ctx.fillRect(this.px - 5, this.py - 17, 10, 17);
            ctx.fillRect(this.px - 4, this.py - 18, 8, 1);
            ctx.fillRect(this.px - 3, this.py - 19, 6, 1);
            ctx.fillRect(this.px - 2, this.py - 20, 4, 1);
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
        function (ctx) {
            ctx.fillStyle = this.c;
            ctx.fillRect(this.px - 5, this.py - 14, 10, 14);
            ctx.fillRect(this.px - 4, this.py - 15, 8, 1);
            ctx.fillRect(this.px - 3, this.py - 16, 6, 1);
            ctx.fillRect(this.px - 2, this.py - 17, 4, 1);
            ctx.fillRect(this.px - 6, this.py - 7, 12, 7);
            ctx.fillStyle = 'black';
            if(this.xv > 0.05){
                ctx.fillRect(this.px + 1, this.py - 15, 2, 3);
            } else if(this.xv < -0.05){
                ctx.fillRect(this.px - 3, this.py - 15, 2, 3);
            } else {
                ctx.fillRect(this.px + 1, this.py - 15, 2, 3);
                ctx.fillRect(this.px - 3, this.py - 15, 2, 3);
            }
        },
        function (ctx) {
            ctx.fillStyle = this.c;
            ctx.fillRect(this.px - 5, this.py - 13, 10, 13);
            ctx.fillRect(this.px - 4, this.py - 14, 8, 1);
            ctx.fillRect(this.px - 3, this.py - 15, 6, 1);
            ctx.fillRect(this.px - 2, this.py - 16, 4, 1);
            ctx.fillRect(this.px - 6, this.py - 10, 12, 9);
            ctx.fillRect(this.px - 7, this.py - 8, 14, 7);
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
        if(this.yv > 0.2){
            this.draw = this.sprites[2];
        }
    };
};

module.exports = Person;
