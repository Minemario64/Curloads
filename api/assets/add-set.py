84from pathlib import Path
import os

IMG_PATH = Path(__file__).parent.joinpath("cursorImgs")
CUR_PATH = Path(__file__).parent.joinpath("cursors")
SET_PATH = Path(__file__).parent.joinpath("cursorSets")
TMP_PATH = Path(__file__).parent.joinpath("tmp")
ACTIVATE_PATH = Path(__file__).parent.joinpath("activate")

cwd: Path = Path.cwd()
os.chdir(Path(__file__).parent.parent)
from main import copyFilesRec, rmFilesRec, copyFile
from zipping import zipPaths

os.chdir(cwd)

name: str = input("Cursor set display name: ")
dirname: str = input("Cursor set dirname: ")
request: bool = True if input("Is request?(y/n): ") in ['y', 'yes'] else False
cursors: list[str] = input("Put all cursors in set (separated by spaces)(arrows are all the arrows): ").lower().split(" ")
if "arrows" in cursors:
    cursors.extend(["arrow-all", 'arrow-nsew', 'arrow-nwse', 'arrow-ns', 'arrow-ew'])

cursorPriorities: list[str] = ["mouse", "select", "busy", "text", "wib", "arrow-all", "arrow-nesw", "arrow-nwse", "arrow-ns", 'arrow-ew']

curNames: dict[str, str] = {
    "mouse": "Mouse",
    "select": "Select",
    "busy": "Busy",
    "wib": "Work in Background",
    "text": "Text",
    "arrow-all": "Move",
    "arrow-nesw": "Diagonal Arrow 1",
    "arrow-nwse": "Diagonal Arrow 2",
    "arrow-ns": "Arrow Vertical",
    "arrow-ew": "Arrow Horizontal"
}

cursors.sort(key=lambda v: cursorPriorities[v]) # type: ignore
print(cursors)
input(":")

imgPaths: list[Path] = []
for cursor in cursors:
    imgPaths.append(Path(input(f"Image path for cursor '{cursor}': ")).resolve())

curPaths: list[Path] = []
for cursor in cursors:
    curPaths.append(Path(input(f"Cursor path for cursor '{cursor}': ")).resolve())

names: list[str] = []
for cursor in cursors:
    names.append(f"{"Requests - " if request else ""}{name} - {curNames[cursor]}")

imgDirPath: Path = IMG_PATH.joinpath(f"{"requests_" if request else ""}{dirname}")
imgDirPath.mkdir()

curDirPath: Path = CUR_PATH.joinpath(f"{"requests_" if request else ""}{dirname}")
curDirPath.mkdir()

curSetPath: Path = SET_PATH.joinpath(f"{"requests_" if request else ""}{dirname}")
curSetPath.mkdir()

for imgPath, curPath, name, cursor in zip(imgPaths, curPaths, names, cursorPriorities):
    copyFile(imgPath, imgDirPath, f"{cursor}{imgPath.suffix}")
    copyFile(curPath, curDirPath, f"{cursor}{curPath.suffix}")
    with curSetPath.joinpath(f"{cursor}.txt").open("x") as nameFile:
        nameFile.write(name)

TMP_PATH.mkdir()
copyFilesRec(curDirPath, TMP_PATH)
copyFilesRec(ACTIVATE_PATH, TMP_PATH)
zipPaths(TMP_PATH.iterdir(), curSetPath, TMP_PATH)