document.addEventListener("DOMContentLoaded", ()=>{
    let getElemById = id=>document.getElementById(id);
    let ttrpgtime = new TTRPGTime();

    let radiobuttons = [];

    radiobuttons = document.timeform.timeformat;
    for (let rad of radiobuttons) {
        rad.addEventListener('click', e=>{
            ttrpgtime.setFormat(+e.target.value);
        });
        if(rad.checked) rad.click();
    }

    ttrpgtime.setTimescale(getElemById("timescale").value);
    getElemById("timescale").addEventListener("change", e=>ttrpgtime.setTimescale(e.target.value));

    getElemById("start").addEventListener("click", ()=>ttrpgtime.start());
    getElemById("stop").addEventListener("click", ()=>ttrpgtime.stop());
    getElemById("reset").addEventListener("click", ()=>ttrpgtime.reset());

    getElemById("combat-round").addEventListener("click", ()=>ttrpgtime.combatRound());
    getElemById("dungeon-round").addEventListener("click", ()=>ttrpgtime.dungeonRound());

    getElemById("short-rest").addEventListener("click", ()=>ttrpgtime.shortRest());
    getElemById("long-rest").addEventListener("click", ()=>ttrpgtime.longRest());

    document.querySelectorAll(".undo").forEach(e=>e.addEventListener("click", ()=>ttrpgtime.undo()));

    let timetext = document.querySelector("time");
    let datetext = getElemById("date");

    setInterval(()=>timetext.textContent = ttrpgtime.toString().split('T')[1], 10);
    setInterval(()=>datetext.textContent = ttrpgtime.toString().split('T')[0], 10);

    setInterval(()=>{
        let colors = ttrpgtime.backgroundColors();
        let gradient = `linear-gradient(0, ${colors[0]} 0%, ${colors[1]} 100%)`;
        document.body.style.backgroundImage = gradient;
    }, 100);

    const canvas = document.querySelector("canvas"); 
    const ctx = canvas.getContext("2d");
    let radius = canvas.height / 2;
    ctx.translate(radius, radius);
    radius *= 0.95;
    setInterval(()=>drawClock(canvas, ctx, radius, ttrpgtime.h, ttrpgtime.m, ttrpgtime.s), 10);
    
    function shortcut(e) {
        let ctrl = e.ctrlKey || e.metaKey;
        let alt = e.altKey;
        let shift = e.shiftKey;
        
        switch(e.key) {
            case "z":
                if(ctrl) ttrpgtime.undo();
                break;
            default:
                return;
        }
    }

    document.addEventListener("keydown", shortcut);
});