import {possibleCursorTypes, curImgsDirUrl, globalCursorsJSONUrl, requestCursorsJSONUrl} from "./globals.js";
import {loadJSONRunFunc} from "../../lib/json-elements.js";

let container = document.getElementById('cursor-container');
const previewUrl = new URL('../preview/', import.meta.url).href;

function loadCursor(name, previewType, pictures, id, cursorPreviews) {
    let block = document.createElement("div");
    block.className = 'block';
    let title = document.createElement("h3");
    title.innerHTML = name;
    block.appendChild(title);
    let link = document.createElement("a");
    link.href = previewUrl + `?cur=${id}&type=${previewType}`;
    let picBar = document.createElement("div");
    picBar.className = 'container';
    pictures.forEach(element => {
        let img = document.createElement("img");
        img.src = element;
        picBar.appendChild(img);
    });
    link.appendChild(picBar);
    block.appendChild(link);
    let setDetails = document.createElement("div");
    setDetails.className = 'detail-bar';
    for (let type in cursorPreviews) {
        if (!(possibleCursorTypes.includes(type))) {
            continue
        }
        let cursorImg = document.createElement("img");
        cursorImg.className = 'cursor-preview';
        cursorImg.src = curImgsDirUrl.pathname + cursorPreviews[type];
        setDetails.appendChild(cursorImg);
    }
    block.appendChild(setDetails)
    container.appendChild(block);
};

export function loadJSONCursors(type) {
    switch (type) {
        case "main":
            var jsonUrl = globalCursorsJSONUrl;
            var debugName = 'MAIN';
            break;

        case "requests":
            var jsonUrl = requestCursorsJSONUrl;
            var debugName = 'REQ';
            break;
    }
    loadJSONRunFunc(jsonUrl, data => {
        data.forEach(element => {
            let picpaths = [];
            element.pics.forEach(picpath => {
                picpaths.push(curImgsDirUrl.pathname + picpath);
            });
            loadCursor(element.name, type, picpaths, element.id, element.preview);
        })
    }, `CURLAYOUT-${debugName}`)
};