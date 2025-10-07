let container = document.getElementById('cursor-container');

function loadCursor(name, pictures, zippath, zipName) {
    let block = document.createElement("div");
    block.className = 'block';
    let title = document.createElement("h3");
    title.innerHTML = name;
    block.appendChild(title);
    let link = document.createElement("a");
    link.href = zippath;
    link.download = zipName
    let img = document.createElement("img");
    img.src = pictures[0];
    link.appendChild(img);
    block.appendChild(link);
    container.appendChild(block);
    console.log(img.src);
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
