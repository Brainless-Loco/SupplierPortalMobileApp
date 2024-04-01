@echo off

for %%* in (.) do set "current_folder=%%~n*"

echo.
echo.
echo Hey Loco! Hope you are fine.
echo.
echo.

set /p git_message="Please enter your commit message for %current_folder%: "

git add .
git commit -m "%git_message%"
git push

pause