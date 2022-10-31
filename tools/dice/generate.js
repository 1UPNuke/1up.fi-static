let lastSrc;
function generate(){
    let bg = encodeURIComponent(document.getElementById("bg").value);
    let pip = encodeURIComponent(document.getElementById("pip").value);
    let shading = encodeURIComponent(document.getElementById("shading").value);
    let width = encodeURIComponent(document.getElementById("width").value);
    let height = encodeURIComponent(document.getElementById("height").value);
    let css = document.getElementById("css").value;

    let url = `//1up.fi/tools/dice/embed.js`;
    url += [
        "?bg="+bg,
        "&pip="+pip,
        shading ? "&shading="+shading : "",
        width ? "&width="+width : "",
        height ? "&height="+height : "",
    ].join("");

    let embed = "<script src='"+url+"' type='module' "+ (css ? "style='" + css + "'": "") +"></script>";
    document.getElementById("embed").textContent = embed;
    let script = document.createElement("script");
    script.src = url;
    script.type = "module";
    css ? script.style = css : null;
    
    dicediv = document.getElementById("dicediv");
    if(script.src != dicediv.childNodes[0].src && script.src != lastSrc)
    {
        dicediv.innerHTML = "";
        dicediv.appendChild(script);
        lastSrc = script.src;
    }
}