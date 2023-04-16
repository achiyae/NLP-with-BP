@ECHO OFF

set chrome86="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
set chrome64="C:\Program Files\Google\Chrome\Application\chrome.exe"

if exist %chrome64% (
    set chrome=%chrome64%
) else if exist %chrome86% (
    set chrome=%chrome86%
) else (
    echo Chrome not found
    exit /b 1
)
%chrome% --remote-debugging-port=9222 --user-data-dir="%~dp0%userdir"
