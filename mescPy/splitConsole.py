import tkinter as tk
from tkinter import Tk, DISABLED, NORMAL, END, Y, X, LEFT, RIGHT, BOTH
from tkinter.scrolledtext import ScrolledText
import sys
import threading as thr
import queue
from subprocess import Popen

BG = "#273342"
TERMINAL = "#111927"
FG = "#FFFFFF"

root = Tk()
root.config(background=BG)
root.geometry("905x430")
root.title("Console Manager")

PROCS: list[Popen] = []

def runScript(queue: queue.Queue, paramIdx: int) -> None:
    import os
    from pathlib import Path
    import subprocess

    proc = subprocess.Popen(["cmd.exe", '/c', fr'{Path(os.path.expandvars(sys.argv[paramIdx])).resolve()}'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, stdin=subprocess.PIPE, text=True, bufsize=1)
    PROCS.append(proc)
    for ln in proc.stdout: # type: ignore
        queue.put(ln)

    proc.stdout.close() # type: ignore
    proc.wait()


def pollQueue(OutQueue: queue.Queue, textElement: tk.Text):
    try:
        while True:
            line = OutQueue.get_nowait()
            textElement.config(state=NORMAL)
            textElement.insert("end", line)
            textElement.see("end")
            textElement.config(state=DISABLED)

    except queue.Empty:
        pass

    textElement.after(100, pollQueue, OutQueue, textElement)

split1 = ScrolledText(root, bg=TERMINAL, fg=FG, insertbackground=FG, bd=0, font=("JetBrains Mono", 10), state=DISABLED)
split1.pack(fill=BOTH, side=LEFT, padx=5, pady=15, expand=True)

split2 = ScrolledText(root, bg=TERMINAL, fg=FG, insertbackground=FG, bd=0, font=("JetBrains Mono", 10), state=DISABLED)
split2.pack(fill=BOTH, side=RIGHT, padx=5, pady=15, expand=True)

split1Queue = queue.Queue()
split2Queue = queue.Queue()

spl1 = thr.Thread(target=runScript, args=(split1Queue, 1))
spl1.start()
spl2 = thr.Thread(target=runScript, args=(split2Queue, 2))
spl2.start()

pollQueue(split1Queue, split1)
pollQueue(split2Queue, split2)

try:
    root.mainloop()

except KeyboardInterrupt:
    print("Terminating...")
    for proc in PROCS:
        proc.terminate()

    spl1.join()
    spl2.join()

print("Exiting...")
exit()