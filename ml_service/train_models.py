import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "..", "modeldata")
MODELS_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODELS_DIR, exist_ok=True)

print("==========================================================")
print("Training Machine Learning Models from CSV Datasets...")
print("==========================================================")

# 1. SCHEME MATCHING MODEL
scheme_csv = os.path.join(DATASET_DIR, "scheme_matching_dataset.csv")
if os.path.exists(scheme_csv):
    df_scheme = pd.read_csv(scheme_csv)
    
    feature_cols = [
        "age", "gender", "social_category", "state", "area_type", 
        "family_income_lakhs", "education_level", "business_sector", 
        "business_stage", "annual_turnover_lakhs", "requested_funding_lakhs", 
        "is_woman_entrepreneur", "is_differently_abled", "has_caste_certificate", 
        "aadhaar_linked", "scheme_sector", "scheme_max_support_lakhs"
    ]
    
    X = df_scheme[feature_cols].copy()
    y = df_scheme["target_matched"]

    encoders = {}
    cat_cols = ["gender", "social_category", "state", "area_type", "education_level", "business_sector", "business_stage", "scheme_sector"]
    for col in cat_cols:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        encoders[col] = le

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    rf_scheme = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42)
    rf_scheme.fit(X_train, y_train)

    acc = rf_scheme.score(X_test, y_test)
    print(f"SUCCESS: Scheme Matching Model (RandomForest) Trained. Accuracy: {acc*100:.2f}%")

    joblib.dump(rf_scheme, os.path.join(MODELS_DIR, "scheme_matching_model.pkl"))
    joblib.dump(encoders, os.path.join(MODELS_DIR, "scheme_encoders.pkl"))

# 2. APPLICANT READINESS MODEL
readiness_csv = os.path.join(DATASET_DIR, "applicant_readiness_dataset.csv")
if os.path.exists(readiness_csv):
    df_readiness = pd.read_csv(readiness_csv)

    feature_cols_r = [
        "cibil_score", "existing_loans_lakhs", "bank_account_verified",
        "pan_verified", "gstin_status", "project_report_attached",
        "collateral_value_lakhs", "business_vintage_years", 
        "monthly_cashflow_avg_inr", "document_completeness_pct"
    ]

    X_r = df_readiness[feature_cols_r].copy()
    y_r = df_readiness["target_readiness_score"]

    le_gst = LabelEncoder()
    X_r["gstin_status"] = le_gst.fit_transform(X_r["gstin_status"].astype(str))

    X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(X_r, y_r, test_size=0.2, random_state=42)

    rf_readiness = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    rf_readiness.fit(X_train_r, y_train_r)

    r2_score = rf_readiness.score(X_test_r, y_test_r)
    print(f"SUCCESS: Readiness Scoring Model (RandomForest Regressor) Trained. R2 Score: {r2_score:.4f}")

    joblib.dump(rf_readiness, os.path.join(MODELS_DIR, "readiness_model.pkl"))
    joblib.dump({"gstin_status": le_gst}, os.path.join(MODELS_DIR, "readiness_encoders.pkl"))

# 3. APPLICATION FRAUD MODEL
fraud_csv = os.path.join(DATASET_DIR, "application_fraud_dataset.csv")
if os.path.exists(fraud_csv):
    df_fraud = pd.read_csv(fraud_csv)

    feature_cols_f = [
        "reported_annual_income_inr", "tax_vault_verified_income_inr",
        "income_discrepancy_ratio", "duplicate_bank_account_flag",
        "duplicate_aadhaar_flag", "ip_geo_mismatch", "ip_address_changes_count",
        "document_forgery_risk_score", "caste_certificate_verification_status"
    ]

    X_f = df_fraud[feature_cols_f].copy()
    y_f = df_fraud["target_is_fraudulent"]

    le_caste = LabelEncoder()
    X_f["caste_certificate_verification_status"] = le_caste.fit_transform(X_f["caste_certificate_verification_status"].astype(str))

    X_train_f, X_test_f, y_train_f, y_test_f = train_test_split(X_f, y_f, test_size=0.2, random_state=42)

    gb_fraud = GradientBoostingClassifier(n_estimators=100, random_state=42)
    gb_fraud.fit(X_train_f, y_train_f)

    f_acc = gb_fraud.score(X_test_f, y_test_f)
    print(f"SUCCESS: Fraud Audit Model (GradientBoosting) Trained. Accuracy: {f_acc*100:.2f}%")

    joblib.dump(gb_fraud, os.path.join(MODELS_DIR, "fraud_model.pkl"))
    joblib.dump({"caste": le_caste}, os.path.join(MODELS_DIR, "fraud_encoders.pkl"))

print("==========================================================")
print("All Scikit-Learn Model Artifacts Saved to ml_service/models/")
print("==========================================================")
