import {possibleCursorTypes, cursorTypeNames, globalCursorsJSONUrl, requestCursorsJSONUrl, curImgsDirUrl, curSetsDirUrl} from "../lib/globals.js";
import {addBtnAnim} from "../../lib/globals.js";
import {loadJSONRunFunc} from "../../lib/json-elements.js";

const params = new URLSearchParams(window.location.search);
const cursor = params.get("cur");
const type = params.get("type");
const headerTitle = document.getElementById("head").getElementsByTagName("h1").item(0);
const backLnk = document.getElementById("head").getElementsByTagName("a").item(0);
const container = document.getElementById("cursor-preview");

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
        cursorImg.src = curImgsDirUrl.pathname + cursorPreviews[type];
        part.appendChild(cursorImg);
        part.appendChild(cursorName);
        setDetails.appendChild(part);
    }
    block.appendChild(setDetails);
    let btn = document.createElement("button");
    btn.innerHTML = "Download Cursor Set";
    btn.addEventListener("click", () => {
        const lnk = document.createElement("a");
        lnk.href = zippath;
        lnk.download = zipName;
        document.body.appendChild(lnk);
        lnk.click();
        document.body.removeChild(lnk);
        setTimeout(() => {
            popup.style.display = 'flex';
            popup.style.opacity = '1.0';
        }, 500)
    });

    addBtnAnim(btn);
    block.appendChild(btn);
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('close-popup');

    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    container.appendChild(block);
};

function loadJSONCursors(type) {
    switch (type) {
        case "main":
            var jsonUrl = globalCursorsJSONUrl;
            var debug = "MAIN";
            break;

        case "requests":
            var jsonUrl = requestCursorsJSONUrl;
            var debug = "REQ";
            break;
    }
    loadJSONRunFunc(jsonUrl, data => {
        data.forEach(element => {
            if (element.id === cursor) {
                loadCursor(element.name, curSetsDirUrl.pathname + element.zip, element.downloadName, element.preview);
            }
        })
    }, `CURPREVIEW-${debug}`)
};

switch (type) {
    case "main":
        backLnk.href = '../downloads/';
        if (cursor !== null) {
            loadJSONCursors(type);
        }
        break;

    case "requests":
        backLnk.href = "../requests/";
        if (cursor !== null) {
            loadJSONCursors(type);
        }
        break;
}