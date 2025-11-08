from pathlib import Path
import os

installPathLogPath: Path = Path("installPath").resolve()

# The theme path might be personal (TODO: Test it)
lightThemePath: Path = Path(r"C:\Windows\WinSxS\amd64_microsoft-windows-t..les-personalization_31bf3856ad364e35_10.0.19041.4957_none_01318c577827cfb4\Light.theme").resolve()
with installPathLogPath.open("r") as log:
    Path(log.read()).resolve().unlink()

os.startfile(lightThemePath)