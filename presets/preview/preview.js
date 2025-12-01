import {addBtnAnim, presetsJSONUrl, presetsDirUrl, processPath, possibleThemeAttrs, themeAttrNames, themeAttrResolve} from "../../lib/globals.js";
import {loadJSONRunFunc} from "../../lib/json-elements.js";

const params = new URLSearchParams(window.location.search);
const theme = params.get("theme");
const headerTitle = document.getElementById("head").getElementsByTagName("h1").item(0);
const container = document.getElementById("theme-preview");

function loadCursor(name, theme, zippath, zipName) {
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
        switch (type) {
            case "bg":
                let bgImg = document.createElement("img");
                bgImg.className = 'cursor-preview';
                bgImg.src = processPath(theme[type], presetsDirUrl);
                part.appendChild(bgImg);
                break;

            case "mode":
                let txt = document.createElement("p");
                txt.innerHTML = theme[type];
                txt.style.fontFamily = "'ConcertOne'";
                txt.style.fontSize = "3em";
                txt.style.color = themeAttrResolve(theme[type], "mode");
                txt.style.textShadow = "1px 1px 0px #aaa, -1px 1px 0px #aaa, 1px -1px 0px #aaa, -1px -1px 0px #aaa";
                part.appendChild(txt);
                break;

            case "accent":
                let colorSpace = document.createElement("div");
                colorSpace.style.backgroundColor = themeAttrResolve(theme[type], "accent");
                colorSpace.className = 'centered';
                colorSpace.style.width = "200px";
                colorSpace.style.height = "100px";
                colorSpace.style.borderRadius = "20px";
                part.appendChild(colorSpace);
                break;
        }
        part.appendChild(cursorName);
        setDetails.appendChild(part);
    }
    block.appendChild(setDetails);
    let btn = document.createElement("button");
    btn.innerHTML = "Download Theme";
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