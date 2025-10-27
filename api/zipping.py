from zipfile import ZipFile
import zipfile
from pathlib import Path
from typing import Iterable, Iterator

def zipFile(path: Path, zipPath: ZipFile | Path, root: Path | None = None) -> None:
    if isinstance(zipPath, ZipFile):
        zfile: ZipFile = zipPath
        if root is not None:
            relPath: str = str(path.relative_to(root))

        else:
            relPath: str = str(path.name)

        zfile.write(path, relPath)

def zipPaths(paths: Iterable[Path], zipPath: Path | ZipFile, rootPath: Path) -> None:
    if isinstance(zipPath, Path):
        if zipPath.exists():
            mode: str = 'w'

        else:
            mode: str = "x"

        with ZipFile(zipPath, mode, zipfile.ZIP_DEFLATED) as zfile:
            for path in paths:
                if path.is_file():
                    zipFile(path, zfile, rootPath)

                elif path.is_dir():
                    zipPaths(path.iterdir(), zfile, rootPath)

    elif isinstance(zipPath, ZipFile):
        for path in paths:
            if path.is_file():
                zipFile(path, zipPath, rootPath)

            elif path.is_dir():
                zipPaths(path.iterdir(), zipPath, rootPath)