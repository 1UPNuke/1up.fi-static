const cupImgPath = "img/cups/";
const header = "CUP2\0\0\0";
let offset = 0;
let cups = 54;
//Create a 2 dimensional array of cups filled with empty tracks:
//[
//    [0xFF, 0xFF, 0xFF, 0xFF],
//    [0xFF, 0xFF, 0xFF, 0xFF],
//    [0xFF, 0xFF, 0xFF, 0xFF],
//    ...
//]
let cupArr = new Array(cups).fill(0).map(()=>new Array(4).fill(0xFF));
let curCup = 1;

window.onload = () => {
    refresh();
}

function refresh()
{
    //Run various functions to refresh the UI of the program
    listTracks();
    listCups();
    loadCup(curCup);
    document.getElementById("cupinput").value = cups;
}

function listCups() {
    //Clear the list of cups
    let cuplist = document.getElementById("cuplist");
    cuplist.innerHTML = "";
    //Loop through the next set of 6 (or less if uneven) cups
    for(let i = 1+Math.ceil(offset)*2; i <= 6+offset*2; i++)
    {
        //If cup is outside cup count, don't render it
        if(i>cups) break;
        //Create a button and give it an ID of the current cup
        let button = document.createElement("button");
        button.id = "cup-" + i;
        //If cup is currently selected, highlight it
        if(i == curCup) button.classList.add("selected");
        //Load tracks within cup on click
        button.onclick = ()=>loadCup(i)
        //Load image from image path with its corresponding ID
        let img = new Image();
        img.draggable = false;
        button.appendChild(img);
        cuplist.appendChild(button);
        img.src = cupImgPath + i + ".png";
    }
}

function listTracks()
{
    //Clear the list of tracks
    let trackList = document.getElementById("tracklist");
    trackList.innerHTML = "";
    //When something is dropped onto the list of tracks, handle it
    trackList.ondragover = (ev)=>ev.preventDefault();
    trackList.ondrop = ontracklistdrop;
    //For every track
    for(let track of Object.keys(trackNames))
    {
        trackName = trackNames[track];
        //If track is already in one of the cups, don't list it
        if(cupArr.flat().indexOf(parseInt(track)) > -1) continue;
        //Change the track to its hecadecimal notation, since we no longer need the integer
        track = parseInt(track).toString(16);
        //If track is one of the unusable tracks, don't list it
        if(inBlacklist(trackName)) continue;
        //Create list item and give it the track name
        let li = document.createElement("li");
        li.textContent = trackName;
        //Set the ID to the hexadecimal representation of the track ID
        li.id = "track-"+track;
        //Make list item draggable
        li.draggable = true;
        li.ondragstart = ondragstart;
        //Set the embedded 
        li.onclick = (ev)=> {
            let url ="https://wiki.tockdom.com/wiki/"+ev.target.textContent.replaceAll(" ", "_")
            document.getElementById("wikipreview").src = url;
            document.getElementById("wikilink").src = url;
        }
        //Add list item to list
        trackList.append(li);
    }
    //Sort the list of tracks alphabetically
    sortedTracks = Array.from(trackList.childNodes).sort((a,b)=>a.textContent.localeCompare(b.textContent))
    trackList.innerHTML = "";
    sortedTracks.forEach(x=>trackList.appendChild(x))
}

function changeOffset(amount)
{
    offset += amount;
    //If offset is outside of bounds, bring it back in
    if(offset > cups/2-3) offset = cups/2-3;
    else if(offset < 0) offset = 0;
    listCups();
}

function loadCup(n)
{
    //Set the current cup to this one
    curCup = n;
    //Get the cup's element and highlight it
    document.getElementById("cup-"+n).classList.add("selected");
    //Load cup's track selection
    loadTrackSelect(n);
    //List the cups again to clear other highlighted cups
    listCups();
}

function loadTrackSelect(cup)
{
    //Add the number of the cup to the track select
    let trackselect = document.getElementById("trackselector");
    trackselect.innerHTML = `<h1>CUP ${cup}</h1>`;
    //Loop through the 4 tracks
    for(let i=0; i<4; i++)
    {
        //Use div because Firefox doesn't let buttons be draggable outside of textContent
        let btn = document.createElement("div");
        //Get the track from the current cup in the right slot
        let track = cupArr[cup-1][i];
        //Set the ID to the hexadecimal representation of the track ID
        btn.id = "track-"+track.toString(16);
        //Set the textContent to the track name
        btn.textContent = trackNames[track];
        //Make the button draggable and allow tracks to be dropped onto it
        btn.draggable = true;
        btn.ondragover = (ev)=>ev.preventDefault();
        btn.ondrop = onbuttondrop;
        btn.ondragstart = ondragstart;
        //When clicked show the page on the wiki of this track
        btn.onclick = setEmbedUrl;
        //Store the cup slot and the cup on the button
        btn.cupSlot = i;
        btn.cup = cup;
        //Add the button to the track select
        trackselect.append(btn);
    }
}

function ondragstart(ev)
{
    //If track has no ID (is empty), set a temporary one
    if(!ev.target.id) ev.target.id = "temp-id";
    //Store the ID of this element
    ev.dataTransfer.setData("id", ev.target.id);
    //Store the track name
    ev.dataTransfer.setData("trackName", ev.target.textContent);
    //Store the track ID
    ev.dataTransfer.setData("track", ev.target.id.replace("track-", ""));
}

function onbuttondrop(ev)
{
    ev.preventDefault();
    //Get track variables
    let track = ev.dataTransfer.getData("track");
    let id = ev.dataTransfer.getData("id");
    let other = document.getElementById(id);
    //If dropped element has the temporary ID, remove it
    if(id == "temp-id") other.removeAttribute('id');
    //Get reference to self
    let btn = ev.target;
    //If other element is also a trackselector button
    if(other.parentElement.id == "trackselector")
    {
        //Swap IDs with it
        let otherID = other.id;
        other.id = btn.id;
        btn.id = otherID;

        //Swap track names with it
        let otherText = other.textContent;
        other.textContent = btn.textContent;
        btn.textContent = otherText;

        //Swap the positions of the tracks in the cup array
        let otherTrack = cupArr[btn.cup-1][other.cupSlot];
        cupArr[btn.cup-1][other.cupSlot] = cupArr[btn.cup-1][btn.cupSlot];
        cupArr[btn.cup-1][btn.cupSlot] = otherTrack;
    }
    else
    {
        //If track is instead from list of all tracks
        //Remove the track from the list
        other.parentElement.removeChild(other);
        //Set the ID and trackname of this element to match
        btn.textContent = ev.dataTransfer.getData("trackName");
        btn.id = "track-"+ev.dataTransfer.getData("track");
        //Set the track to the proper position in the cup array
        cupArr[btn.cup-1][btn.cupSlot] = parseInt(track, 16);
    }
    refresh();
}

function ontracklistdrop(ev)
{
    ev.preventDefault();
    //Get other element ID
    let id = ev.dataTransfer.getData("id");
    //If it is temporary, stop, empty tracks cannot be added to this list
    if(id == "temp-id") return;
    //Get the other element
    let other = document.getElementById(id);
    //If it is also in this list, stop, tracks cannot be reordered in this list
    if(other.parentElement.id == "tracklist") return;
    //Since the element is from the track selector
    //Remove its text and set it to that of an empty track
    other.textContent = trackNames[0xFF];
    //Remove the ID
    other.removeAttribute('id');
    //Set the track in the cup array to empty
    cupArr[other.cup-1][other.cupSlot] = 0xFF;
    //Update the list of tracks
    listTracks();
}

function sortAllABC()
{
    //Sort all tracks in alphabetical order, if they are blacklisted, put them at the end
    cupArr = chunk(
        cupArr.flat().sort((a,b)=>{
            if(inBlacklist(a)) return 1;
            if(inBlacklist(b)) return -1;
            return trackNames[a].localeCompare(trackNames[b])
        })
    );
    refresh();
}

function sortAllID()
{
    //Sort all tracks in ID order, if they are empty, they are automatically last 0xFF
    cupArr = chunk(cupArr.flat().sort((a,b)=>a-b));
    refresh();
}

function sortCupsABC()
{
    //Sort cups' tracks individually in alphabetical order, if they are empty, put them at the end
    cupArr.forEach(x=>x=x.sort((a,b)=>{
        if(inBlacklist(a)) return 1;
        if(inBlacklist(b)) return -1;
        return trackNames[a].localeCompare(trackNames[b])
    }));
    refresh();
}

function sortCupsID()
{
    //Sort cups' tracks individually by ID, if they are empty, they are automatically last 0xFF
    cupArr.forEach(x=>x=x.sort((a,b)=>a-b));
    refresh();
}

function chunk(arr)
{
    //Split input array into sets of 4
    let size = 4;
    return arr.reduce((result, item, i) => { 
        const chunkIndex = Math.floor(i/size)
        
        if(!result[chunkIndex])
        {
          result[chunkIndex] = [] // start a new chunk
        }
        
        result[chunkIndex].push(item)
        
        return result
    }, []);
}

function loadFile(file)
{
    //If file extension isnt't .cup
    if(file.name.split('.').pop() != 'cup')
    {
        alert("File is not a valid .cup file! (incorrect file extension)");
        return;
    }
    let reader  = new FileReader();
    //Once the reader has read the file
    reader.onload = function () {
        //Get the bytes as a massive string
        let blob = reader.result;
        //Get the first 7 bytes, if they don't match the header, it is not a valid file
        if(blob.substr(0, 7) != header)
        {
            alert("File is not a valid .cup file! (incorrect header)");
            return;
        }
        //Set the amount of cups as the value of the 8th byte
        cups = blob[7].charCodeAt(0);
        //Set the cup array to a flat array filled with all the track IDs
        cupArrFlat = binStrToArr(blob.substr(8, blob.length-8));
        //Split the track array into individual cups
        cupArr = chunk(cupArrFlat);
        changeOffset(-100);
        refresh();
    }
    reader.readAsBinaryString(file);
}

function saveFile()
{
    let i = 0;
    let c = 0;
    while(i < cups)
    {
        if(inBlacklist(cupArr[i][c]))
        {
            if(!confirm("File contains unplayable/empty tracks!\nSave anyway?")) return;
            break;
        }
        c++;
        if(c>=4) c=0; i++;
    }
    //Construct a flat array of all the bytes (header + cup count + tracks)
    let bytes = [...binStrToArr(header), cups, ...cupArr.flat()];
    //Convert it to base64
    let base64data = btoa(String.fromCharCode.apply(null, bytes));
    //Create a download link
    let a = document.createElement('a');
    //Use application/octet-stream MIME type since it is a binary file
    a.href = 'data:application/octet-stream;base64,' + base64data;
    //Set filename
    a.download = 'cuplayout.cup';
    //Click the link
    a.click();
}

//Convert binary string to array of integers
const binStrToArr = str=>str.split('').map(x=>x.charCodeAt(0));


function setEmbedUrl(ev)
{
    //Set the embed URL to that of the clicked track element
    let url ="https://wiki.tockdom.com/wiki/"+ev.target.textContent.replaceAll(" ", "_")
    document.getElementById("wikipreview").src = url;
    document.getElementById("wikilink").src = url;
}