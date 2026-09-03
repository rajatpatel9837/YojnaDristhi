# 🇮🇳 YojnaSetu AI — Smart Government Scheme & Financial Matching Platform

**YojnaSetu AI** is a state-of-the-art, AI-driven platform designed to eliminate information asymmetry and bridge the gap between Indian entrepreneurs, artisans, women, SC/ST beneficiaries, students, and official government scheme funding.

---

## 🌟 Key Features

1. **AI/ML Compatibility & Match Scoring Engine**:
   - Machine Learning models trained on **20,000 realistic Indian historical records** across 15 real schemes.
   - Evaluates **Estimated Match %** and **Credit Readiness %** using Scikit-Learn RandomForest and GradientBoosting models.

2. **15 Live Real Indian Government Schemes**:
   - **PMEGP** (Up to ₹50L loan + 35% margin money subsidy)
   - **PM MUDRA Yojana** (Collateral-free micro loans up to ₹10L)
   - **Stand-Up India** (₹10L to ₹1Cr for SC/ST and Women)
   - **PM Vishwakarma** (₹3L loan @ 5% interest + ₹15,000 toolkit voucher)
   - **PMFME** (35% food processing subsidy up to ₹10L)
   - **Startup India Seed Fund (SISFS)** (Up to ₹50L for early-stage ventures)
   - **CGTMSE** (Collateral-free credit guarantee up to ₹2 Crore)
   - **DAY-NULM** (Urban micro enterprise loan with 7% interest subvention)
   - **Mukhyamantri Yuva Swarozgar Yojana (MYSY UP)** (25% margin subsidy up to ₹25L)
   - **NEEDS (Tamil Nadu)** (25% capital subsidy up to ₹75L)
   - **Mukhyamantri Mahila Udyamita Yojana (Bihar)** (₹5L Grant + ₹5L 0% Loan)
   - **PM SVANidhi** (Street vendor credit up to ₹50,000)
   - **SCLCSS**, **VCF-SC**, **PMS-SC**

3. **AskYojnaSetu AI Multilingual Assistant**:
   - Text generation powered by **Gemini AI**.
   - Speech synthesis (Text-to-Speech) powered by **Sarvam AI** in **Hindi (`hi-IN`)**, **Punjabi (`pa-IN`)**, and **English (`en-IN`)**.
   - Built-in Microphone Speech Recognition (Speech-to-Text).

4. **Dynamic Financial Calculator**:
   - Computes EMI, interest subvention, moratorium periods, and subsidy savings per scheme.

5. **Channel Partner & Bank Routing Map**:
   - Interactive GIS map connecting applicants to nearest SBI, PNB, and State Channelizing Agency offices.

6. **Admin Studio & ML Pipeline Control**:
   - Model accuracy stats, dataset audit, isolation forest fraud flags, and real-time simulator.

---

## 🏗️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios, Web Speech API
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Helmet, Rate Limit
- **ML Microservice**: Python 3.10+, FastAPI, Uvicorn, Scikit-Learn, Pandas, NumPy, Joblib
- **AI Integrations**: Google Gemini API (Text), Sarvam AI API (Multilingual Voice)

---

## ⚡ Quick Start (Development & Production)

### 1-Click Launch (Windows)
Double-click `start_app.cmd` or run in PowerShell:
```powershell
.\start_app.ps1
```

### Manual Service Startup
1. **Python ML Microservice (Port 8000)**:
   ```bash
   cd ml_service
   uvicorn main:app --host 127.0.0.1 --port 8000
   ```
2. **Node.js Web Backend (Port 5000)**:
   ```bash
   cd server
   npm start
   ```

3. **Access App**:
   Open **[http://localhost:5000](http://localhost:5000)** in your browser.

---

## 📄 License
Licensed under MIT License. Developed for SIH & Smart Governance Innovation.
