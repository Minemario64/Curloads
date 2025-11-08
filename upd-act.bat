@echo off
cd mescPy
mklink /J api ..\curloads\api
call python updateActivate.py
rmdir api