import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import GenerationCanvas from '../../components/GenerationCanvas';
import { askAI, askAIStream } from '../../services/aiService';
import { searchWeb } from '../../services/serpService';
import { Presentation, Mail, Brain, Database, Zap } from 'lucide-react';

const TONES = ['Persuasive', 'Consultative', 'Direct', 'Friendly', 'Urgent'];
const TYPES = ['Sales Pitch', 'Cold Email', 'Proposal Deck Outline', 'Follow-up'];

export default function BuildPitch() {
    const [form, setForm] = useState({ prospect_company: '', meeting_context: '', pitch_type: 'Sales Pitch', tone: 'Persuasive' });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleGenerate = async (notes, model, onStream) => {
        // Step 1: Get live data about the prospect company
        const prospectData = await searchWeb(`${form.prospect_company} challenges pain points India 2024`);
        const context = prospectData.data?.map(r => `${r.title}: ${r.snippet}`).join('\n') || '';

        let prompt = '';
        if (form.pitch_type === 'Cold Email') {
            prompt = `Write a cold email using the PAS framework.
Product: MarketMind (AI Marketing Intelligence)
Prospect company: ${form.prospect_company}
Recent company context from web: ${context}
Pain point context: ${form.meeting_context}
Tone: ${form.tone}

Write:
1. Subject line (under 8 words)
2. Complete email body (under 150 words)
3. Three follow up subject line variants

Make it personal, specific to their company context and not generic.
${notes ? `Additional instruction: ${notes}` : ''}`;
        } else {
            prompt = `Generate a complete sales pitch for a meeting.
Product being sold: MarketMind (AI Marketing Intelligence)
Prospect company: ${form.prospect_company}
Company context from web: ${context}
Meeting context: ${form.meeting_context}
Tone: ${form.tone}

Write:
1. Hook — opening statement that grabs attention in 10 seconds
2. Problem — pain point that resonates with their industry
3. Solution — how the product solves it in simple terms
4. Proof — three specific proof points or outcomes
5. Objection handlers — two likely objections and responses
6. Close — confident closing ask

Make it conversational, specific and ready to deliver.
${notes ? `Refinement: ${notes}` : ''}`;
        }

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
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Presentation size={18} color="var(--amber)" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em' }}>03 — PITCH BUILDER</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)', fontWeight: 700 }}>Sales Intelligence</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, background: 'rgba(245,158,11,0.15)', color: 'var(--amber)', padding: '2px 8px', borderRadius: 4 }}>Groq Mixtral</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', padding: '2px 8px' }}>↙ LAST RUN &lt; 3s</span>
                </div>
            </div>

            {/* DRD Context Layer */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 12 }}>CONTEXT LAYERS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(13,27,46,0.3)', border: '1px solid rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Database size={14} color="var(--amber)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: form.prospect_company ? '#fff' : 'var(--text-dim)' }}>
                            {form.prospect_company ? 'Target company active' : 'Awaiting target company'}
                        </span>
                        {form.prospect_company && <Zap size={10} color="var(--amber)" style={{ marginLeft: 'auto' }} />}
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(13,27,46,0.3)', border: '1px solid rgba(245,158,11,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Brain size={14} color="var(--text-dim)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-dim)' }}>No brand voice profile uploaded</span>
                    </div>
                </div>
            </div>

            {/* DRD Form Inputs */}
            <div style={{ marginBottom: 24 }}>
                <label className="drd-label">Target Company</label>
                <input
                    className="drd-input"
                    placeholder="e.g. 'Apple' or 'Local Coffee Shop'..."
                    value={form.prospect_company}
                    onChange={e => set('prospect_company', e.target.value)}
                />
            </div>

            <div style={{ marginBottom: 24 }}>
                <label className="drd-label">Meeting Context / Goal</label>
                <textarea
                    className="drd-input"
                    placeholder="e.g. 'Introductory call to discuss our AI automation services...'"
                    value={form.meeting_context}
                    onChange={e => set('meeting_context', e.target.value)}
                    style={{ minHeight: 120, lineHeight: 1.6 }}
                />
            </div>

            <div style={{ marginBottom: 24 }}>
                <label className="drd-label">Pitch Type</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {TYPES.map(t => (
                        <button key={t}
                            onClick={() => set('pitch_type', t)}
                            style={{
                                padding: '6px 14px', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 12,
                                transition: 'all 0.2s', cursor: 'pointer',
                                background: form.pitch_type === t ? 'var(--accent)' : 'var(--bg-input)',
                                border: form.pitch_type === t ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                                color: form.pitch_type === t ? '#FFFFFF' : 'var(--text-primary)',
                                fontWeight: form.pitch_type === t ? 600 : 400
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: 32 }}>
                <label className="drd-label">Voice Tone</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {TONES.map(t => (
                        <button key={t}
                            onClick={() => set('tone', t)}
                            style={{
                                padding: '6px 14px', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 12,
                                transition: 'all 0.2s', cursor: 'pointer',
                                background: form.tone === t ? 'var(--accent)' : 'var(--bg-input)',
                                border: form.tone === t ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                                color: form.tone === t ? '#FFFFFF' : 'var(--text-primary)',
                                fontWeight: form.tone === t ? 600 : 400
                            }}
                        >
                            {t}
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
                    moduleName="Pitch"
                    placeholder="Your sales pitch — including cold emails, hook variants, and full proposal outlines — will stream here."
                />
            </div>
        </div>
    );
}
