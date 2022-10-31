'use strict';

let canvas, ctx, name, pic;
const colors = {
    orange: "#ff7100",
    yellow: "#ffb000",
    pinkwhite: "#f5d3ff",
    blue:"#00b1fa",
    red:"#f00"
};
const titles = [
    "Place of birth:",
    "Birthday:",
    "Sex:",
    "Primary Ship:",
    "Ship Name:",
    "Ship ID:",
    "Profession:"
];
const keys = [
    "name",
    "birthplace",
    "birthday",
    "sex",
    "ship",
    "shipname",
    "id",
    "profession"
];

$(document).ready(async function(){
    canvas = $("#license")[0];
    ctx = canvas.getContext("2d");

    var imageLoader = document.getElementById('picture');
    imageLoader.addEventListener('change', handleImage, false);
    pic = await LoadImage("img/defpic.png");

    let date = new Date();
    let yyyy = ""+(date.getFullYear()+1286);
    let mm = (date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : ""+(date.getMonth()+1);
    let dd = date.getDate() < 10 ? "0"+date.getDate() : ""+date.getDate();
    $("#birthday").val(yyyy+"-"+mm+"-"+dd);
    Generate();
});

async function Generate()
{
    //Get form
    let form = document.forms["licenseform"];

    //Clear previous
    ctx.textAlign = "start"; 
    ctx.clearRect(0, 0, 2000, 2000);

    //Draw background and pilot's federation logo
    await DrawImage("img/background.png",22,15);
    await DrawImage("img/pilotfedlogo.png",75,50);

    //Draw the title
    ctx.fillStyle = colors.orange;
    ctx.font = "50px eurocaps";
    ctx.fillText("Pilot's Federation", 290, 100);
    ctx.font = "100px eurocaps";
    ctx.fillText("Commander License", 285, 175);

    //Draw the uploaded picture
    await DrawImg(pic,45,275,525,525);

    //Draw CMDR name and underline 
    if(form["name"].value)
    {
        name = form["name"].value;
    }
    else
    {
        name = form["name"].placeholder;
    }
    //Scale name based on width
    ctx.font = Math.min(100/ctx.measureText("CMDR "+name).width*750, 100) + "px eurocaps";
    ctx.fillText("CMDR "+name, 600, 350);
    ctx.fillRect(590, 360, 1300, 5);

    //Draw faction icon based on name width
    await DrawImage("img/factions/"+form["faction"].value+".png",600+ctx.measureText("CMDR "+name).width+50,275);

    //Draw all titles
    ctx.font = "50px eurocaps";
    let i = 1;
    for(let title of titles)
    {
        ctx.fillText(title, 600, 360+i*60);
        ctx.fillRect(590, 370+i*60, 1300, 5);
        i++;
    }
    //Draw title values
    i = 1;
    for(let key of keys)
    {
        if(key == keys[0])
        {
            continue;
        }
        if(form[key].value)
        {
            ctx.fillText(form[key].value, 1000, 360+i*60);
        }
        else
        {
            ctx.fillText(form[key].placeholder, 1000, 360+i*60);
        }
        i++;
    }

    ctx.textAlign = "center"; 
    
    //Combat rank
    ctx.fillStyle = colors.yellow;
    let combatX = 300;
    ctx.fillText("Combat",combatX,870);
    await DrawImageCenter("img/rank/combat/BG.png",combatX,1025);
    await DrawImageCenter("img/rank/combat/rank"+(+form["combat"].value+1)+".png",combatX,1000);
    ctx.fillText(form["combat"].children[form["combat"].value].label,combatX,1160);
    
    //Trade rank
    ctx.fillStyle = colors.pinkwhite;
    let tradeX = 740;
    ctx.fillText("Trade",tradeX,870);
    await DrawImageCenter("img/rank/trade/BG.png",tradeX,1050);
    await DrawImageCenter("img/rank/trade/rank"+(+form["trade"].value+1)+".png",tradeX, 1000);
    ctx.fillText(form["trade"].children[form["trade"].value].label,tradeX,1160);
    
    //Explorer rank
    ctx.fillStyle = colors.blue;
    let explorerX = 1180;
    ctx.fillText("Explorer",explorerX,870);
    await DrawImageCenter("img/rank/explorer/BG.png",explorerX, 1000);
    await DrawImageCenter("img/rank/explorer/rank"+(+form["explorer"].value+1)+".png",explorerX,1000);
    ctx.fillText(form["explorer"].children[form["explorer"].value].label,explorerX,1160);
    
    //CQC rank
    ctx.fillStyle = colors.red;
    let CQCX = 1620;
    ctx.fillText("CQC",CQCX,870);
    await DrawImageCenter("img/rank/cqc/BG.png",CQCX,950);
    await DrawImageCenter("img/rank/cqc/rank"+(+form["cqc"].value+1)+".png",CQCX,1000);
    ctx.fillText(form["cqc"].children[form["cqc"].value].label,CQCX,1160);

    if(form["combat"].value == 8 && form["trade"].value == 8 && form["explorer"].value == 8)
    {
        await DrawImage("img/tripleelite.png",68,60);
    }
}

async function DrawImage(src, x, y, width=null, height=null)
{
        var img = await LoadImage(src);
        width&&height ?
        ctx.drawImage(img, x, y, width, height):
        ctx.drawImage(img, x, y);
        return;
}

async function DrawImg(img, x, y, width=null, height=null)
{
        width&&height ?
        ctx.drawImage(img, x, y, width, height):
        ctx.drawImage(img, x, y);
        return;
}

async function DrawImageCenter(src, x, y)
{
        var img = await LoadImage(src);
        x-=img.width/2;
        y-=img.height/2;
        ctx.drawImage(img, x, y);
        return;
}

function LoadImage(src)
{
    return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = src; });
}

function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            pic = img;
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

async function Save()
{   
    await Generate();
    var link = $('#link')[0];
    link.setAttribute('download', 'CMDRLicense-'+name+'.png');
    link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.click();
}
