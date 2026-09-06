# 🇮🇳 YojnaSetu AI — Smart Government Scheme & Financial Matching Platform
> **Smart India Hackathon (SIH) Problem Statement 26092**  
> *Tagline: Discover. Apply. Track.*

**YojnaSetu AI** (योजना दृष्टि) is an AI-driven Indian public welfare and financial enablement platform designed to eliminate information asymmetry, empower poor, rural, and illiterate citizens, and connect beneficiaries to central & state government schemes, subsidies, and credit opportunities.

---

## 🏛️ System Architecture & What's Real vs Mocked

In compliance with hackathon guidelines, here is the transparent breakdown of our engineering implementation:

### 1. What's 100% Real
* **Real MongoDB Persistence Layer**: Authoritative MongoDB models for `User`, `EntrepreneurProfile`, `StudentProfile`, `Scheme`, `Scholarship`, `Application`, `AuditLog`, `Organization`, and `ChannelPartner`.
* **8-Stage Application Tracking & State Machine**: Authoritative backend finite state machine (`SUBMITTED` ➔ `DOCUMENT_VERIFICATION` ➔ `ELIGIBILITY_VERIFICATION` ➔ `APPROVED` ➔ `SANCTIONED` ➔ `RELEASED` ➔ `PAYMENT_SUCCESS` ➔ `COMPLETED`).
* **Universal Multilingual AI Assistant**: Powered by **Sarvam AI 105B** (Indian LLM) and **Google Gemini AI**, with anti-phantom save constraints, markdown formatting, and voice support across **Hindi (`hi-IN`)**, **Punjabi (`pa-IN`)**, and **English (`en-IN`)**.
* **AI & Regex Document OCR Engine**: Real file uploads with Tesseract.js, `pdf-parse`, UIDAI 12-digit format checks, Udyam number validation, and automated orphaned file cleanup on error.
* **Explainable Eligibility & Matching Engine**: 100% transparent rule-matching evaluating hard demographic criteria, income caps, sector filters, and social category preferences.
* **Python FastAPI ML Microservice**: Real trained Scikit-Learn models (`scheme_matching_model.pkl`, `readiness_model.pkl`, `fraud_model.pkl`) trained on 20,000 historical records.

### 2. What's Mocked / Sandbox Simulated
* **DigiLocker Sandbox Integration**: `mockDigilockerService.js` simulates official DigiLocker document retrieval (Aadhaar, Income, Caste, Udyam) using realistic Indian government formatting for demonstration purposes.
* **PFMS Disbursal Simulation**: `MockGovernmentProvider.js` simulates nodal treasury sanction, fund release, and payment gateway settlement.
* **External Portal Submission**: YojnaSetu registers and tracks the application record internally (`Confirm & Submit` creates an active record in YojnaSetu). Final submission on external third-party government websites is guided via the **Guided Application Co-Pilot**.

### 3. What's Placeholder / Illustrative
* **Portal Walkthrough Details**: Step screenshots and portal button names for demo schemes are marked with `isPlaceholderContent: true` to indicate they are illustrative guides.
* **All Official Scheme URLs**: Every scheme's `officialUrl` points strictly to **direct, verified official government portals** (`*.gov.in`, `*.nic.in`, `mudra.org.in`, `standupmitra.in`), never generic search engines or blogs.

---

## 🔒 Privacy & Data Handling (DPDP Act Alignment)

YojnaSetu adheres strictly to the **Digital Personal Data Protection (DPDP) Act 2023** principles:

1. **Data Minimization**: Only explicitly consented document types are requested during the DigiLocker flow.
2. **Storage Limitation (Session-Scoped Privacy Cache)**:
   - Raw documents fetched from DigiLocker are stored **exclusively in a short-lived in-memory server cache** (`Map<sessionId, { docs, expiresAt }>`) with an automatic **45-minute TTL**.
   - Raw documents are **never permanently stored in MongoDB**.
   - Periodic garbage collection purges expired session data every 10 minutes.
3. **Transparent User Consent**: Users receive a dedicated consent modal specifying issuing authorities, purposes, and an explicit Allow/Deny control.

---

## 🌟 Key Features

### 1. 1-Click Application Auto-Fill (Task 2)
* **Single Shared `resolveSourcePath` Engine**: Universal dotted-path resolver unifying profile data (`profile.fullName`, `profile.familyIncome`) and DigiLocker certificates (`digilocker.aadhaar.maskedNumber`, `digilocker.casteCertificate.certificateNumber`).
* **"Apply to All Eligible Schemes"**: Citizens can auto-fill multiple schemes simultaneously with one consent prompt.
* **Prefilled Application Review UI**: Editable form inputs, missing required fields highlighted in amber, and instant summary download.

### 2. Guided Application Co-Pilot (Task 3)
* **Split-Screen Companion**: Left panel shows step-by-step checklist with **1-Click Copy** buttons (`navigator.clipboard.writeText`) for every required field; right panel provides a direct **"Open Official Portal ↗️"** gateway.
* **Common Pitfall Warnings**: Guides applicants on critical mistakes to avoid (e.g. income mismatches, file size limits, greenfield declarations).
* **AI Chatbot Integration**: Direct context-handoff from any walkthrough step into YojnaSetu AI for real-time multilingual help.

### 3. AskYojnaSetu Universal AI Chatbot (Task 1)
* **Sarvam AI 105B Primary Engine**: Answers ANY citizen query (welfare schemes, loans, recipes, coding, farming, sports) dynamically without hardcoded templates.
* **Anti-Phantom-Save Guardrails**: Strictly constrained never to claim it saves, records, or remembers personal data in conversation.
* **Voice-First Accessibility**: Speech-to-Text input and Sarvam AI natural voice output for illiterate citizens.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Axios, Web Speech API |
| **Backend** | Node.js, Express, MongoDB, Mongoose, JWT, Multer, Helmet |
| **AI & Voice** | Sarvam AI 105B (Chat), Sarvam AI Text-to-Speech (Voice), Google Gemini AI |
| **OCR & Parsing** | Tesseract.js, `pdf-parse` |
| **ML Microservice** | Python 3.10+, FastAPI, Uvicorn, Scikit-Learn, Pandas, NumPy, Joblib |

---

## ⚡ Quick Start & Running the Project

### Prerequisites
* Node.js v18+ & npm
* Python 3.10+ (for ML microservice)

### Step 1: Install Dependencies
```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

### Step 2: Start Services

#### 1. Backend Server (Port 5001)
```bash
cd server
node src/server.js
```

#### 2. Frontend Client (Port 5173)
```bash
cd client
npm run dev
```

#### 3. Python ML Microservice (Optional, Port 8000)
```bash
cd ml_service
uvicorn main:app --host 127.0.0.1 --port 8000
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🗺️ Production Roadmap

1. **Official DigiLocker Partner OAuth 2.0 Integration**: Transition from simulated sandbox to official MeitY DigiLocker partner credentials with digitally signed XML/JSON payloads.
2. **Verified Portal Walkthrough Library**: Expand verified walkthroughs with high-resolution screenshots across all central and 28 state government portals.
3. **Real PFMS Push Notifications**: Webhook integration for instant SMS/WhatsApp alerts when funds transition from Sanctioned ➔ Released ➔ Credited.
4. **Offline CSC / Jan Seva Kendra Kiosk Mode**: Lightweight offline-first PWA mode for rural village kiosks with low connectivity.

---

## 📄 License
Developed for Smart India Hackathon (SIH 2026). Licensed under the MIT License.
