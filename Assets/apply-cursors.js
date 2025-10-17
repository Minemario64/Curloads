let container = document.getElementById('cursor-container');
const possibleCursorTypes = ["mouse", "select", "busy", "text", "work-in-bg"];
export const globalCursorsJSONUrl = new URL('./Cursors/cursors.json', import.meta.url).href;
export const requestCursorsJSONUrl = new URL('./Cursors/requested-cursors.json', import.meta.url).href;
let cursorsDirUrl = new URL('./Cursors/', import.meta.url);
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
        cursorImg.src = cursorsDirUrl.pathname + cursorPreviews[type];
        setDetails.appendChild(cursorImg);
    }
    block.appendChild(setDetails)
    container.appendChild(block);
};

export function loadJSONCursors(cursorsJSONUrl, type) {
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
                loadCursor(element.name, type, picpaths, element.id, element.preview);
        });
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });
};