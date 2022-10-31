'use strict';

const keyCode = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    pause: 27
};
var speed = 1;
var dim = [50, 50];
const cell = 50;

const start = [Math.floor(dim[0]/2), Math.floor(dim[1]/2)];

let head = [start[0], start[1]];
let tail = [];
let tailLength = 5;
let dir = [0,1];
let newDir = dir;
let paused = false;
let applePos = [Rand(0, dim[0]), Rand(0, dim[1])];
let canvas, ctx, gameLoop;
let gameover = false;

let color = 0;

function Rand(start, amount)
{
    return Math.floor(Math.random() * amount) + start; 
}

function Start()
{
    let size = +document.getElementById("gridnum").value;
    dim = [size, size];
    applePos = [Rand(0, dim[0]), Rand(0, dim[1])];
    speed = +document.getElementById("speednum").value;
    tailLength = +document.getElementById("tailnum").value;
    canvas = document.getElementById("gamecanvas");
    document.getElementById("startmenu").classList.add("hidden");

    canvas.width = dim[0] * cell;
    canvas.height = dim[1] * cell;

    ctx = canvas.getContext("2d");


    document.onkeydown = function(e){Input(e.keyCode);};

    gameLoop = setInterval(Loop, 100/speed);
}

function Loop()
{
    ctx.clearRect(0, 0, dim[0]*cell, dim[1]*cell);

    moveSnake();

    DrawCell(applePos[0], applePos[1], "hsl("+color+", 100%, 50%");
    color+=10;
}

function moveSnake()
{
    if(!(newDir[0] == -dir[0] || newDir[1] == -dir[1]))
    {
        dir = newDir;
    }
    tail.push(head);
    head = [head[0]+dir[0], head[1]+dir[1]];

    DrawCell(head[0], head[1], "white");

    for(let i=0; i<tail.length; i++)
    {
        DrawCell(tail[i][0], tail[i][1], "hsl("+i*10+", 100%, 50%)");
        if(tail[i][0] == head[0] && tail[i][1] == head[1])
        {
            clearInterval(gameLoop);
            gameover = true;
            document.getElementById("gameover").classList.remove("hidden");
        }
        else if(head[0] == applePos[0] && head[1] == applePos[1])
        {
            tailLength++;
            applePos = [Rand(0, dim[0]), Rand(0, dim[1])];
        }
        if (head[0] < 0) 
        {
            head[0] =  dim[0]-1;
        }
        if (head[0] > dim[0] - 1) 
        {
            head[0] = 0;
        }
        if (head[1] < 0) 
        {
            head[1] = dim[1] - 1;
        }
        if (head[1] > dim[1] - 1) 
        {
            head[1] = 0;
        }
    }
    if(tail.length > tailLength)
    {
        tail.shift();
    }
}

function DrawCell(x, y, color)
{
    ctx.fillStyle = color;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 10;
    ctx.fillRect(x*cell, y*cell, cell, cell);
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeRect(x*cell, y*cell, cell, cell);
    ctx.globalCompositeOperation = "source-over";
}

function Input(key)
{
    switch(key)
    {
        case keyCode.left:  newDir = [-1, 0]; break;
        case keyCode.up:    newDir = [0, -1]; break;
        case keyCode.right: newDir = [1, 0]; break;
        case keyCode.down:  newDir = [0, 1]; break;
        case keyCode.pause: paused = !paused; break;
    }

    if(paused)
    {
        clearInterval(gameLoop);
    }
    else if (key == keyCode.pause)
    {
        if(gameover){return;}
        gameLoop = setInterval(Loop, 100/speed); 
    }
}