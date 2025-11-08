import {rootUrl, ipLogUrl, mixerZipUrl, mixApiEndpoints} from "../lib/globals.js";
import {addBtnAnim} from "../../lib/globals.js";

function loadCursorImgsFromApi(filter, selectElement) {
    fetch(mixApiEndpoints.getCursors + `imgs?mode=flatten&filter=${filter}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("GET Cursors response was not ok")
        }
        return response.json();
    })
    .then(data => {
        fetch(mixApiEndpoints.getCursors + `sets?mode=flatten&filter=${filter}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("GET Paths response was not ok")
            }
            return response.json();
        })
        .then(lookupPaths => {
            fetch(mixApiEndpoints.getCursors + `names?mode=flatten&filter=${filter}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("GET Names response was not ok")
                }
                return response.json();
            })
            .then(names => {
                loadCursorImgs(selectElement, data, names, lookupPaths);
            })
        })
    })
    .catch(error => {
        console.log("Error:", error);
    })
};

function loadCursorImgs(selectElement, imgs, names, lookupPaths) {
    for (let item in imgs) {
        let option = document.createElement("option");
        fetch(rootUrl.pathname + names[item])
        .then(response => {
            if (!response.ok) {
                throw new Error("Name Not good")
            }
            return response.text();
        })
        .then(data => {
            option.innerHTML = data;
        })
        option.value = lookupPaths[item];
        option.setAttribute("data-img", rootUrl.pathname + imgs[item]);
        selectElement.appendChild(option);
    }
}

function applyImgConstant(selectElement, imgElement) {
    function applyImg() {
        let imgUrl = selectElement.selectedOptions[0]?.dataset.img || "";
        imgElement.src = imgUrl;
    }
    applyImg();
    selectElement.addEventListener("change", applyImg);
}

const mouseSelect = document.getElementById("mouse-sel");
const mouseImg = document.getElementById("mouse-img");

const selectSelect = document.getElementById("select-sel");
const selectImg = document.getElementById("select-img");

const busySelect = document.getElementById("busy-sel");
const busyImg = document.getElementById("busy-img");

const textSelect = document.getElementById("text-sel");
const textImg = document.getElementById("text-img");

const wibSelect = document.getElementById("wib-sel");
const wibImg = document.getElementById("wib-img");

fetch(ipLogUrl)
.then(response => {
    if (!response.ok) {
        throw new Error("Cannot get IP Log (status not ok). Mix Maker cannot run");
    }
    return response.text();
})
.then(ip => {
    console.log(ip);
    mixApiEndpoints.getCursors = mixApiEndpoints.getCursors.replace("$[IPV4]", ip);
    mixApiEndpoints.postMix = mixApiEndpoints.postMix.replace("$[IPV4]", ip);
    console.log(mixApiEndpoints.getCursors);

    loadCursorImgsFromApi("mouse", mouseSelect);
    applyImgConstant(mouseSelect, mouseImg);

    loadCursorImgsFromApi("select", selectSelect);
    applyImgConstant(selectSelect, selectImg);

    loadCursorImgsFromApi("busy", busySelect);
    applyImgConstant(busySelect, busyImg);

    loadCursorImgsFromApi("text", textSelect);
    applyImgConstant(textSelect, textImg);

    loadCursorImgsFromApi("wib", wibSelect);
    applyImgConstant(wibSelect, wibImg);

    const downloadButton = document.getElementById("mix-download");
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('close-popup');

    downloadButton.addEventListener("click", () => {
        setTimeout(() => {
            popup.style.display = 'flex';
            popup.style.opacity = '1.0';
        }, 500)
        let selections = {
            mouse: mouseSelect.value,
            select: selectSelect.value,
            busy: busySelect.value,
            text: textSelect.value,
            wib: wibSelect.value,
        };

        fetch(mixApiEndpoints.postMix, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(Object.entries(selections).filter(([_, path]) => !!path)))
        })
        .then(response => {
            if (response.status !== 201) {
                throw new Error("Mix Zipper response was not ok");
            }
            return response.json();
        })
        .then((zipPath) => {
            let lnk = document.createElement("a");
            lnk.href = mixerZipUrl.pathname + zipPath.url;
            lnk.download = "mix-maker-cursors.zip";
            document.body.appendChild(lnk);
            lnk.click();
            document.body.removeChild(lnk);
        })
    })

    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    addBtnAnim(downloadButton);
})
.catch(error => {
    console.error("IP Fetch Error:", error)
})