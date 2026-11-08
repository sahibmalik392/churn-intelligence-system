import shap
import pickle
import pandas as pd

def extract_churn_reasons(customer_df, model_path='churn_model.pkl'):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
        
    explainer = shap.TreeExplainer(model)
    shap_values = explainer(customer_df)
    
    feature_names = customer_df.columns
    contributions = shap_values.values[0]
    
    feature_impact = pd.DataFrame({
        'feature': feature_names,
        'actual_value': customer_df.iloc[0].values,
        'shap_value': contributions
    }).sort_values(by='shap_value', ascending=False)
    
    # Positive impact wale features jo churn score badha rahe hain
    churn_drivers = feature_impact[feature_impact['shap_value'] > 0].head(3)
    
    reasons = []
    for _, row in churn_drivers.iterrows():
        reasons.append({
            "feature": row['feature'],
            "actual_value": row['actual_value'],
            "risk_impact": round(float(row['shap_value']), 2)
        })
    return reasons