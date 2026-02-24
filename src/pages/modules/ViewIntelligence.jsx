import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import GenerationCanvas from '../../components/GenerationCanvas';
import api from '../../lib/api';
import { Brain, BarChart3, Database, Zap, PieChart } from 'lucide-react';

const REPORT_TYPES = ['Weekly Brief', 'Monthly Performance Digest', 'Growth Forecast', 'Opportunity Alert Summary'];

export default function ViewIntelligence() {
    const [form, setForm] = useState({ report_type: 'Weekly Brief', focus_area: '' });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleGenerate = async (notes, model) => {
        const payload = {
            report_type: form.report_type,
            focus_area: form.focus_area + (notes ? `\n\nRefinement: ${notes}` : ''),
            model: model
        };
        return api.getWeeklyBrief(payload);
    };

    const inputPanel = (
        <div style={{ padding: '24px 28px' }}>
            {/* DRD Header */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--accent-soft)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Brain size={18} color="var(--accent)" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em' }}>07 — BI INTELLIGENCE</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)', fontWeight: 700 }}>Executive Insights</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, background: 'var(--accent-soft)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 4 }}>Gemini 2.0 Flash</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', padding: '2px 8px' }}>↙ LAST RUN: WEEKLY</span>
                </div>
            </div>

            {/* DRD Context Layer */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 12 }}>CONTEXT LAYERS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-input)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <PieChart size={14} color="var(--accent)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-primary)' }}>
                            Business performance data linked
                        </span>
                        <Zap size={10} color="var(--accent)" style={{ marginLeft: 'auto' }} />
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Database size={14} color="var(--text-secondary)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)' }}>Rule Base: 12 Active Rules</span>
                    </div>
                </div>
            </div>

            {/* DRD Form Inputs */}
            <div style={{ marginBottom: 24 }}>
                <label className="drd-label">Report Type</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {REPORT_TYPES.map(r => (
                        <button key={r}
                            onClick={() => set('report_type', r)}
                            style={{
                                padding: '10px 14px', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 13,
                                transition: 'all 0.15s', cursor: 'pointer', textAlign: 'left',
                                background: form.report_type === r ? 'var(--accent)' : 'var(--bg-input)',
                                border: form.report_type === r ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                                color: form.report_type === r ? '#FFFFFF' : 'var(--text-secondary)', fontWeight: form.report_type === r ? 700 : 500
                            }}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: 32 }}>
                <label className="drd-label">Focus Area (Optional)</label>
                <textarea
                    className="drd-input"
                    placeholder="e.g. 'Concentrate on customer retention metrics for this month'..."
                    value={form.focus_area}
                    onChange={e => set('focus_area', e.target.value)}
                    style={{ minHeight: 120, lineHeight: 1.6 }}
                />
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
            <AppSidebar />
            <div style={{ flex: 1 }}>
                <GenerationCanvas
                    inputPanel={inputPanel}
                    onGenerate={handleGenerate}
                    moduleName="Insight"
                    placeholder="Your executive intelligence report — including weekly briefs, performance trends, and growth forecasts — will stream here."
                />
            </div>
        </div>
    );
}
