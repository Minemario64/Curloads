@echo off
call python ipLog.py
call python -u mescPy/splitConsole.py run-frontend.bat run-backend.bat
exit