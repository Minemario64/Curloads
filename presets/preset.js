import {presetsJSONUrl, processPath} from "../lib/globals.js";
import {loadJSONRunFunc} from "../lib/json-elements.js";

const container = document.getElementById("presets-container");

function loadCursor(name, id, bgPath) {
    let block = document.createElement("div");
    block.className = 'block';
    let title = document.createElement("h3");
    title.innerHTML = name;
    block.appendChild(title);
    /*
    FOR PREVIEW, WHEN MADE FOR PRESETS

    let link = document.createElement("a");
    link.href = previewUrl + `?cur=${id}&type=${previewType}`;
    */
    let img = document.createElement("img");
    img.src = bgPath;
    img.style.width = "200px";
    img.style.borderRadius = "20px";
    block.appendChild(img);
    container.appendChild(block);
};

loadJSONRunFunc(presetsJSONUrl, data => {
    data.forEach(element => {
        let bgPath = processPath(element.theme.bg, new URL("../assets/themes/presets/", import.meta.url));
        console.log(bgPath);
        loadCursor(element.name, element.id, bgPath);
    });
}, "PRESET-PAGE")