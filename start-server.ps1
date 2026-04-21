$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$nodePath = "C:\Program Files\nodejs\node.exe"
$scriptPath = Join-Path $root "local-server.js"
$stdoutPath = Join-Path $root "server.stdout.log"
$stderrPath = Join-Path $root "server.stderr.log"

Start-Process `
  -FilePath $nodePath `
  -ArgumentList @($scriptPath) `
  -WorkingDirectory $root `
  -WindowStyle Hidden `
  -RedirectStandardOutput $stdoutPath `
  -RedirectStandardError $stderrPath
