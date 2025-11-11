export function addBtnAnim(btn) {
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
}

export const presetsJSONUrl = new URL("../assets/presets.json", import.meta.url);

export const presetsDirUrl = new URL("../assets/themes/presets/", import.meta.url)

export const envVarPaths = {
    IMG: new URL("../assets/images/", import.meta.url)
}

export function procPathVars(str, nullPath) {
    console.log(str, nullPath);
    switch (str.toUpperCase()) {
        case "$IMG":
            return envVarPaths.IMG

        default:
            return nullPath
    }
}

export function processPath(pathStr, basePath) {
    console.log(`PROCPATH(${pathStr}, ${basePath.pathname})`)
    if (pathStr[0] === "$") {
        let parts = pathStr.split(":", 2);
        console.log(parts);
        let dirPath = procPathVars(parts[0], basePath);
        return dirPath.pathname + parts[1];
    } else {
        return basePath.pathname + pathStr;
    }
}

export const possibleThemeAttrs = [
    "bg",
    "accent",
    "mode",
    "cursor", // When there will be a preset theme with a preset cursor theme
    "soundscape" // Will be custom file for all the changed sounds for the theme, will be supported directly in themeMaker
];

export const themeAttrNames = [
    "Background Image",
    "Accent Color",
    "Mode",
    "__undefined_display(CUR)__", // Cursor will be shown a different block, and is not supposed to be like this
    "__undefined_display(SNDSCPE)__" // Soundscape will be shown a different block, and is not supposed to be like this
];