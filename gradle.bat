@echo off
@rem Set Java environment for this project only
set JAVA_HOME=D:\OpenJDK\23
set PATH=%JAVA_HOME%\bin;%PATH%

@rem Get the directory of this script
set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.

@rem Run gradlew with all arguments
call "%DIRNAME%gradlew.bat" %*
