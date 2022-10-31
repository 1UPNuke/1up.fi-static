'use strict';

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

var defaultUserConfig = {
    width: 3,
    height: 3,
    timer: 0,
    playerOne: "Player 1",
    playerTwo: "Player 2",
}

if  (window.localStorage.getItem('userConfig') == null)
{
    window.userConfig = defaultUserConfig;
}
else
{
    try
    {
        window.userConfig= JSON.parse(window.localStorage.getItem('userConfig'));
    }
    catch
    {
        window.userConfig = defaultUserConfig;
    }
}

function start()
{
    document.getElementById("mainmenu").classList.add("hidden");
    document.getElementById("config").classList.remove("hidden");
    window.UI = {
        sliders: {
            width: document.getElementById("width-slider"),
            height: document.getElementById("height-slider"),
            text: {
                width: document.getElementById("width-slider-number"),
                height: document.getElementById("height-slider-number")
            }
        },
        numbers: {
            timer: document.getElementById("timer")
        },
        textInput: {
            playerOne: document.getElementById("player-one-name"),
            playerTwo: document.getElementById("player-two-name")
        }
    }
    UI.sliders.width.value = window.userConfig.width;
    UI.sliders.height.value = window.userConfig.height+1;
    UI.numbers.timer.value = window.userConfig.timer;
    UI.textInput.playerOne.placeholder = window.userConfig.playerOne;
    UI.textInput.playerTwo.placeholder = window.userConfig.playerTwo;
    updateSliders();
}

function rules()
{
    playSound("sounds/Menu.wav");
    document.getElementById("mainmenu").classList.add("hidden");
    document.getElementById("rules").classList.remove("hidden");
}

function mainMenu()
{
    document.getElementById("mainmenu").classList.remove("hidden");
    document.getElementById("rules").classList.add("hidden");
    document.getElementById("config").classList.add("hidden");
    playSound("sounds/Menu.wav");
}

function updateSliders()
{
    playSound("sounds/menuSlider.wav");
    window.boardWidth = parseInt(UI.sliders.width.value) * 2 + 1;
    window.boardHeight = parseInt(UI.sliders.width.value) * 2 + parseInt(UI.sliders.height.value);
    UI.sliders.text.width.textContent = boardWidth;
    UI.sliders.text.height.textContent = boardHeight;
}

function startGame()
{
    playSound("sounds/Start.wav");
    let P1 = UI.textInput.playerOne;
    let P2 = UI.textInput.playerTwo;
    window.userConfig = {
        width: parseInt(UI.sliders.width.value),
        height: parseInt(UI.sliders.width.value),
        timer: parseInt(UI.numbers.timer.value),
        playerOne: P1.value != "" ? P1.value : P1.placeholder,
        playerTwo: P2.value != "" ? P2.value : P2.placeholder
    }
    window.localStorage.setItem('userConfig', JSON.stringify(window.userConfig));
    document.getElementById("config").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    window.gameState = {
        turn: 1,
        selected: [],
        highlighted: [],
        timer: window.userConfig.timer*1000
    }
    if(window.userConfig.timer > 0)
    {
        setInterval(tickDown, 50);
    }
    buildBoard();
}

function buildBoard()
{
    let rotateP2 = false;
    let rotated = true;
    let width = window.boardWidth;
    let height = window.boardHeight;
    window.boardMatrix = Array(width).fill().map(()=>Array(height).fill());
    let p2pos = Array(height).fill().map(()=>Array(width).fill());
    let board = document.getElementById("board");
    window.tbody = document.createElement("tbody");
    for (var y = 0; y < height; y++) {
        var tr = document.createElement('tr');
        for (var x = 0; x < width; x++) 
        {
                var td = document.createElement('td');
                let space = document.createElement('div');
                window.boardMatrix[x][y] = space;
                (function(space, x, y){space.addEventListener("click", e=>cellClick(e, x, y))}(space, x, y));
                space.classList.add("boardSpace");
                let totalArea = 60;
                space.setAttribute("style", `width:${totalArea/height}vh; max-width:${totalArea/width}vw; height:${totalArea/height}vh; max-height:${totalArea/height}vh;`);
                space.setAttribute("alt", "piece");
                if (x >= y && x < width - y)
                {
                    space.classList.add("piece");
                    space.classList.add("player-one");
                    p2pos[(height-1-y)][x] = 1;
                    if (rotated)
                    {
                        space.classList.add("rotated");
                    }
                }
                if(p2pos[y][x] == 1)
                {
                    if(!rotateP2)
                    {
                        rotated = true;
                        rotateP2 = true;
                    }
                    space.classList.add("piece");
                    space.classList.add("player-two");
                    if (rotated)
                    {
                        space.classList.add("rotated");
                    }
                }
                rotated = !rotated;
                td.appendChild(space);
                tr.appendChild(td);
        }
      tbody.appendChild(tr);
    }
    board.appendChild(tbody);
}

function cellClick(event, x, y)
{
    let validMove = false;
    let selected = window.gameState.selected;
    let highlighted = window.gameState.highlighted;
    let turn = window.gameState.turn;
    let element = event.target;
    let sel = selected[0];
    if(highlighted.length != 0)
    {
        for(let highlight of highlighted)
        {
            highlight.classList.remove("selected");
        }
        window.gameState.highlighted = [];
    }
    if(selected.length!=0)
    {
        if (sel.el.classList.contains("rotated"))
        {
            if((x == sel.x+1 && (y == sel.y+1 || y == sel.y-1)))
            {
                validMove = true;
            }
            else if(x == sel.x-1 && (y == sel.y+1 || y == sel.y-1))
            {
                validMove = true;
            }
        }
        else
        {
            if((x == sel.x+1 || x == sel.x-1) && y == sel.y)
            {
                validMove = true;
            }
            else if((y == sel.y+1 || y == sel.y-1) && x == sel.x)
            {
                validMove = true;
            }
        }
        if(y == sel.y && x == sel.x)
        {
            validMove = true;
        }

        for(let select of selected)
        {
            select.el.classList.remove("selected");
        }
        window.gameState.selected = [];
    }

    if(validMove)
    {
        let piece = sel.el;
        let dest = element;
        let side = piece.classList.contains("player-one") ? "player-one" : "player-two";
        let enemy = piece.classList.contains("player-one") ? "player-two" : "player-one";
        if(sel.x == x && sel.y == y)
        {
            playSound("sounds/PieceMove.wav");
            piece.classList.toggle("rotated");
        }
        else if(dest.classList.contains(side))
        {
            playSound("sounds/PieceSwitch.wav");
            piece.classList.toggle("rotated");
            dest.classList.toggle("rotated");
        }
        else
        {
            if(dest.classList.contains(enemy))
            {
                playSound("sounds/PieceDestroyed.wav");
            }
            else
            {
                playSound("sounds/PieceMove.wav");
            }
            dest.className = piece.className;
            piece.className = "boardSpace";
            dest.classList.toggle("rotated");
        }
        window.gameState.turn+=1;
        window.gameState.timer = window.userConfig.timer*1000;
        checkWin();
    }
    else if(turn%2 != 0 && element.classList.contains("player-one"))
    {
        selected.push({el:element, x:x, y:y});
        highlighted.push(element);
        element.classList.add("selected");
    }
    else if(turn%2 == 0 && element.classList.contains("player-two"))
    {
        selected.push({el:element, x:x, y:y});
        highlighted.push(element);
        element.classList.add("selected");
    }
    highlightMoves(element, x, y);
}

function checkWin()
{
    let didWin = false;
    let messageText = document.getElementById("victory-message");

    if(document.getElementsByClassName("player-one").length == 0)
    {
        messageText.textContent = window.userConfig.playerTwo + " wins!";
        didWin = true;
    }
    else if(document.getElementsByClassName("player-two").length == 0)
    {
        messageText.textContent = window.userConfig.playerOne + " wins!";
        didWin = true;
    }
    else if(window.gameState.turn%2 != 0 && window.gameState.timer < 0)
    {
        messageText.textContent = window.userConfig.playerOne + " ran out of time!";
        didWin = true;
    }
    else if(window.gameState.turn%2 == 0 && window.gameState.timer < 0)
    {
        messageText.textContent = window.userConfig.playerTwo + " ran out of time!";
        didWin = true;
    }

    if(didWin)
    {
        document.getElementById("victory-message-box").classList.remove("hidden");
        clearInterval();
    }
}

function highlightMoves(element, x, y)
{
    if((window.gameState.turn%2 != 0 && element.classList.contains("player-one")) || (window.gameState.turn%2 == 0 && element.classList.contains("player-two")))
    {
        let xValues = [(x+1), (x-1)];
        let yValues = [(y+1), (y-1)];
        if (element.classList.contains("rotated"))
        {
            for(let xValue of xValues)
            {
                for(let yValue of yValues)
                {
                    if(window.boardMatrix[xValue] != undefined)
                    {
                        if(window.boardMatrix[xValue][yValue] != undefined)
                        {
                            window.gameState.highlighted.push(window.boardMatrix[xValue][yValue]);
                        }
                    }
                }
            }
        }
        else
        {
            for(let xValue of xValues)
            {
                if(window.boardMatrix[xValue] != undefined)
                {
                    if(window.boardMatrix[xValue][y] != undefined)
                    {
                        window.gameState.highlighted.push(window.boardMatrix[xValue][y]);
                    }
                }
            }
            for(let yValue of yValues)
            {
                if(window.boardMatrix[x][yValue] != undefined)
                {
                    window.gameState.highlighted.push(window.boardMatrix[x][yValue]);
                }
            }
        }
        for(let highlight of window.gameState.highlighted)
        {
            highlight.classList.add("selected");
        }
    }
}

function tickDown()
{
    window.gameState.timer -= 50;
    document.getElementById("timer-text").textContent = (window.gameState.timer/1000).toFixed(0);
    if(window.gameState.timer < 0)
    {
        checkWin();
    }
}

function playSound(audiofile)
{
    var audio = new Audio(audiofile);
    audio.volume = 0.2;
    audio.play();
}


function openFullscreen() {

    document.exitFullscreen();

    let elem = document.documentElement; 

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}
