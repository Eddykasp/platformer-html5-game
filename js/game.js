
var Person = require('./person');
var Platform = require('./block_platform');
var Lava = require('./block_lava');
var FragilePlatform = require('./block_platform_fragile');
var SandPlatform = require('./block_platform_sand');
var BoostPlatform = require('./block_platform_boost');

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
var platBoost = [];
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
    ctx.fillText('Press R to restart the game', canv.width/2, canv.height/3);
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
    platBoost = [];
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
                platBoost.push(new BoostPlatform());
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

    (function (){
        for (var i = 0; i < platBoost.length; i += 1) {
            if (platBoost[i].pointIsInside(player.pos)) {
                grav = platBoost[i].grav;
                jumpV = platBoost[i].jumpV;
                player.pos.y = platBoost[i].y;
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
        for (var i = 0; i < platBoost.length; i += 1) {
            platBoost[i].draw(ctx);
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
    case 65:
        holdLeft=true;
        break;
    case 87:
        holdUp = true;
        break;
    case 68:
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
    case 65:
        holdLeft = false;
        break;
    case 87:
        if(player.yv < jumpV) {
            player.yv = jumpV;
        }
        holdUp = false;
        break;
    case 68:
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

