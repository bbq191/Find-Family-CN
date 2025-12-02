# PowerShell script to run Gradle with correct Java environment
$env:JAVA_HOME = "D:\OpenJDK\23"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Run gradlew with all arguments
& "$PSScriptRoot\gradlew.bat" @args
