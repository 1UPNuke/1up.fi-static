let path = "./img/";
let pre = "";
let suf = "";
let format = ".png";
let textField, genText;

function Init()
{
    genText = document.getElementById("gen-text");
    textField = document.getElementById("text-field");
    Update();
}

function Update()
{
    genText.innerHTML = "";
    for(let line of textField.value.split("\n"))
    {
        for(let letter of line)
        {
            let char = letter.charCodeAt(0);
            let img = new Image();
            img.src = path+pre+char+suf+format;
            genText.appendChild(img);
        }
        genText.innerHTML += "<br/>";
    }
}