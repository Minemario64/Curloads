@echo off
call python -u -m http.server 5500
call "C:\Program Files\Microsoft OneDrive\OneDrive.exe" /shutdown