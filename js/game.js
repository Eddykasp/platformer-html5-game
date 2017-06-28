px=py=200;
xv=yv=0;
gamma=0;
grav=0.5;
onG=false;
holdLeft=holdRight=false;
plat=[];
platLava=[];
platFragile=[];
totalPlats = 150;
platRatio = 1;
score=-1;
window.onload=function() {
	canv=document.getElementById("gc");
	ctx=canv.getContext("2d");
	ctx.font="30px Arial";
	setInterval(update,1000/30);
	document.addEventListener("keydown",keyDown);
	document.addEventListener("keyup",keyUp);
    document.addEventListener("touchstart",touchStart);
    document.addEventListener("touchend",touchEnd);
    window.addEventListener("deviceorientation", gyroscopeChange);
	refresh(true);
}
function refresh(died) {
    xv=yv=0;
	if(!died){
        score++;
        platRatio *= 0.95;
    } else {
        score = 0;
        platRatio = 1;
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
            x:px-(px % 30),
            y:py-(py % 30),
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
                plat[i].x = -1;
		}
	}

}
function update() {
	if(holdLeft) {
        if(gamma > -15 && gamma!=0){
            xv = (gamma + 5)*0.1*4;
        } else {
            xv=-4;
        }
	}
	if(holdRight) {
        if(gamma < 15 && gamma!=0){
            xv = (gamma - 5)*0.1*4;
        } else {
		    xv=4;
        }
	}
	px+=xv;
	py+=yv;
	if(onG) {
		xv *= 0.2;
	} else {
		yv += grav;
	}

    if(px<0){
        px = canv.width;
    }
    if(px>canv.width){
        px = 0;
    }
	onG=false;
	for(i=0;i<plat.length;i++) {
		if(px>plat[i].x && px<plat[i].x+plat[i].w &&
			py>plat[i].y && py<plat[i].y+plat[i].h) {
			if(plat[i].c == "#009900"){refresh(false); return;}
			py=plat[i].y;
			onG=true;
		}
	}

    for(i=0;i<platFragile.length;i++) {
        if(platFragile[i].t > 0){
            platFragile[i].t--;
        }

        if(px>platFragile[i].x && px<platFragile[i].x+platFragile[i].w &&
            py>platFragile[i].y && py<platFragile[i].y+platFragile[i].h) {
            // start timer
            if(platFragile[i].t < 0){
                platFragile[i].t = 30;
            }
            py=platFragile[i].y;
			onG=true;
        }
        if(platFragile[i].t == 0){
            //remove block
            platFragile.splice(i, 1);
        }
    }

    for(i=0;i<platLava.length;i++) {
		if(px>platLava[i].x && px<platLava[i].x+platLava[i].w &&
			py>platLava[i].y && py<platLava[i].y+platLava[i].h) {
            refresh(true);
            return;
		}
	}

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
	ctx.fillStyle="white";
	ctx.fillRect(px-5,py-20,10,20);
    ctx.fillStyle="black";
    if(xv > 0.05){
        ctx.fillRect(px+1, py-17, 2, 3);
    } else if(xv<-0.05){
        ctx.fillRect(px-3, py-17, 2, 3);
    } else {
        ctx.fillRect(px+1, py-17, 2, 3);
        ctx.fillRect(px-3, py-17, 2, 3);
    }

    ctx.fillStyle="white";
	ctx.fillText(score,10,40);
}
function keyDown(evt) {
	switch(evt.keyCode) {
		case 37:
			holdLeft=true;
			break;
		case 38:
			if(onG) {
				yv=-10;
			}
			break;
		case 39:
			holdRight=true;
			break;
	}
}
function touchStart(evt){
    if(onG) {
        yv=-10;
    }
}
function touchEnd(evt){
    if(yv<-4) {
        yv=-4;
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
			if(yv<-4) {
				yv=-4;
			}
			break;
		case 39:
			holdRight=false;
			break;
	}
}
