let container = document.getElementById('cursor-container');

function loadCursor(name, pictures, zippath, zipName) {
    let block = document.createElement("div");
    let picBar = document.createElement("div");
    picBar.className = 'container';
    block.className = 'block';
    let title = document.createElement("h3");
    title.innerHTML = name;
    block.appendChild(title);
    let link = document.createElement("a");
    link.href = zippath;
    link.download = zipName
    pictures.forEach(element => {
        let img = document.createElement("img");
        img.src = element;
        picBar.appendChild(img);
    });
    link.appendChild(picBar);
    block.appendChild(link);
    container.appendChild(block);
};

const cursorsJSONUrl = new URL('./Cursors/cursors.json', import.meta.url).href;
let cursorsDirUrl = new URL('./Cursors/', import.meta.url);

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
                picpaths.push(cursorsDirUrl.pathname + picpath)
            });
            loadCursor(element.name, picpaths, cursorsDirUrl.pathname + element.zip, element.downloadName);
    });
    console.log(data);
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });