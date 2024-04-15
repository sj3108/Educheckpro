@echo off
rem Run Python file
start cmd /k python grammer_and_spelling_checker.py

rem Start second Python script in a new command prompt window
start cmd /k " cd main\server\ & nodemon .\index.js"


rem Start third Python script in a new command prompt window
start cmd /k " cd Plagarism\src\ & nodemon .\tp.js"