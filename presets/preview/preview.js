import {addBtnAnim, presetsJSONUrl, presetsDirUrl, envVarPaths, processPath, possibleThemeAttrs, themeAttrNames} from "../../lib/globals.js";
import {loadJSONRunFunc} from "../../lib/json-elements.js";

const params = new URLSearchParams(window.location.search);
const theme = params.get("theme");
const headerTitle = document.getElementById("head").getElementsByTagName("h1").item(0);
const container = document.getElementById("theme-preview");

function loadCursor(name, theme) {
    document.title = `Viskit - ${name}`;
    headerTitle.innerHTML = name;
    let block = document.createElement("div");
    block.className = 'block';
    let setDetails = document.createElement("div");
    setDetails.className = 'detail-bar';
    for (let type in theme) {
        if (!(possibleThemeAttrs.includes(type))) {
            continue
        }
        let part = document.createElement("div");
        let cursorName = document.createElement("h3");
        cursorName.innerHTML = themeAttrNames[possibleThemeAttrs.indexOf(type)];
        cursorName.style.letterSpacing = "2px";
        if (type === "bg") {
            let bgImg = document.createElement("img");
            bgImg.className = 'cursor-preview';
            bgImg.src = processPath(theme[type], new URL("../../assets/themes/presets", import.meta.url));
            part.appendChild(bgImg);
        }
        part.appendChild(cursorName);
        setDetails.appendChild(part);
    }
    block.appendChild(setDetails);
    let btn = document.createElement("button");
    btn.innerHTML = "Download Cursor Set";
    btn.addEventListener("click", () => {
        /*
        const lnk = document.createElement("a");
        lnk.href = zippath;
        lnk.download = zipName;
        document.body.appendChild(lnk);
        lnk.click();
        document.body.removeChild(lnk); */
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

function loadJSONCursors() {
    loadJSONRunFunc(presetsJSONUrl, data => {
        data.forEach(element => {
            if (element.id === theme) {
                loadCursor(element.name, element.theme);
            }
        })
    }, "THEMEPREVIEW")
};

if (theme !== null) {
    loadJSONCursors();
}