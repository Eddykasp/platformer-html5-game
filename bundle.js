(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
        var collision = (point.x > this.x && point.x < this.x + this.w &&
            point.y >this.y && point.y < this.y + this.h);
        return collision;
    };
};

module.exports = Block;

},{}],2:[function(require,module,exports){
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

},{"./block":1}],3:[function(require,module,exports){
var Block = require('./block.js');

var Platform = function (c) {
    var block = new Block(30, 30);
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

},{"./block.js":1}],4:[function(require,module,exports){
var Platform = require('./block_platform');

var FragilePlatform = function () {
    var platform = new Platform('#009999');
    platform.update = function () {
        if (platform.t > 0){
            platform.t -= 1;
        }
        if (platform.t >= 0) {
            platform.c = '#00' +
                (3 * platform.t + 9) +
                (3 * platform.t + 9);
        }
    };
    return platform;
};

module.exports = FragilePlatform;

},{"./block_platform":3}],5:[function(require,module,exports){
var Platform = require('./block_platform');

var SandPlatform = function () {
    var platform = new Platform('#999900');
    platform.grav = 0.9;
    platform.jumpV = -2;
    return platform;
};

module.exports = SandPlatform;

},{"./block_platform":3}],6:[function(require,module,exports){

var Person = require('./person');
var Platform = require('./block_platform');
var Lava = require('./block_lava');
var FragilePlatform = require('./block_platform_fragile');
var SandPlatform = require('./block_platform_sand');

var gamma = null;
var defaultGrav = 0.5;
var grav = defaultGrav;
var holdLeft = false;
var holdRight = false;
var holdUp = false;
var plat = [];
var platLava = [];
var platFragile = [];
var platSand = [];
var totalPlats = 150;
var platRatio = 1.05;
var score;
var highscore;
var defaultJumpV = -4;
var jumpV = defaultJumpV;
window.intervalId = 0;
var canv;
var ctx;
var isPaused = true;

var player = new Person(200, 200);

window.onload = function() {
    var colBtn = document.getElementById('colourBtn');
    colBtn.addEventListener('change', setPlayerColour);

    var tmp = getCookie('highscore');
    if (tmp != '') {
        highscore = parseInt(tmp);
    } else {
        highscore = 0;
    }

    canv = document.getElementById('gc');
    ctx = canv.getContext('2d');
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    document.addEventListener('keydown', startGame);
    document.addEventListener('touchstart', startGame);
    score = highscore - 1;
    refresh(false);
    update();
    ctx.fillStyle = 'rgba(120, 120, 120, 0.7)';
    ctx.fillRect(0, 0, canv.width, canv.height);
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.fillText('Press any key or tap the screen to begin',
        canv.width/2,  canv.height/2);
};

function startGame() {
    document.removeEventListener('keydown', startGame);
    document.removeEventListener('touchstart', startGame);

    platRatio = 1.05;
    score = -1;
    refresh(false);
    game();
}

function game(){

    isPaused = false;
    window.onblur = pauseGame;
    ctx.font = '30px Arial';
    window.intervalId = setInterval(update,1000/30);
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    document.addEventListener('touchstart', touchStart);
    document.addEventListener('touchend', touchEnd);
    window.addEventListener('deviceorientation', gyroscopeChange);
}

function pauseGame(){
    if(isPaused){
        return;
    }
    isPaused = true;
    clearInterval(window.intervalId);
    document.removeEventListener('keydown', keyDown);
    document.removeEventListener('keyup', keyUp);
    document.removeEventListener('touchstart', touchStart);
    document.removeEventListener('touchend', touchEnd);
    window.removeEventListener('deviceorientation', gyroscopeChange);

    document.addEventListener('keydown', resumeGameKey);
    document.addEventListener('touchstart', resumeGameTouch);

    ctx.fillStyle = 'rgba(120, 120, 120, 0.7)';
    ctx.fillRect(0, 0, canv.width, canv.height);
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.fillText('Press r to restart the game', canv.width/2, canv.height/3);
    ctx.fillText('Press ESC or tap to continue', canv.width/2, canv.height/2);

    holdLeft = false;
    holdRight = false;
}

function resumeGameKey(evt) {
    switch (evt.keyCode) {
    // resume game
    case 27:
        document.removeEventListener('keydown', resumeGameKey);
        document.removeEventListener('touchstart', resumeGameTouch);
        game();
        break;
    // restart game
    case 82:
        document.removeEventListener('keydown', resumeGameKey);
        document.removeEventListener('touchstart', resumeGameTouch);
        startGame();
        break;
    default:
        break;
    }
}

function resumeGameTouch() {
    document.removeEventListener('keydown', resumeGameKey);
    document.removeEventListener('touchstart', resumeGameTouch);
    game();
}

function gameOver() {
    window.onblur = function () {};
    clearInterval(window.intervalId);
    document.removeEventListener('keydown', keyDown);
    document.removeEventListener('keyup', keyUp);
    document.removeEventListener('touchstart', touchStart);
    document.removeEventListener('touchend', touchEnd);
    window.removeEventListener('deviceorientation', gyroscopeChange);

    document.addEventListener('keydown', startGame);
    document.addEventListener('touchstart', startGame);

    holdLeft = false;
    holdRight = false;
    holdUp = false;

    ctx.fillStyle = 'rgba(120, 120, 120, 0.7)';
    ctx.fillRect(0, 0, canv.width, canv.height);
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.fillText('Your score was: ' + score, canv.width/2, canv.height/2);
}

function refresh(died) {
    player.xv = 0;
    player.yv = 0;
    if(!died){
        score += 1;
        platRatio *= 0.95;
    } else {
        if (highscore < score){
            createCookie('highscore', score);
            highscore = score;
        }
        gameOver();
    }
    plat = [];
    platLava = [];
    platFragile = [];
    platSand = [];
    var ground = new Platform('#aaaaaa');
    ground.x = -100;
    ground.y = canv.height - 20;
    ground.w = canv.width + 200;
    ground.h = 200;
    plat.push(ground);
    (function () {
        for (var i = 0; i < totalPlats * platRatio; i += 1) {
            plat.push(new Platform('#aaaaaa'));
        }
    })();

    var fragileblocks;
    if (score < totalPlats / 6) {
        fragileblocks =
            Math.floor(Math.random() * score * 2.5 +
            score + totalPlats - Math.floor(totalPlats * platRatio));
    } else {
        fragileblocks =
            Math.floor(Math.random() * plat.length / 2.3 +
            score + totalPlats - Math.floor(totalPlats*platRatio));
    }
    (function () {
        for (var i = 1; i < fragileblocks + 1; i += 1) {
            var decision = Math.random();
            if (decision < 0.75){
                platFragile.push(new FragilePlatform());
            } else {
                platSand.push(new SandPlatform());
            }
        }
    })();

    var lavablocks;
    if (score < totalPlats / 6) {
        lavablocks = Math.floor(Math.random() * score * 2.5 + score);
    } else {
        lavablocks = Math.floor(Math.random() * totalPlats / 2.3 + score);
    }

    (function () {
        for(var i = 1; i < lavablocks + 1; i += 1){
            platLava.push(new Lava());
        }
    })();

    var playerPlat = new Platform('#aaaaaa');
    playerPlat.x = player.pos.x - (player.pos.x % 30);
    playerPlat.y = player.pos.y - (player.pos.y % 30);
    plat.push(playerPlat);

    var c = '#009900';
    plat.push(new Platform(c));

    (function () {
        for (var i = 0; i < plat.length - 1; i += 1) {
            if (plat[i].x == plat[plat.length - 1].x &&
                plat[i].y == plat[plat.length - 1].y) {
                plat.splice(i, 1);
            }
        }
    })();

}
function update() {
    if(holdLeft) {
        if (gamma !== null && gamma > -15) {
            player.xv = (gamma + 5) * 0.1 * 4;
        } else {
            player.xv =- 4;
        }
    }
    if(holdRight) {
        if (gamma !== null && gamma < 15) {
            player.xv = (gamma - 5) * 0.1 * 4;
        } else {
            player.xv = 4;
        }
    }
    player.move();
    if (player.onG) {
        player.xv *= 0.2;
    } else {
        player.yv += grav;
    }

    if (player.pos.x < 0) {
        player.pos.x = canv.width;
    }
    if (player.pos.x > canv.width) {
        player.pos.x = 0;
    }
    player.onG = false;

    (function () {
        for (var i = 0; i < plat.length; i += 1) {
            if (plat[i].pointIsInside(player.pos)) {
                if (plat[i].c == '#009900') {
                    refresh(false);
                    return;
                }
                grav = defaultGrav;
                jumpV = defaultJumpV;
                player.pos.y = plat[i].y;
                player.onG = true;
                player.yv = 0.000001;
            }
        }
    })();

    (function (){
        for (var i = 0; i < platSand.length; i += 1) {
            if (platSand[i].pointIsInside(player.pos)) {
                grav = platSand[i].grav;
                jumpV = platSand[i].jumpV;
                player.pos.y = platSand[i].y;
                player.onG = true;
                player.yv = 0.000001;
            }
        }
    })();

    (function () {
        for (var i = 0; i < platFragile.length; i += 1) {
            platFragile[i].update();

            if (platFragile[i].pointIsInside(player.pos)) {
                // start timer
                if (platFragile[i].t < 0) {
                    platFragile[i].t = 30;
                }
                grav = defaultGrav;
                jumpV = defaultJumpV;
                player.pos.y = platFragile[i].y;
                player.onG = true;
                player.yv = 0.000001;
            }
            if (platFragile[i].t == 0) {
                //remove block
                platFragile.splice(i, 1);
            }
        }
    })();
    var isDead = false;
    (function () {
        for (var i = 0; i < platLava.length; i += 1) {
            if (platLava[i].pointIsInside(player.pos)) {
                refresh(true);
                isDead = true;
            }
        }
    })();

    player.update(holdUp);
    if(!isDead){
        drawScreen();
    }
}

function drawScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canv.width, canv.height);
    (function () {
        for (var i = 0; i < platFragile.length; i += 1) {
            platFragile[i].draw(ctx);
        }
    })();

    (function () {
        for (var i = 0; i < platSand.length; i += 1) {
            platSand[i].draw(ctx);
        }
    })();

    (function () {
        for (var i = 0; i < plat.length; i += 1) {
            plat[i].draw(ctx);
        }
    })();

    (function () {
        for (var i = 0; i < platLava.length; i += 1) {
            platLava[i].draw(ctx);
        }
    })();

    player.draw(ctx);

    ctx.fillStyle = 'white';
    ctx.fillText(score, 40, 40);
}

function keyDown(evt) {
    switch (evt.keyCode) {
    case 37:
        holdLeft=true;
        break;
    case 38:
        holdUp = true;
        break;
    case 39:
        holdRight=true;
        break;
    case 27:
        pauseGame();
        break;
    }
}
function touchStart(){
    if(player.onG) {
        player.yv = -10;
    }
    holdUp = true;
}
function touchEnd(){
    if(player.yv < jumpV) {
        player.yv = jumpV;
    }
    holdUp = false;
}

function gyroscopeChange(evt) {
    gamma = evt.gamma;
    if(gamma > 5){
        holdRight = true;
        holdLeft = false;
        return;
    } else if(gamma < -5){
        holdLeft = true;
        holdRight = false;
        return;
    } else {
        holdRight = false;
        holdLeft = false;
    }
}

function keyUp(evt) {
    switch(evt.keyCode) {
    case 37:
        holdLeft = false;
        break;
    case 38:
        if(player.yv < jumpV) {
            player.yv = jumpV;
        }
        holdUp = false;
        break;
    case 39:
        holdRight = false;
        break;
    }
}

var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toGMTString();
    }
    else {
        expires = '';
    }
    document.cookie = name + '=' + value + expires + '; path=/';
};

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + '=');
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(';', c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return '';
}

function setPlayerColour(){
    player.c = document.getElementById('colourBtn').value;
}

},{"./block_lava":2,"./block_platform":3,"./block_platform_fragile":4,"./block_platform_sand":5,"./person":7}],7:[function(require,module,exports){
var Point = require('./point');

var Person = function(px, py){
    this.pos = new Point(px, py);
    this.xv = 0;
    this.yv = 0;
    this.onG = false;
    this.c = '#ffffff';
    this.sprites = [
        function (ctx) {
            ctx.fillStyle = this.c;
            ctx.fillRect(this.pos.x - 5, this.pos.y - 17, 10, 17);
            ctx.fillRect(this.pos.x - 4, this.pos.y - 18, 8, 1);
            ctx.fillRect(this.pos.x - 3, this.pos.y - 19, 6, 1);
            ctx.fillRect(this.pos.x - 2, this.pos.y - 20, 4, 1);
            ctx.fillStyle = 'black';
            if (this.xv > 0.05){
                ctx.fillRect(this.pos.x + 1, this.pos.y - 17, 2, 3);
            } else if (this.xv < -0.05) {
                ctx.fillRect(this.pos.x - 3, this.pos.y - 17, 2, 3);
            } else {
                ctx.fillRect(this.pos.x + 1, this.pos.y - 17, 2, 3);
                ctx.fillRect(this.pos.x - 3, this.pos.y - 17, 2, 3);
            }
        },
        function (ctx) {
            ctx.fillStyle = this.c;
            ctx.fillRect(this.pos.x - 5, this.pos.y - 14, 10, 14);
            ctx.fillRect(this.pos.x - 4, this.pos.y - 15, 8, 1);
            ctx.fillRect(this.pos.x - 3, this.pos.y - 16, 6, 1);
            ctx.fillRect(this.pos.x - 2, this.pos.y - 17, 4, 1);
            ctx.fillRect(this.pos.x - 6, this.pos.y - 7, 12, 7);
            ctx.fillStyle = 'black';
            if(this.xv > 0.05){
                ctx.fillRect(this.pos.x + 1, this.pos.y - 15, 2, 3);
            } else if(this.xv < -0.05){
                ctx.fillRect(this.pos.x - 3, this.pos.y - 15, 2, 3);
            } else {
                ctx.fillRect(this.pos.x + 1, this.pos.y - 15, 2, 3);
                ctx.fillRect(this.pos.x - 3, this.pos.y - 15, 2, 3);
            }
        },
        function (ctx) {
            ctx.fillStyle = this.c;
            ctx.fillRect(this.pos.x - 5, this.pos.y - 13, 10, 13);
            ctx.fillRect(this.pos.x - 4, this.pos.y - 14, 8, 1);
            ctx.fillRect(this.pos.x - 3, this.pos.y - 15, 6, 1);
            ctx.fillRect(this.pos.x - 2, this.pos.y - 16, 4, 1);
            ctx.fillRect(this.pos.x - 6, this.pos.y - 10, 12, 9);
            ctx.fillRect(this.pos.x - 7, this.pos.y - 8, 14, 7);
            ctx.fillStyle = 'black';
            if(this.xv > 0.05){
                ctx.fillRect(this.pos.x + 1, this.pos.y - 15, 2, 3);
            } else if(this.xv < -0.05){
                ctx.fillRect(this.pos.x - 3, this.pos.y - 15, 2, 3);
            } else {
                ctx.fillRect(this.pos.x + 1, this.pos.y - 15, 2, 3);
                ctx.fillRect(this.pos.x - 3, this.pos.y - 15, 2, 3);
            }
        }
    ];
    this.draw = this.sprites[1];
    this.move = function () {
        this.pos.x += this.xv;
        this.pos.y += this.yv;
    };
    this.update = function (holdUp) {
        // is called every frame
        if (this.onG && holdUp) {
            this.yv =- 10;
        }
        if (this.onG) {
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

},{"./point":8}],8:[function(require,module,exports){
var Point = function(x, y){
    this.x = x;
    this.y = y;
};

module.exports = Point;

},{}]},{},[6]);
