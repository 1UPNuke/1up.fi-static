'use strict';

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

function getEl(id)
{
    return document.getElementById(id);
}

let canvas;
let width = window.innerWidth;
let height = window.innerHeight;
let pos = {x:0, y:0}
let oldpos = {x:0, y:0}
let ctx;
let mouseHeld = false;
let mobile = false;
let color, size, rainbow, pen, eraser, bg, UI, clearEl, saveEl;
let hue = 0;

function init()
{
    UI = getEl("UI");
    UI.innerHTML += `
    <p style="position: fixed; left: 10px; bottom: 10px;">
    <img src="/media/images/ogimage.webp" style="width: 20px;"> Powered by 1up.fi
    </p>`;
    
    canvas = getEl("canvas");
    ctx = canvas.getContext("2d");

    canvas.onmousemove = function(){getPos(event);paint();};
    canvas.onmousedown = function(){mouseHeld=true; paint();};
    canvas.onmouseup = function(){mouseHeld=false;};
    canvas.onmouseout = function(){mouseHeld=false;};

    canvas.ontouchmove = function(){getPos(event);paint();};
    canvas.ontouchstart = function(){mouseHeld=true; getPos(event); getPos(event); paint();};

    window.onkeydown = function(){shortcut(event.key, event.ctrlKey);}

    ctx.canvas.width  = width;
    ctx.canvas.height = height;
    
    ctx.lineCap = "round";

    color = getEl("color");
    size = getEl("size");
    rainbow = getEl("rainbow");
    pen = getEl("pen");
    eraser = getEl("eraser");
    bg = getEl("bg");

    clearEl = getEl("clear");
    clearEl.onclick = function(){clear();};

    saveEl = getEl("save");
    saveEl.onclick = function(){save();};

    setInterval(paint, 1);
    setInterval(updateBG, 1);
}

function paint()
{
    if(!mouseHeld) return;
    if(oldpos.x==0&&oldpos.y==0) return;
    ctx.globalCompositeOperation = "source-over";
    let drawColor = color.value
    if(eraser.checked){ ctx.globalCompositeOperation = "destination-out"; }
    ctx.lineWidth = size.value;
//    if(!mobile)
//    {
        ctx.strokeStyle = drawColor;
        ctx.beginPath();
        ctx.moveTo(oldpos.x, oldpos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
/*    }
    else
    {
        ctx.fillStyle = drawColor;
        ctx.fillRect(pos.x, pos.y, size.value, size.value);
    }*/
}

function getPos(e)
{
    let rect = canvas.getBoundingClientRect();
    oldpos = pos;
    e.preventDefault();
    if(e.touches)
    {
        mobile = true;
        if(e.touches.length >= 1)
        {
            var touch = e.touches[0];
            pos = {
                x: touch.pageX - rect.left,
                y: touch.pageY - rect.top
            };
        }
    }
    else
    {
        pos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
}

function clear()
{
    ctx.clearRect(0, 0, width, height);
}

function save()
{
    fillBG(canvas.style["background-color"])
    var link = getEl('link');
    link.setAttribute('download', 'canvas.png');
    link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.click();
}

function fillBG(clr) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = clr;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

function updateBG()
{
    canvas.style["background-color"] = bg.value;
}

function shortcut(key, ctrl)
{
    switch(key)
    {
        case "u": UI.classList.toggle("hidden"); break;
        case "p": pen.click(); break;
        case "e": eraser.click(); break;
        case "c": clearEl.click(); break;
        case "s": saveEl.click(); break;
        case "ArrowUp": size.value=+size.value+1; break;
        case "ArrowDown": size.value=+size.value-1; break;
        case "h": color.click(); break;
        case "b": bg.click(); break;
    }
}