@echo off
start "Curloads Frontend" powershell "python -m http.server 5500"

start "Curloads Backend API" powershell "cd api; python main.py"