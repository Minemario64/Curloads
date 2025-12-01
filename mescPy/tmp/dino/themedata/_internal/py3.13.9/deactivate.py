from pathlib import Path
import os

installPathLogPath: Path = Path("installPath").resolve()

# The theme path might be personal (TODO: Test it)
lightThemePath: Path = Path(r"C:\Windows\Resources\Themes\aero.theme").resolve()
with installPathLogPath.open("r") as log:
    Path(log.read()).resolve().unlink()

lightThemePath.unlink()

os.startfile(lightThemePath)