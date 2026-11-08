from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pickle
import json

from explainability import extract_churn_reasons
from outreach_engine import generate_retention_campaign

app = FastAPI(title="Retention Intelligence Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open('churn_model.pkl', 'rb') as f:
    model = pickle.load(f)

class CustomerInput(BaseModel):
    name: str
    tenure_months: int
    monthly_charges: float
    contract_type: str
    support_tickets: int
    paperless_billing: str

@app.post("/api/analyze-customer")
def analyze(data: CustomerInput):
    contract_map = {"Month-to-month": 0, "One year": 1, "Two year": 2}
    paperless_map = {"No": 0, "Yes": 1}
    
    total = data.tenure_months * data.monthly_charges
    features = pd.DataFrame([{
        'tenure_months': data.tenure_months,
        'monthly_charges': data.monthly_charges,
        'contract_type': contract_map.get(data.contract_type, 0),
        'support_tickets': data.support_tickets,
        'paperless_billing': paperless_map.get(data.paperless_billing, 1),
        'total_charges': total
    }])

    prob = float(model.predict_proba(features)[0][1])
    is_risk = prob >= 0.50

    response = {
        "churn_probability": round(prob * 100, 1),
        "risk_level": "High Risk" if is_risk else "Low Risk",
        "drivers": [],
        "campaign": None
    }

    if is_risk:
        drivers = extract_churn_reasons(features)
        response["drivers"] = drivers
        raw = generate_retention_campaign(data.model_dump(), drivers, prob)
        response["campaign"] = json.loads(raw)

    return response