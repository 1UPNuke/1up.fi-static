'use strict';
import {Dice} from "./diceClass.js";

let script = document.scripts[document.scripts.length - 1];

let prm = new URLSearchParams(new URL(script.src).search.substring(1));


let width = prm.get("width") ? prm.get("width") : "100";
let height = prm.get("height") ? prm.get("height") : "100";
let bg = prm.get("bg") ? prm.get("bg") : "#f0f0f0";
let pip = prm.get("pip") ? prm.get("pip") : "#202020";
let shading = prm.get("shading") ? prm.get("shading") : "0.5";

let canvas = document.createElement('canvas');
canvas.style.cssText += `box-shadow: -${width/10}px ${height/10}px ${width/5}px rgba(0,0,0,${shading})` + script.style.cssText;
canvas.width = width;
canvas.height = height;

script.parentElement.insertBefore(canvas, script);

let ctx = canvas.getContext('2d');

randomize();
canvas.addEventListener("click", function(){randomize();});

function randomize()
{
    let num = Math.floor(Math.random() * 6) + 1;
    new Dice(num).draw(ctx, width, height, bg, pip, shading);
}