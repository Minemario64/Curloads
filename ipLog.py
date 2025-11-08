import pyautogui as pyag
import os
import time
import threading as thr
import pyperclip as pyclip
from pathlib import Path
import sys

if len(sys.argv) == 2:
    with open("ip", 'w') as ipLogFile:
        ipLogFile.write(sys.argv[1])

    exit()

def press(key: str) -> None:
    for k in key.split("+"):
        pyag.keyDown(k)

    for k in key.split("+"):
        pyag.keyUp(k)

press("winLeft+altLeft+ ")
press("up")
press("\n")
time.sleep(0.75)
for _ in range(10):
    press("down")

press("enter")
text: str = pyclip.paste()

if not Path("ip").exists():
    Path("ip").touch()

with open("ip", 'w') as ipLogFile:
    ipLogFile.write(text.split("**IPv4 address:** ")[1].split("\n", 1)[0])