# 🚀 Churn Intelligence & Automated Retention Engine

An end-to-end Machine Learning and Generative AI system that predicts customer churn risk, interprets model decisions using **SHAP (Explainable AI)**, and automatically generates hyper-personalized retention campaigns via **LLMs**.

---

## 📌 Project Overview
Traditional churn prediction models output a binary label or probability without answering two critical business questions:
1. **Why** is this specific customer churning?
2. **What concrete action** should the retention team take?

This project bridges that gap by connecting **Predictive Machine Learning** with **Explainable AI (XAI)** and **Generative AI Outreach Orchestration** behind a clean full-stack dashboard.

---

## 🏗️ Architecture Pipeline

```text
[ Customer Telemetry Input ]
             │
             ▼
   [ Data Preprocessing ]
             │
             ▼
    [ XGBoost Classifier ] ────── (Churn Prob < 50%) ─────► [ Low Risk Status ]
             │
      (Churn Prob >= 50%)
             │
             ▼
    [ SHAP TreeExplainer ] ───► Extract Top 3 Negative Feature Drivers
             │
             ▼
   [ Context Prompt Builder ] ───► Inject User Profile + Risk Drivers
             │
             ▼
     [ GenAI Engine (LLM) ] ───► Generates Tailored Offer & Outreach Email
             │
             ▼
  [ Interactive React UI ] ───► Visual Risk Gauge + SHAP Tags + Copyable Email
```

---

## ✨ Key Features
- **Predictive Modeling:** Trained an XGBoost classifier with cost-sensitive class weighting to accurately flag at-risk customers.
- **Explainable AI (XAI):** Integrated `SHAP (SHapley Additive exPlanations)` to unpack feature contributions per customer (e.g., month-to-month contract, recurring tickets, high billing).
- **Automated Retention Copywriting:** Dynamic prompt orchestration converts SHAP root causes into empathetic, conversion-focused retention offers.
- **Modern Full-Stack Dashboard:** Built with React, Tailwind CSS, and Lucide icons, powered by a high-performance FastAPI backend.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Machine Learning** | Python, XGBoost, Scikit-Learn, SHAP, Pandas, NumPy |
| **Generative AI** | OpenAI API (`gpt-4o-mini`) / Local LLM integration, python-dotenv |
| **Backend API** | FastAPI, Uvicorn, Pydantic |
| **Frontend UI** | React (Vite), Tailwind CSS, Lucide React |

---

## 📁 Repository Structure

```text
churn-intelligence-system/
├── app.py                  # FastAPI REST API endpoints
├── train_model.py          # Synthetic data generator & XGBoost training pipeline
├── explainability.py       # SHAP TreeExplainer inference logic
├── outreach_engine.py      # LLM prompt orchestration & retention drafting
├── churn_model.pkl         # Serialized XGBoost model
├── encoders.pkl            # Serialized label encoders
├── requirements.txt        # Backend dependencies
├── .env.example            # Environment variable template
└── frontend/               # React (Vite) application
    ├── src/
    │   ├── App.jsx         # Analytics dashboard interface
    │   └── index.css       # Tailwind CSS styling
    └── vite.config.js
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- Homebrew (macOS) with `libomp` installed (`brew install libomp`)

### 2. Backend Setup
```bash
# Clone the repository
git clone https://github.com/your-username/churn-intelligence-system.git
cd churn-intelligence-system

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Add your OpenAI API key
echo "OPENAI_API_KEY=your_key_here" > .env

# Train the model to generate artifacts
python train_model.py

# Launch FastAPI server
uvicorn app:app --reload --port 8000
```
Backend will be live at `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`).

### 3. Frontend Setup
Open a new terminal window:
```bash
cd churn-intelligence-system/frontend

# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📊 Sample Inference Output

```json
{
  "churn_probability": 78.4,
  "risk_level": "High Risk",
  "drivers": [
    { "feature": "contract_type", "actual_value": 0, "risk_impact": 0.42 },
    { "feature": "support_tickets", "actual_value": 4, "risk_impact": 0.31 },
    { "feature": "monthly_charges", "actual_value": 110.0, "risk_impact": 0.18 }
  ],
  "campaign": {
    "subject_line": "Exclusive Loyalty Discount for Your Account",
    "personalized_incentive": "25% Loyalty Billing Credit + 1-on-1 Account Concierge",
    "email_body": "Hi Aarav,\n\nWe noticed recent friction around support tickets and billing on your account..."
  }
}
```

---

## 🔮 Future Enhancements
- [ ] Connect live database (PostgreSQL) for continuous batch inference.
- [ ] Implement A/B testing tracker to compare conversion rates of standard vs. SHAP-tailored emails.
- [ ] Containerize backend and frontend services using Docker Compose.