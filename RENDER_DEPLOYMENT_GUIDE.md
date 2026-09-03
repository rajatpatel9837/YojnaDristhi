# 🌐 YojnaSetu AI — Simple Render Deployment Guide (Under 2 Minutes)

Follow these simple steps to deploy **YojnaSetu AI** on **[Render.com](https://render.com)** for free.

---

## ⚡ Method 1: Single Web Service Deployment (Simplest & Free Tier Compatible)

This option packages the **React Frontend**, **Express Backend API**, **AI OCR Engine**, and **Native ML Matching Model** into a single free Web Service on Render.

### Step 1: Push Code to GitHub
1. Create a repository on GitHub (e.g. `yojnasetu-ai`).
2. Push your project code to GitHub.

### Step 2: Create Web Service on Render
1. Log in to **[dashboard.render.com](https://dashboard.render.com)**.
2. Click **New +** → Select **Web Service**.
3. Connect your GitHub repository (`yojnasetu-ai`).

### Step 3: Configure Settings
Fill in these exact fields:

| Setting | Value |
|---|---|
| **Name** | `yojnasetu-ai` |
| **Region** | Select closest (e.g., Singapore / Oregon / Frankfurt) |
| **Branch** | `main` |
| **Root Directory** | *(leave blank)* |
| **Runtime** | **Node** |
| **Build Command** | `npm run render-build` |
| **Start Command** | `npm start` |

### Step 4: Environment Variables (Under "Advanced" or "Environment")
Add the following key-value pairs:

| Key | Recommended Value / Description |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `yojnasetu_render_jwt_secret_key_2026` |
| `GEMINI_API_KEY` | *(Your Gemini API Key for AI Features)* |
| `MONGO_URI` | *(Your MongoDB Atlas Connection String or leave empty to use in-memory/demo seed)* |

### Step 5: Deploy!
Click **Create Web Service**.
Render will run `npm run render-build` and start your live site at `https://yojnasetu-ai.onrender.com`!

---

## 🏗️ Method 2: Blueprint Deployment (Multi-Service via render.yaml)

If you prefer deploying the Node Backend and Python FastAPI ML Service as two dedicated microservices:

1. Click **New +** → **Blueprint** on Render.
2. Connect your repository.
3. Render will read [`render.yaml`](file:///d:/project/render.yaml) automatically and provision:
   - Node.js Web App Service
   - Python FastAPI ML Microservice
   - Render MongoDB Instance

---

## ✅ All Website Features Included Live:
- **Instant Scheme Matching & Eligibility Assessment**: `/wizard` & `/matches`
- **DocVerifier AI (OCR Scanning & Detail Extraction)**: `/doc-verify`
- **End-to-End Application & PFMS Fund Disbursal Progress Tracking**: `/track-application`
- **ScholarSetu AI Student Platform**: `/scholarsetu`
- **CSR Organization & Opportunity Management**: `/provider`
- **Sponsorship Portal**: `/sponsorship`
- **Admin Verification Queue & Audit Logs**: `/admin`
- **Multilingual Voice Assistant (AskYojnaSetu)**: Bottom Right Floating Chatbot
