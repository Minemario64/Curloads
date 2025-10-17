const params = new URLSearchParams(window.location.search);
const cursor = params.get("cur");
const type = params.get("type");
const possibleCursorTypes = ["mouse", "select", "busy", "text", "work-in-bg"];
const cursorTypeNames = ["Mouse", "Select", "Busy", "Text", "Work in Background"];
const headerTitle = document.getElementById("head").getElementsByTagName("h1").item(0);
const backLnk = document.getElementById("head").getElementsByTagName("a").item(0);
const globalCursorsJSONUrl = new URL('../Assets/Cursors/cursors.json', import.meta.url).href;
const requestCursorsJSONUrl = new URL('../Assets/Cursors/requested-cursors.json', import.meta.url).href;
const cursorsDirUrl = new URL('../Assets/Cursors/', import.meta.url);
const container = document.getElementById("cursor-preview")

function loadCursor(name, zippath, zipName, cursorPreviews) {
    document.title = `Curloads - ${name}`;
    headerTitle.innerHTML = name;
    let block = document.createElement("div");
    block.className = 'block';
    let setDetails = document.createElement("div");
    setDetails.className = 'detail-bar';
    for (let type in cursorPreviews) {
        if (!(possibleCursorTypes.includes(type))) {
            continue
        }
        let part = document.createElement("div");
        let cursorName = document.createElement("h3");
        cursorName.innerHTML = cursorTypeNames[possibleCursorTypes.indexOf(type)];
        cursorName.style.letterSpacing = "2px";
        let cursorImg = document.createElement("img");
        cursorImg.className = 'cursor-preview';
        cursorImg.src = cursorsDirUrl.pathname + cursorPreviews[type];
        part.appendChild(cursorImg);
        part.appendChild(cursorName);
        setDetails.appendChild(part);
    }
    block.appendChild(setDetails);
    let lnk = document.createElement("a");
    lnk.className = "lnk";
    lnk.innerHTML = "Download Cursor Set";
    lnk.href = zippath;
    lnk.download = zipName;
    block.appendChild(lnk);
    container.appendChild(block);
};

function loadJSONCursors(cursorsJSONUrl) {
    fetch(cursorsJSONUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(element => {
                if (element.id === cursor) {
                    loadCursor(element.name, cursorsDirUrl.pathname + element.zip, element.downloadName, element.preview);
            }
        });
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });
};

switch (type) {
    case "main":
        backLnk.href = '../downloads/';
        if (cursor !== null) {
            loadJSONCursors(globalCursorsJSONUrl);
        }
        break;

    case "requests":
        backLnk.href = "../requests/";
        if (cursor !== null) {
            loadJSONCursors(requestCursorsJSONUrl);
        }
        break;
}