# train_model.py
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle

print("1. Data generate aur prepare ho raha hai...")
np.random.seed(42)
n = 2000

data = {
    'tenure_months': np.random.randint(1, 72, size=n),
    'monthly_charges': np.random.uniform(20.0, 120.0, size=n),
    'contract_type': np.random.choice(['Month-to-month', 'One year', 'Two year'], size=n, p=[0.5, 0.3, 0.2]),
    'support_tickets': np.random.randint(0, 6, size=n),
    'paperless_billing': np.random.choice(['Yes', 'No'], size=n),
}
df = pd.DataFrame(data)
df['total_charges'] = df['tenure_months'] * df['monthly_charges']

# Realistic churn formula
churn_prob = (
    (df['contract_type'] == 'Month-to-month') * 0.35 +
    (df['support_tickets'] > 2) * 0.30 +
    (df['monthly_charges'] > 80) * 0.25 -
    (df['tenure_months'] > 24) * 0.30
)
df['churn'] = (np.random.uniform(0, 1, size=n) < np.clip(churn_prob, 0.05, 0.95)).astype(int)

# Categorical text to numbers
encoders = {}
for col in ['contract_type', 'paperless_billing']:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

X = df.drop(columns=['churn'])
y = df['churn']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("2. XGBoost model train ho raha hai...")
model = xgb.XGBClassifier(n_estimators=100, max_depth=4, learning_rate=0.05, random_state=42)
model.fit(X_train, y_train)

# Files save karein
with open('churn_model.pkl', 'wb') as f:
    pickle.dump(model, f)
with open('encoders.pkl', 'wb') as f:
    pickle.dump(encoders, f)

print("SUCCESS: churn_model.pkl aur encoders.pkl ready hain!")