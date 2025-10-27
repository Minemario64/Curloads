from pathlib import Path

for path in Path("cursorSets").resolve().iterdir():
    for filename in ['mouse', 'select', 'busy', 'wib', 'text']:
        filepath: Path = path.joinpath(f"{filename}.txt")
        filepath.touch()
        with filepath.open("w") as file:
            file.write(f"{path.name.capitalize()} Cursors - {filename.capitalize()}")