import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Send, User, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
    name: 'Aarav Sharma',
    tenure_months: 3,
    monthly_charges: 110.0,
    contract_type: 'Month-to-month',
    support_tickets: 4,
    paperless_billing: 'Yes'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/analyze-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Backend connection error. Ensure FastAPI server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = () => {
    if (!result?.campaign) return;
    const text = `Subject: ${result.campaign.subject_line || 'Special Offer'}\n\n${result.campaign.email_body}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="text-indigo-400 w-7 h-7" /> Retention Copilot
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Machine Learning Churn Scoring + SHAP Root Causes + GenAI Outreach Engine
            </p>
          </div>
          <span className="text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-3 py-1 rounded-full">
            Pipeline: XGBoost + SHAP + LLM
          </span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form Panel */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" /> Customer Telemetry
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300">Customer Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300">Tenure (Months): {formData.tenure_months}</label>
                  <input
                    type="range"
                    min="1"
                    max="72"
                    value={formData.tenure_months}
                    onChange={(e) => setFormData({ ...formData, tenure_months: Number(e.target.value) })}
                    className="w-full mt-2 accent-indigo-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300">Monthly Bill ($): {formData.monthly_charges}</label>
                  <input
                    type="range"
                    min="20"
                    max="150"
                    value={formData.monthly_charges}
                    onChange={(e) => setFormData({ ...formData, monthly_charges: Number(e.target.value) })}
                    className="w-full mt-2 accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Contract Type</label>
                <select
                  value={formData.contract_type}
                  onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Month-to-month">Month-to-month</option>
                  <option value="One year">One year</option>
                  <option value="Two year">Two year</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300">Support Tickets</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.support_tickets}
                    onChange={(e) => setFormData({ ...formData, support_tickets: Number(e.target.value) })}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300">Paperless Billing</label>
                  <select
                    value={formData.paperless_billing}
                    onChange={(e) => setFormData({ ...formData, paperless_billing: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Run Predictive Pipeline
              </button>
            </form>
          </div>

          {/* Right Results Panel */}
          <div className="lg:col-span-7 space-y-6">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-12 text-slate-500">
                <Sparkles className="w-12 h-12 mb-3 text-slate-700 stroke-1" />
                <p>Run customer analysis to view real-time churn metrics & generated actions.</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center border border-slate-800 rounded-2xl p-12 text-slate-400 animate-pulse">
                <RefreshCw className="w-8 h-8 mb-3 animate-spin text-indigo-400" />
                <p className="text-sm">Calculating SHAP contributions and generating personalized retention campaign...</p>
              </div>
            )}

            {result && !loading && (
              <>
                {/* Metric Card */}
                <div className={`p-6 rounded-2xl border ${
                  result.risk_level === 'High Risk' 
                    ? 'bg-rose-950/20 border-rose-900/50' 
                    : 'bg-emerald-950/20 border-emerald-900/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Churn Probability</span>
                      <div className="text-4xl font-extrabold mt-1 text-white flex items-center gap-3">
                        {result.churn_probability}%
                        <span className={`text-xs px-2.5 py-1 rounded-full border ${
                          result.risk_level === 'High Risk'
                            ? 'bg-rose-950 text-rose-300 border-rose-700/50'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-700/50'
                        }`}>
                          {result.risk_level}
                        </span>
                      </div>
                    </div>
                    {result.risk_level === 'High Risk' ? (
                      <AlertTriangle className="w-10 h-10 text-rose-500" />
                    ) : (
                      <CheckCircle className="w-10 h-10 text-emerald-500" />
                    )}
                  </div>

                  {/* SHAP Drivers */}
                  {result.drivers && result.drivers.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-800/80">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Top Negative Churn Influencers (SHAP)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.drivers.map((d, idx) => (
                          <span key={idx} className="text-xs bg-slate-900 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <span className="font-medium text-rose-400">+{d.risk_impact}</span>
                            <span>{d.feature.replace('_', ' ')}:</span>
                            <span className="font-semibold text-white">{d.actual_value}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* GenAI Campaign Card */}
                {result.campaign && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        <h3 className="font-semibold text-white">AI Retention Strategy</h3>
                      </div>
                      <button
                        onClick={copyEmail}
                        className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy Email'}
                      </button>
                    </div>

                    {result.campaign.personalized_incentive && (
                      <div className="bg-indigo-950/40 border border-indigo-800/50 p-3 rounded-lg text-xs text-indigo-200">
                        <span className="font-bold text-indigo-300">Tailored Incentive: </span>
                        {result.campaign.personalized_incentive}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">Subject: </span>
                        {result.campaign.subject_line}
                      </div>
                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm leading-relaxed text-slate-300 font-mono whitespace-pre-line">
                        {result.campaign.email_body}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
