from pathlib import Path
from json import dumps

def genLookup(initPath: Path, filetypes: list[str]) -> dict:
    result: dict[str, dict[str, str | list[str]]] = {}
    for path in initPath.iterdir():
        if path.is_dir():
            result[path.name] = {}
            for cursorPath in path.iterdir():
                if cursorPath.is_file() and cursorPath.suffix in filetypes:
                    if "busy" in cursorPath.name or 'load' in cursorPath.name:
                        if result[path.name].get("busy") is None:
                            result[path.name]["busy"] = str(cursorPath.resolve().relative_to(Path("../").resolve()))
                            continue

                        result[path.name]['busy'] = result[path.name]['busy'] + [str(cursorPath.resolve().relative_to(Path("../").resolve()))] if isinstance(result[path.name]['busy'], list) else [result[path.name]['busy'], str(cursorPath.resolve().relative_to(Path("../").resolve()))] # pyright: ignore[reportArgumentType, reportOperatorIssue]
                        continue

                    elif 'mouse' in cursorPath.name:
                        if result[path.name].get("mouse") is None:
                            result[path.name]["mouse"] = str(cursorPath.resolve().relative_to(Path("../").resolve()))
                            continue

                        result[path.name]['mouse'] = result[path.name]['mouse'] + [str(cursorPath.resolve().relative_to(Path("../").resolve()))] if isinstance(result[path.name]['mouse'], list) else [result[path.name]['mouse'], str(cursorPath.resolve().relative_to(Path("../").resolve()))] # pyright: ignore[reportArgumentType, reportOperatorIssue]
                        continue

                    elif 'select' in cursorPath.name:
                        if result[path.name].get("select") is None:
                            result[path.name]["select"] = str(cursorPath.resolve().relative_to(Path("../").resolve()))
                            continue

                        result[path.name]['select'] = result[path.name]['select'] + [str(cursorPath.resolve().relative_to(Path("../").resolve()))] if isinstance(result[path.name]['select'], list) else [result[path.name]['select'], str(cursorPath.resolve().relative_to(Path("../").resolve()))] # pyright: ignore[reportArgumentType, reportOperatorIssue]
                        continue

                    elif 'text' in cursorPath.name:
                        if result[path.name].get("text") is None:
                            result[path.name]["text"] = str(cursorPath.resolve().relative_to(Path("../").resolve()))
                            continue

                        result[path.name]['text'] = result[path.name]['text'] + [str(cursorPath.resolve().relative_to(Path("../").resolve()))] if isinstance(result[path.name]['text'], list) else [result[path.name]['text'], str(cursorPath.resolve().relative_to(Path("../").resolve()))] # pyright: ignore[reportArgumentType, reportOperatorIssue]
                        continue

                    elif 'wib' in cursorPath.name or 'work-in-bg' in cursorPath.name:
                        if result[path.name].get("wib") is None:
                            result[path.name]["wib"] = str(cursorPath.resolve().relative_to(Path("../").resolve()))
                            continue

                        result[path.name]['wib'] = result[path.name]['wib'] + [str(cursorPath.resolve().relative_to(Path("../").resolve()))] if isinstance(result[path.name]['wib'], list) else [result[path.name]['wib'], str(cursorPath.resolve().relative_to(Path("../").resolve()))] # pyright: ignore[reportArgumentType, reportOperatorIssue]
                        continue

    return result