@echo off
cd mescPy
mklink /J api ..\api
call python updateActivate.py
rmdir api