import os
try:
    from zipping import zipPaths
except ModuleNotFoundError:
    from .zipping import zipPaths
    os.chdir("api")

from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from pathlib import Path
from typing import Any
try:
    from gentraverse import genLookup
except ModuleNotFoundError:
    from .gentraverse import genLookup
from json import dumps
from copy import deepcopy

def copyFile(filepath: Path, copyDirPath: Path, name: str | None = None) -> None:
    mirrorPath: Path = copyDirPath.joinpath(filepath.name if name is None else name)
    mirrorPath.touch()
    with filepath.open("rb") as file:
        content: bytes = file.read()

    with mirrorPath.open("wb") as file:
        file.write(content)

def copyFilesRec(dirPath: Path, copyDirPath: Path) -> None:
    for path in dirPath.iterdir():
        if path.is_file():
            mirrorPath: Path = copyDirPath.joinpath(path.name)
            mirrorPath.touch()
            with path.open("rb") as file:
                content: bytes = file.read()

            with mirrorPath.open("wb") as file:
                file.write(content)

        elif path.is_dir():
            mirrorPath: Path = copyDirPath.joinpath(path.name)
            mirrorPath.mkdir()
            copyFilesRec(path, mirrorPath)

def rmFilesRec(dirPath: Path) -> None:
    for path in dirPath.iterdir():
        if path.is_file():
            path.unlink()

        elif path.is_dir():
            rmFilesRec(path)

    dirPath.rmdir()

def flattenDict(d: dict) -> list:
    result = []
    for item in d.values():
        if isinstance(item, dict):
            result.extend(flattenDict(item))
            continue

        if isinstance(item, list):
            result.extend(item)
            continue

        result.append(item)

    return result

def filterDict(d: dict, key: str) -> dict[str, Any]:
    result = {}
    for filterKey, val in d.items():
        if isinstance(val, dict):
            for k, v in val.items():
                if k == key:
                    result[filterKey] = v

    return result

def convertPathDictToLookupTree(d: dict, curPath: Path) -> dict:
    for key, val in d.items():
        if isinstance(val, dict):
            for k, v in val.items():
                if isinstance(v, list):
                    for i, p in enumerate(v):
                        d[key][k][i] = convertPathToLookupPath(p, curPath)

                    continue

                d[key][k] = convertPathToLookupPath(v, curPath)

    return d


app: Flask = Flask(__name__)
CORS(app)

mixId: int = 0

CURSOR_SETS: dict[str, dict[str, Path | list[Path]]] = genLookup(Path("assets/cursors"), [".cur", '.ani'], Path("../").resolve())
CURSOR_IMGS: dict[str, dict[str, Path | list[Path]]] = genLookup(Path("assets/cursorImgs"), ['.png', '.gif'], Path("../").resolve())
CURSOR_NAMES: dict[str, dict[str, Path | list[Path]]] = genLookup(Path("assets/cursorSets"), [".txt"], Path("../").resolve())

def lookupCurPath(path: str) -> Path | None:
    evalStr: str = "lookup"
    for i, part in enumerate(path.split("/")):
        if i != len(path.split("/")) - 1 or (not ':' in part):
            evalStr += f'["{part}"]'
            continue

        evalStr += f'["{part.split(":")[0]}"][{part.split(":")[1]}]'

    try:
        return Path("../").resolve().joinpath(eval(evalStr, {"__builtins__": None, "lookup": CURSOR_SETS}))

    except KeyError:
        return None

def convertPathToLookupPath(path: str, curPath: Path) -> str:
    pathObj: Path = Path("../").resolve().joinpath(path).relative_to(curPath)
    if curPath.name == "cursors":
        for k, v in CURSOR_SETS[pathObj.parent.name].items():
            if v == path.split("/")[-1]:
                return f"{pathObj.parent.name}/{k}"

            elif isinstance(v, list):
                for i, vv in enumerate(v):
                    if vv == path.split("/")[-1]:
                        return f"{pathObj.parent.name}/{k}:{i}"

    return ""

def zipCursorMix(themeJSON: dict[str, dict[str, Path] | str]) -> Path:
    global mixId
    gatherPath: Path = Path("temp/gather/").resolve()
    zipPath: Path = Path(f"temp/{mixId}.zip").resolve()
    themeRepJSON: dict[str, dict[str, str] | str] = {'cursor': {}, 'pathname': themeJSON['pathname'], 'name': themeJSON['name']} # pyright: ignore[reportAssignmentType]
    for curMap, path in themeJSON['cursor'].items(): # type: ignore
        copyFile(Path(str(Path("../").resolve().joinpath(path))), gatherPath)
        themeRepJSON["cursor"][curMap] = path.name # type: ignore

    copyFilesRec(Path("assets/activate/").resolve(), gatherPath)
    with Path("temp/gather/themedata/theme.rep").open("w") as themeFile:
        themeFile.write(dumps(themeRepJSON, indent=4))


    zipPaths(gatherPath.iterdir(), zipPath, gatherPath)
    mixId += 1
    rmFilesRec(gatherPath)
    gatherPath.mkdir()
    return zipPath

@app.route("/mix", methods=['POST'])
def createCursorMix() -> tuple[Response, int]:
    data: dict[str, str] = request.get_json()
    print(request.method)
    if not data:
        return jsonify({"Error": "No JSON Received"}), 400

    themeJSON: dict = {"cursor": {}, "pathname": "mix", "name": "Curloads - Mix"}
    print()
    for key, value in data.items():
        if key in ['mouse', 'select', 'busy', 'text', 'wib']:
            path = lookupCurPath(value)
            print(repr(path))
            if path is None:
                return jsonify({"Error": f"'{value}' key is an invalid path"}), 404

            themeJSON['cursor'][key] = path

    print()
    zippath: Path = zipCursorMix(themeJSON)
    print(zippath)

    return jsonify({'url': str(zippath.name)}), 201

@app.route("/cursors/<type>", methods=['GET'])
def getCursors(type: str) -> tuple[Response, int]:
    match type:
        case "imgs":
            cursors = deepcopy(CURSOR_IMGS)

        case "sets":
            cursors = convertPathDictToLookupTree(deepcopy(CURSOR_SETS), Path("assets/cursors/").resolve())

        case "names":
            cursors = deepcopy(CURSOR_NAMES)

        case _:
            return jsonify({"Error": "type must be 'imgs', 'sets', or 'names'"}), 400


    mode: str = request.args.get("mode") or "normal"
    filterMode: str | None = request.args.get("filter")
    if filterMode in ["mouse", 'select', 'busy', 'wib', 'text']:
        cursors = filterDict(cursors, filterMode)

    if mode == "flatten":
        cursors = flattenDict(cursors)

    return jsonify(cursors), 200


if __name__ == "__main__":
    if Path("temp/").exists():
        rmFilesRec(Path("temp/"))

    Path("temp/gather/").mkdir(parents=True)
    app.run(host="0.0.0.0")
    print("Killing...")
    import os
    os.system("rm.bat")