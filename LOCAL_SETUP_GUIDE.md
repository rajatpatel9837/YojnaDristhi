# 🚀 YojnaSetu AI — Local Development Setup Guide

Welcome to **YojnaSetu AI**! Follow these instructions to run the application locally on your system.

---

## 📋 Prerequisites
Ensure you have the following installed on your system:
1. **Node.js** (v18 or higher) — [Download Node.js](https://nodejs.org/)
2. **Python** (v3.9 or higher) — [Download Python](https://www.python.org/)
3. **MongoDB** (Local instance running on `mongodb://localhost:27017` or MongoDB Atlas URI)

---

## ⚙️ Initial Setup (Run Once)

### 1. Backend Server Setup
Open a terminal in the project root:
```bash
cd server
npm install
```

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(On Windows Command Prompt: `copy .env.example .env`)*

### 2. Frontend Client Setup
Open a terminal in the project root:
```bash
cd client
npm install
```

### 3. ML Microservice Setup
Open a terminal in the project root:
```bash
cd ml_service
pip install -r requirements.txt
```

---

## 🏃 Running the Application

### Option A: One-Click Starter (Windows)
Double-click `start_app.cmd` (or right-click `start_app.ps1` and select **Run with PowerShell**).
This script automatically starts both the FastAPI ML service and the Express Backend, then opens `http://localhost:5000` in your default browser.

---

### Option B: Manual Service Startup

#### 1. Start ML Microservice (Port 8000):
```bash
cd ml_service
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Start Backend & Frontend Server (Port 5000):
```bash
cd server
npm run dev
```

#### 3. Start Frontend Client (Vite Dev Server - Port 5173):
```bash
cd client
npm run dev
```

---

## 📍 Key Local URLs
- 🌐 **Web Client**: `http://localhost:5173` (or `http://localhost:5000` when served via Express)
- ⚙️ **Backend API**: `http://localhost:5000/api/health`
- 🤖 **FastAPI ML Service**: `http://127.0.0.1:8000/docs` (Swagger UI)
