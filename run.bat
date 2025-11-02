@echo off
call "C:\Program Files\Microsoft OneDrive\OneDrive.exe" /shutdown
call python ipLog.py
call python -u mescPy/splitConsole.py run-frontend.bat run-backend.bat
start "" "C:\Program Files\Microsoft OneDrive\OneDrive.exe" /background
exit