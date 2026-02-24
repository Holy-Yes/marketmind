import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import GenerationCanvas from '../../components/GenerationCanvas';
import { askAI, askAIStream } from '../../services/aiService';
import { BarChart2, Globe, Brain, Database, Zap, Check } from 'lucide-react';

const ANALYSIS_DEPTH = ['Surface Overview', 'Deep-Dive Feature Mapping', 'Pricing & Tier Analysis', 'SEO & Social Footprint'];

export default function AnalyseCompetitors() {
    const [form, setForm] = useState({ brand1: 'MarketMind', brand2: '', analysis_depth: 'Surface Overview' });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleGenerate = async (notes, model, onStream) => {
        const prompt = `You are a market analyst. Compare these two brands:
Brand 1: ${form.brand1}
Brand 2: ${form.brand2}
${notes ? `Focus area: ${notes}` : ''}

Analyze them across:
1. Product quality
2. Market positioning  
3. Customer satisfaction
4. Innovation

For each dimension give a score out of 100 for each brand and one sentence explanation.
Then write a 3 sentence overall summary of who has the advantage and why.`;

        const result = await askAIStream(prompt, onStream);
        if (result.success) {
            return { content: result.data };
        } else {
            throw new Error(result.error);
        }
    };

    const inputPanel = (
        <div style={{ padding: '24px 28px' }}>
            {/* DRD Header */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--accent-soft)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BarChart2 size={18} color="var(--accent)" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em' }}>04 — COMPETITOR INTEL</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)', fontWeight: 700 }}>Market Intelligence</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, background: 'rgba(34,211,238,0.15)', color: 'var(--cyan)', padding: '2px 8px', borderRadius: 4 }}>Groq & SerpAPI</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', padding: '2px 8px' }}>↙ LAST RUN &lt; 30s</span>
                </div>
            </div>

            {/* DRD Context Layer */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 12 }}>CONTEXT LAYERS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-input)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Globe size={14} color="var(--accent)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: form.brand2 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                            {form.brand2 ? 'Battle mode active' : 'Awaiting competitor name'}
                        </span>
                        {form.brand2 && <Zap size={10} color="var(--accent)" style={{ marginLeft: 'auto' }} />}
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Database size={14} color="var(--text-secondary)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)' }}>Outcome Memory training in progress</span>
                    </div>
                </div>
            </div>

            {/* DRD Form Inputs */}
            <div style={{ marginBottom: 20 }}>
                <label className="drd-label">Your Brand</label>
                <input
                    className="drd-input"
                    placeholder="Your company name..."
                    value={form.brand1}
                    onChange={e => set('brand1', e.target.value)}
                />
            </div>

            <div style={{ marginBottom: 24 }}>
                <label className="drd-label">Competitor Brand</label>
                <div style={{ position: 'relative' }}>
                    <input
                        className="drd-input"
                        placeholder="e.g. 'Salesforce' or 'HubSpot'..."
                        value={form.brand2}
                        onChange={e => set('brand2', e.target.value)}
                    />
                    <div style={{ position: 'absolute', right: 12, top: 12 }}>
                        <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 9,
                            color: form.brand2 ? 'var(--success)' : 'var(--text-placeholder)',
                            border: `1px solid ${form.brand2 ? 'var(--success)' : 'var(--text-placeholder)'}40`,
                            padding: '1px 6px', borderRadius: 4, textTransform: 'uppercase'
                        }}>
                            {form.brand2 ? 'READY' : 'MISSING'}
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
                                background: form.analysis_depth === d ? 'var(--accent)' : 'var(--bg-input)',
                                border: form.analysis_depth === d ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                                color: form.analysis_depth === d ? '#FFFFFF' : 'var(--text-secondary)', fontWeight: form.analysis_depth === d ? 700 : 500
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
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
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
