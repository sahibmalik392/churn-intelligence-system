import os
import json
from dotenv import load_dotenv

load_dotenv()

def generate_retention_campaign(customer_profile: dict, churn_reasons: list, churn_probability: float):
    api_key = os.getenv("OPENAI_API_KEY")
    
    # Agar OpenAI Key nahi hai, toh realistic structured mock return karein
    if not api_key or api_key == "your_actual_api_key_here":
        primary_issue = churn_reasons[0]['feature'] if churn_reasons else "billing"
        return json.dumps({
            "subject_line": f"Important Update Regarding Your Plan - {customer_profile.get('name')}",
            "personalized_incentive": "25% Loyalty Billing Credit + 1-on-1 Account Concierge",
            "email_body": f"Hi {customer_profile.get('name', 'Valued Customer')},\n\nWe noticed recent friction around {primary_issue.replace('_', ' ')} on your account. To ensure you experience uninterrupted service, we've credited a 25% discount to your upcoming statements and assigned a senior technical concierge to resolve any open tickets immediately.\n\nBest regards,\nCustomer Success Team"
        })

    from openai import OpenAI
    client = OpenAI(api_key=api_key)
    
    reasons_str = "\n".join([f"- {r['feature']} ({r['actual_value']})" for r in churn_reasons])
    prompt = f"""
    Customer: {customer_profile.get('name')}
    Tenure: {customer_profile.get('tenure_months')} months
    Monthly Bill: ${customer_profile.get('monthly_charges')}
    Churn Probability: {churn_probability * 100:.1f}%
    Key Pain Points (from SHAP):
    {reasons_str}

    Return strict JSON with keys: "subject_line", "personalized_incentive", "email_body". Keep it empathetic, professional, and targeted.
    """

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    return res.choices[0].message.content