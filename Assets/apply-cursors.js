let container = document.getElementById('cursor-container');
const possibleCursorTypes = ["mouse", "select", "busy", "text", "work-in-bg"];
export const globalCursorsJSONUrl = new URL('./Cursors/cursors.json', import.meta.url).href;
export const requestCursorsJSONUrl = new URL('./Cursors/requested-cursors.json', import.meta.url).href;
let cursorsDirUrl = new URL('./Cursors/', import.meta.url);

function loadCursor(name, pictures, zippath, zipName, supportsHover, cursorPreviews) {
    let block = document.createElement("div");
    block.className = 'block';
    let title = document.createElement("h3");
    title.innerHTML = name;
    block.appendChild(title);
    let link = document.createElement("a");
    link.href = zippath;
    link.download = zipName
    let picBar = document.createElement("div");
    picBar.className = 'container';
    pictures.forEach(element => {
        let img = document.createElement("img");
        img.src = element;
        picBar.appendChild(img);
    });
    link.appendChild(picBar);
    block.appendChild(link);
    if (supportsHover) {
        let setDetails = document.createElement("div");
        setDetails.className = 'detail-bar';
        for (let type in cursorPreviews) {
            console.log(type);
            if (!(possibleCursorTypes.includes(type))) {
                continue
            }
            console.log("In Cursor Types")
            let cursorImg = document.createElement("img");
            cursorImg.className = 'cursor-preview';
            cursorImg.src = cursorsDirUrl.pathname + cursorPreviews[type];
            setDetails.appendChild(cursorImg);
        }
        block.appendChild(setDetails)
    };
    container.appendChild(block);
};

export function loadJSONCursors(cursorsJSONUrl) {
    fetch(cursorsJSONUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(element => {
                let picpaths = [];
                element.pics.forEach(picpath => {
                    picpaths.push(cursorsDirUrl.pathname + picpath);
                });
                loadCursor(element.name, picpaths, cursorsDirUrl.pathname + element.zip, element.downloadName, element.supportsHover, element.preview);
        });
        console.log(data);
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });
};