const params = new URLSearchParams(window.location.search);
const cursor = params.get("cur");
const type = params.get("type");
const possibleCursorTypes = ["mouse", "select", "busy", "text", "work-in-bg", "arrow-all", "arrow-nesw", "arrow-nwse", "arrow-ns", "arrow-ew"];
const cursorTypeNames = ["Mouse", "Select", "Busy", "Text", "Work in Background", "Move", "Diagonal Arrow 1", "Diagonal Arrow 2", "Arrow Vertical", "Arrow Horizontal"];
const headerTitle = document.getElementById("head").getElementsByTagName("h1").item(0);
const backLnk = document.getElementById("head").getElementsByTagName("a").item(0);
const globalCursorsJSONUrl = new URL('../Assets/cursors.json', import.meta.url).href;
const requestCursorsJSONUrl = new URL('../Assets/requested-cursors.json', import.meta.url).href;
const cursorsDirUrl = new URL('../api/assets/cursorImgs/', import.meta.url);
const zipDirUrl = new URL("../api/assets/cursorSets/", import.meta.url);
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
        cursorImg.src = cursorsDirUrl.pathname + cursorPreviews[type];
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

    btn.addEventListener("mousedown", () => {
        btn.style.padding = "7px";
        btn.style.margin = "6px";
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.padding = '10px';
        btn.style.margin = "3px";
    });

    btn.addEventListener('mouseup', () => {
        btn.style.padding = '13px';
        btn.style.margin = "0px";
        setTimeout(() => {
            btn.style.padding = '10px';
            btn.style.margin = '3px';
        }, 150)
    });
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
                    loadCursor(element.name, zipDirUrl.pathname + element.zip, element.downloadName, element.preview);
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