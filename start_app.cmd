@echo off
title YojnaSetu AI — Local Development Launcher
echo ====================================================
echo 🚀 Starting YojnaSetu AI Local Development Platform...
echo ====================================================

echo 1. Starting FastAPI ML Microservice on Port 8000...
start "YojnaSetu ML Service (Port 8000)" cmd /k "cd /d "%~dp0ml_service" && uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo 2. Starting Node.js Express Backend & Web Server on Port 5000...
start "YojnaSetu Web Server (Port 5000)" cmd /k "cd /d "%~dp0server" && npm start"

timeout /t 3 /nobreak >nul

echo ====================================================
echo ✅ YojnaSetu AI is launching!
echo 📍 Web Application: http://localhost:5000
echo 📍 FastAPI Service: http://127.0.0.1:8000
echo 📍 API Health: http://localhost:5000/api/health
echo ====================================================
start http://localhost:5000
pause
