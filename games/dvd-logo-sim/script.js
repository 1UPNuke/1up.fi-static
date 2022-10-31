'use strict';

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

var canvas, ctx, img, x, y, angle, img, imgWidth, imgHeight;
let params = new URLSearchParams(document.location.search.substring(1));

let bg = params.get("bg") || "#000"; 
let color = params.get("color") || "#FFF";
let speed = +(params.get("speed") || "1");
let size = +(params.get("size") || "300");

function draw()
{
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if(x<=0)
    {
        angle[0]=-angle[0];
    }
    if(x>=ctx.canvas.width-imgWidth)
    {
        angle[0]=-angle[0];
    }
    if(y<=0)
    {
        angle[1]=-angle[1];
    }
    if(y>=ctx.canvas.height-imgHeight)
    {
        angle[1]=-angle[1];
    }
    x+=angle[0]*speed, y+=angle[1]*speed;
    ctx.drawImage(img, x, y, imgWidth, imgHeight);

    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.globalCompositeOperation = "source-over";
}

function init()
{
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    x = ctx.canvas.width/2, y = ctx.canvas.height/2;
    angle = [1,1];

    img = new Image();
    img.onload = function(){
        imgWidth = this.width/ctx.canvas.width*size;
        imgHeight = this.height/ctx.canvas.width*size;
        setInterval(draw, 15);
    }
    img.src = "DVD.png";
    setInterval(draw, 15);
}