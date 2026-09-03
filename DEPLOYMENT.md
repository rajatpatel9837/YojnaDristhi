# 🚀 YojnaSetu AI — Comprehensive Production Deployment Guide

This guide provides end-to-end instructions to deploy **YojnaSetu AI** across **Docker**, **PM2 / Single Server (Ubuntu/Debian)**, **Vercel / Render**, and **Cloud Virtual Machines (AWS EC2, Azure, DigitalOcean)**.

---

## 🏗️ System Architecture & Ports Overview

| Component | Technology | Default Port | Production Command |
|---|---|---|---|
| **Frontend UI** | React + Vite + Tailwind CSS | Built to `client/dist` | Served statically by Express |
| **Backend API** | Node.js + Express + Mongoose | `5000` | `node server/src/server.js` |
| **ML Microservice** | Python 3.11 + FastAPI + Scikit-Learn | `8000` | `uvicorn main:app --host 0.0.0.0 --port 8000` |
| **Database** | MongoDB 6.0+ | `27017` | `mongod` |

---

## 🐳 Option 1: Docker Compose Deployment (Recommended)

Docker Compose orchestrates MongoDB, Python FastAPI ML Service, and Node.js Server in isolated containers with zero manual setup.

### Step 1: Clone Repository & Create Environment File
```bash
cp .env.example .env
```

### Step 2: Build & Start Multi-Container Stack
```bash
docker-compose up -d --build
```

### Step 3: Verify Deployment Health
- **Web App & Backend API**: `http://localhost:5000`
- **Health Check Endpoint**: `http://localhost:5000/api/health`
- **FastAPI ML Service**: `http://localhost:8000/docs`

---

## ⚙️ Option 2: Production Server Deployment with PM2 (Ubuntu/Debian/Windows)

For virtual private servers (AWS EC2, Azure VM, DigitalOcean Droplet, Linode) running PM2.

### Step 1: Install Node.js, Python, MongoDB & PM2
```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb python3-pip

# PM2 Process Manager
npm install -g pm2
```

### Step 2: Build Production Frontend Assets
```bash
cd client
npm ci
npm run build
cd ..
```

### Step 3: Install Server & ML Dependencies
```bash
# Server Dependencies
cd server
npm ci --only=production
cd ..

# ML Service Dependencies
cd ml_service
pip install -r requirements.txt
cd ..
```

### Step 4: Launch via PM2 Process Manager
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## ☁️ Option 3: Deploying on Render / Railway / Vercel

### Render Deployment Blueprint
1. Connect your GitHub repository to [Render.com](https://render.com).
2. Render will automatically detect [`render.yaml`](file:///d:/project/render.yaml) and create both the Node.js Web Service and Python ML Service!
3. Add your `GEMINI_API_KEY` and `MONGO_URI` environment variables in the Render Dashboard.

### Vercel Deployment
1. Connect your GitHub repo to Vercel.
2. Vercel uses [`vercel.json`](file:///d:/project/vercel.json) to deploy the React frontend and serverless Node.js endpoints automatically.

---

## 🔍 Post-Deployment Health Verification Checklist

1. **Backend Health Check**:
   ```bash
   curl http://localhost:5000/api/health
   # Expected Output: {"success":true,"status":"ONLINE","product":"YojnaSetu AI"}
   ```

2. **ML Microservice Health Check**:
   ```bash
   curl http://localhost:8000/health
   # Expected Output: {"status":"HEALTHY","model_loaded":true}
   ```

3. **Government / PFMS Sync Endpoint Verification**:
   ```bash
   curl -X POST http://localhost:5000/api/integration/government/sync/APP-DEMO-001
   # Expected Output: {"success":true,"message":"Government / PFMS Status synchronized successfully."}
   ```

---

## 🔒 Security Best Practices
- Change `JWT_SECRET` in `.env` to a strong random key before production launch.
- Enable HTTPS via Let's Encrypt / Certbot reverse proxy in Nginx for production domains.
- Restrict MongoDB access (`27017`) to localhost or docker network only.
