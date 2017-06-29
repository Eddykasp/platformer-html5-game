
var gamma = 0;
var grav = 0.5;
var holdLeft = false;
var holdRight = false;
var holdUp = false;
var plat=[];
var platLava=[];
var platFragile=[];
var totalPlats = 150;
var platRatio = 1.05;
var score;
var highscore;
window.intervalId = 0;

var Person = function(px, py){
    this.px = px;
    this.py = py;
    this.xv = 0;
    this.yv = 0;
    this.onG = false;
    this.c = "#ffffff";
    this.animationReady = true;
    this.sprites = [
        function(){
            ctx.fillStyle=this.c;
        	ctx.fillRect(this.px-5,this.py-20,10,20);
            ctx.fillStyle="black";
            if(this.xv > 0.05){
                ctx.fillRect(this.px+1, this.py-17, 2, 3);
            } else if(this.xv<-0.05){
                ctx.fillRect(this.px-3, this.py-17, 2, 3);
            } else {
                ctx.fillRect(this.px+1, this.py-17, 2, 3);
                ctx.fillRect(this.px-3, this.py-17, 2, 3);
            }
        },
        function () {
            ctx.fillStyle=this.c;
        	ctx.fillRect(this.px-5,this.py-17,10,17);
            ctx.fillRect(this.px-7, this.py-5, 14, 5);
            ctx.fillStyle="black";
            if(this.xv > 0.05){
                ctx.fillRect(this.px+1, this.py-15, 2, 3);
            } else if(this.xv<-0.05){
                ctx.fillRect(this.px-3, this.py-15, 2, 3);
            } else {
                ctx.fillRect(this.px+1, this.py-15, 2, 3);
                ctx.fillRect(this.px-3, this.py-15, 2, 3);
            }
    }];
}
Person.prototype.draw = function () {};

Person.prototype.move = function (){
    this.px+=this.xv;
	this.py+=this.yv;
}

Person.prototype.update = function () {
    // is called every frame
    if(this.onG && holdUp) {
        this.yv=-10;
    }
    if(this.onG){
        this.animationReady = true;
    } else {
        this.animationReady = false;
    }
    if (this.animationReady){
        this.draw = this.sprites[1];
    } else {
        this.draw = this.sprites[0];
    }
}

var player = new Person(200, 200);

window.onload=function() {
    var tmp;
    if(tmp = getCookie("highscore")){
        highscore = parseInt(tmp);
    } else {
        highscore = 0;
    }

	canv=document.getElementById("gc");
	ctx=canv.getContext("2d");
    ctx.font="30px Arial";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
	document.addEventListener("keydown", startGame);
    document.addEventListener("touchstart", startGame);
    score = highscore-1;
    refresh(false);
    update();
    ctx.fillStyle = "rgba(120, 120, 120, 0.7)";
	ctx.fillRect(0,0,canv.width,canv.height);
    ctx.fillStyle = "white"
    ctx.font="36px Arial";
    ctx.fillText("Press any key or tap the screen to begin", canv.width/2, canv.height/2);
}

function startGame(evt) {
    document.removeEventListener("keydown", startGame);
    document.removeEventListener("touchstart", startGame);

    platRatio = 1.05;
    score = -1;
    refresh(false);
    game();
}

function game(){

    window.onblur = pauseGame;
    ctx.font="30px Arial";
    window.intervalId = setInterval(update,1000/30);
	document.addEventListener("keydown",keyDown);
	document.addEventListener("keyup",keyUp);
    document.addEventListener("touchstart",touchStart);
    document.addEventListener("touchend",touchEnd);
    window.addEventListener("deviceorientation", gyroscopeChange);
}

function pauseGame(){
    clearInterval(window.intervalId);
    document.removeEventListener("keydown",keyDown);
    document.removeEventListener("keyup",keyUp);
    document.removeEventListener("touchstart",touchStart);
    document.removeEventListener("touchend",touchEnd);
    window.removeEventListener("deviceorientation", gyroscopeChange);

    document.addEventListener("keydown", resumeGameKey);
    document.addEventListener("touchstart", resumeGameTouch);

    ctx.fillStyle = "rgba(120, 120, 120, 0.7)";
	ctx.fillRect(0,0,canv.width,canv.height);
    ctx.fillStyle = "white"
    ctx.font="36px Arial";
    ctx.fillText("Press ESC or tap to continue", canv.width/2, canv.height/2);

    holdLeft = false;
    holdRight = false;
}

function resumeGameKey(evt){
    switch (evt.keyCode) {
        case 27:
        document.removeEventListener("keydown", resumeGameKey);
        document.removeEventListener("touchstart", resumeGameTouch);
        game();
            break;
        default:

    }
}

function resumeGameTouch(){
    document.removeEventListener("keydown", resumeGameKey);
    document.removeEventListener("touchstart", resumeGameTouch);
    game();
}

function gameOver(){
    window.onblur = function(){};
    clearInterval(window.intervalId);
    document.removeEventListener("keydown",keyDown);
    document.removeEventListener("keyup",keyUp);
    document.removeEventListener("touchstart",touchStart);
    document.removeEventListener("touchend",touchEnd);
    window.removeEventListener("deviceorientation", gyroscopeChange);

    document.addEventListener("keydown", startGame);
    document.addEventListener("touchstart", startGame);

    holdLeft = false;
    holdRight = false;
    holdUp = false;

    ctx.fillStyle = "rgba(120, 120, 120, 0.7)";
	ctx.fillRect(0,0,canv.width,canv.height);
    ctx.fillStyle = "white"
    ctx.font="36px Arial";
    ctx.fillText("Your score was: " + score, canv.width/2, canv.height/2);
}
function refresh(died) {
    player.xv = 0;
    player.yv = 0;
	if(!died){
        score++;
        platRatio *= 0.95;
    } else {
        if (highscore < score){
            createCookie("highscore", score);
            highscore = score;
        }
        drawScreen();
        gameOver();
    }
	plat=[];
    platLava=[];
    platFragile=[];
	plat.push({
		x:-100,
		y:canv.height-20,
		w:canv.width+200,
		h:200,
		c:"#aaaaaa"
	});

	for(i=0;i<totalPlats*platRatio;i++) {
		plat.push(
		{
    		x:Math.floor(Math.random()*canv.width/30)*canv.width/30,
    		y:Math.floor(Math.random()*canv.width/30)*canv.width/30,
    		w:canv.width/30,
    		h:canv.width/30,
    		c:"#aaaaaa"
		});
	}
    if(score < totalPlats/6){
        fragileblocks = Math.floor(Math.random()*score*2.5+score + totalPlats - Math.floor(totalPlats*platRatio));
    } else {
        fragileblocks = Math.floor(Math.random()*plat.length/2.3+score + totalPlats - Math.floor(totalPlats*platRatio));
    }
    for(i=1; i<fragileblocks+1; i++){
        platFragile.push(
            {
                x:Math.floor(Math.random()*canv.width/30)*canv.width/30,
        		y:Math.floor(Math.random()*canv.width/30)*canv.width/30,
        		w:canv.width/30,
        		h:canv.width/30,
        		c:"#009999",
                t:-1
            });
    }

    if(score < totalPlats/6){
        lavablocks = Math.floor(Math.random()*score*2.5+score);
    } else {
        lavablocks = Math.floor(Math.random()*totalPlats/2.3+score);
    }
    for(i=1; i<lavablocks+1; i++){
        platLava.push(
            {
                x:Math.floor(Math.random()*canv.width/30)*canv.width/30 + 3,
        		y:Math.floor(Math.random()*canv.width/30)*canv.width/30 + 3,
        		w:canv.width/30 - 6,
        		h:canv.width/30 - 6,
        		c:"#990000"
            });
    }
    plat.push(
        {
            x:player.px-(player.px % 30),
            y:player.py-(player.py % 30),
            w:canv.width/30,
            h:canv.width/30,
            c:"#aaaaaa"
        }
    )

    plat.push(
    {
        x:Math.floor(Math.random()*canv.width/30)*canv.width/30,
        y:Math.floor(Math.random()*canv.width/30)*canv.width/30,
        w:canv.width/30,
        h:canv.width/30,
        c:"#009900"
    });

    for(i=0;i<plat.length-1;i++) {
		if(plat[i].x == plat[plat.length-1].x && plat[i].y == plat[plat.length-1].y){
                plat.splice(i,1);
		}
	}

}
function update() {
	if(holdLeft) {
        if(gamma > -15 && gamma!=0){
            player.xv = (gamma + 5)*0.1*4;
        } else {
            player.xv=-4;
        }
	}
	if(holdRight) {
        if(gamma < 15 && gamma!=0){
            player.xv = (gamma - 5)*0.1*4;
        } else {
		    player.xv=4;
        }
	}
	player.move();
	if(player.onG) {
		player.xv *= 0.2;
	} else {
		player.yv += grav;
	}

    if(player.px<0){
        player.px = canv.width;
    }
    if(player.px>canv.width){
        player.px = 0;
    }
	player.onG=false;
	for(i=0;i<plat.length;i++) {
		if(player.px>plat[i].x && player.px<plat[i].x+plat[i].w &&
			player.py>plat[i].y && player.py<plat[i].y+plat[i].h) {
			if(plat[i].c == "#009900"){refresh(false); return;}
			player.py=plat[i].y;
			player.onG=true;
		}
	}

    for(i=0;i<platFragile.length;i++) {
        if(platFragile[i].t > 0){
            platFragile[i].t--;
        }

        if(player.px>platFragile[i].x && player.px<platFragile[i].x+platFragile[i].w &&
            player.py>platFragile[i].y && player.py<platFragile[i].y+platFragile[i].h) {
            // start timer
            if(platFragile[i].t < 0){
                platFragile[i].t = 30;
            }
            player.py=platFragile[i].y;
			player.onG=true;
        }
        if(platFragile[i].t == 0){
            //remove block
            platFragile.splice(i, 1);
        }
    }

    for(i=0;i<platLava.length;i++) {
		if(player.px>platLava[i].x && player.px<platLava[i].x+platLava[i].w &&
			player.py>platLava[i].y && player.py<platLava[i].y+platLava[i].h) {
            refresh(true);
            return;
		}
	}

    player.update();
	drawScreen();
}

function drawScreen() {
    ctx.fillStyle="black";
	ctx.fillRect(0,0,canv.width,canv.height);
    for(i=0;i<platFragile.length;i++) {
        if(platFragile[i].t >= 0){
            platFragile[i].c = "#00" + (3*platFragile[i].t +9) + (3*platFragile[i].t + 9);
        }
		ctx.fillStyle=platFragile[i].c;

        ctx.fillRect(platFragile[i].x, platFragile[i].y, platFragile[i].w, 2);
        ctx.fillRect(platFragile[i].x + platFragile[i].w - 2, platFragile[i].y, 2, platFragile[i].h);
        ctx.fillRect(platFragile[i].x, platFragile[i].y + platFragile[i].h - 2, platFragile[i].w, 2);
        ctx.fillRect(platFragile[i].x, platFragile[i].y, 2, platFragile[i].h);

        ctx.fillRect(platFragile[i].x + 4,platFragile[i].y + 4,platFragile[i].w-8,platFragile[i].h-8);
	}
	for(i=0;i<plat.length;i++) {
		ctx.fillStyle=plat[i].c;

        ctx.fillRect(plat[i].x, plat[i].y, plat[i].w, 2);
        ctx.fillRect(plat[i].x + plat[i].w - 2, plat[i].y, 2, plat[i].h);
        ctx.fillRect(plat[i].x, plat[i].y + plat[i].h - 2, plat[i].w, 2);
        ctx.fillRect(plat[i].x, plat[i].y, 2, plat[i].h);

        ctx.fillRect(plat[i].x + 4,plat[i].y + 4,plat[i].w-8,plat[i].h-8);
	}

    for(i=0;i<platLava.length;i++) {
		ctx.fillStyle=platLava[i].c;
        ctx.fillRect(platLava[i].x,platLava[i].y,platLava[i].w,platLava[i].h);
	}
	player.draw();

    ctx.fillStyle="white";
	ctx.fillText(score,40,40);
}
function keyDown(evt) {
	switch(evt.keyCode) {
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
function touchStart(evt){
    if(player.onG) {
        player.yv=-10;
    }
}
function touchEnd(evt){
    if(player.yv<-4) {
        player.yv=-4;
    }
}

function gyroscopeChange(evt) {
    gamma = evt.gamma;
    if(gamma > 5){
        holdRight=true;
        holdLeft=false;
        return;
    } else if(gamma < -5){
        holdLeft=true;
        holdRight=false;
        return;
    } else {
        holdRight=false;
        holdLeft=false;
    }
}

function keyUp(evt) {
	switch(evt.keyCode) {
		case 37:
			holdLeft=false;
			break;
		case 38:
			if(player.yv<-4) {
				player.yv=-4;
			}
            holdUp = false;
			break;
		case 39:
			holdRight=false;
			break;
	}
}

var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}
