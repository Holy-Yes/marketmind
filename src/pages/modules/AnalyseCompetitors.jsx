import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import GenerationCanvas from '../../components/GenerationCanvas';
import api from '../../lib/api';
import { BarChart2, Globe, Brain, Database, Zap, Check } from 'lucide-react';

const ANALYSIS_DEPTH = ['Surface Overview', 'Deep-Dive Feature Mapping', 'Pricing & Tier Analysis', 'SEO & Social Footprint'];

export default function AnalyseCompetitors() {
    const [form, setForm] = useState({ competitor_url: '', analysis_depth: 'Surface Overview' });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleGenerate = async (notes, model) => {
        const payload = {
            competitor_name: form.competitor_url + (notes ? ` (${notes})` : ''),
            report_types: [form.analysis_depth],
            model: model
        };
        return api.analyseCompetitors(payload);
    };

    const inputPanel = (
        <div style={{ padding: '24px 28px' }}>
            {/* DRD Header */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BarChart2 size={18} color="var(--cyan)" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--cyan)', letterSpacing: '0.12em' }}>04 — COMPETITOR INTEL</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', fontWeight: 700 }}>Market Intelligence</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, background: 'rgba(34,211,238,0.15)', color: 'var(--cyan)', padding: '2px 8px', borderRadius: 4 }}>Gemini 1.5 Pro + SerpAPI</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', padding: '2px 8px' }}>↙ LAST RUN &lt; 30s</span>
                </div>
            </div>

            {/* DRD Context Layer */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 12 }}>CONTEXT LAYERS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(13,27,46,0.3)', border: '1px solid rgba(34,211,238,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Globe size={14} color="var(--cyan)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: form.competitor_url ? '#fff' : 'var(--text-dim)' }}>
                            {form.competitor_url ? 'Domain targeted' : 'Awaiting competitor URL'}
                        </span>
                        {form.competitor_url && <Zap size={10} color="var(--cyan)" style={{ marginLeft: 'auto' }} />}
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(13,27,46,0.3)', border: '1px solid rgba(34,211,238,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Database size={14} color="var(--text-dim)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-dim)' }}>Outcome Memory training in progress</span>
                    </div>
                </div>
            </div>

            {/* DRD Form Inputs */}
            <div style={{ marginBottom: 24 }}>
                <label className="drd-label">Competitor URL or Name</label>
                <div style={{ position: 'relative' }}>
                    <input
                        className="drd-input"
                        placeholder="e.g. 'https://competitor.com' or 'Salesforce'"
                        value={form.competitor_url}
                        onChange={e => set('competitor_url', e.target.value)}
                    />
                    <div style={{ position: 'absolute', right: 12, top: 12 }}>
                        <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 9,
                            color: form.competitor_url ? 'var(--green)' : 'var(--text-dim)',
                            border: `1px solid ${form.competitor_url ? 'var(--green)' : 'var(--text-dim)'}40`,
                            padding: '1px 6px', borderRadius: 4, textTransform: 'uppercase'
                        }}>
                            {form.competitor_url ? 'VALID' : 'MISSING'}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: 32 }}>
                <label className="drd-label">Analysis Pipeline</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {ANALYSIS_DEPTH.map(d => (
                        <button key={d}
                            onClick={() => set('analysis_depth', d)}
                            style={{
                                padding: '12px 16px', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 13,
                                transition: 'all 0.2s', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: form.analysis_depth === d ? 'rgba(34,211,238,0.15)' : 'rgba(22,37,64,0.4)',
                                border: form.analysis_depth === d ? '1px solid var(--cyan)' : '1px solid rgba(47,128,237,0.1)',
                                color: form.analysis_depth === d ? 'var(--cyan)' : 'var(--gray)', fontWeight: form.analysis_depth === d ? 600 : 400
                            }}
                        >
                            {d}
                            {form.analysis_depth === d && <Check size={14} />}
                        </button>
                    ))}
                </div>
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
                    moduleName="Intelligence"
                    placeholder="Your competitor intelligence report — including feature gap analysis, pricing comparisons, and strategic recommendations — will stream here."
                />
            </div>
        </div>
    );
}
