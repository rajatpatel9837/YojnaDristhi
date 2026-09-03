# YojnaSetu AI — PowerShell Local Development Launcher
Write-Host "====================================================" -ForegroundColor Green
Write-Host "🚀 Starting YojnaSetu AI Local Development Services..." -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Green

$scriptDir = $PSScriptRoot
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }

# 1. Start FastAPI ML Service
Write-Host "1. Launching FastAPI ML Microservice on port 8000..." -ForegroundColor Yellow
$mlCmd = "Set-Location '$scriptDir\ml_service'; uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $mlCmd

Start-Sleep -Seconds 3

# 2. Start Express Web Server
Write-Host "2. Launching Express Web Server on port 5000..." -ForegroundColor Yellow
$serverCmd = "Set-Location '$scriptDir\server'; npm start"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $serverCmd

Start-Sleep -Seconds 3

Write-Host "====================================================" -ForegroundColor Green
Write-Host "✅ All YojnaSetu AI Services Operational!" -ForegroundColor Green
Write-Host "📍 Web Application: http://localhost:5000" -ForegroundColor White
Write-Host "📍 FastAPI ML Microservice: http://127.0.0.1:8000" -ForegroundColor White
Write-Host "📍 API Health Endpoint: http://localhost:5000/api/health" -ForegroundColor White
Write-Host "====================================================" -ForegroundColor Green

Start-Process "http://localhost:5000"
