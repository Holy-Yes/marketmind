import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import GenerationCanvas from '../../components/GenerationCanvas';
import api from '../../lib/api';
import { Presentation, Mail, Brain, Database, Zap } from 'lucide-react';

const TONES = ['Persuasive', 'Consultative', 'Direct', 'Friendly', 'Urgent'];
const TYPES = ['Sales Pitch', 'Proposal Deck Outline', 'Follow-up'];

export default function BuildPitch() {
    const [form, setForm] = useState({ prospect_company: '', meeting_context: '', pitch_type: 'Sales Pitch', tone: 'Persuasive' });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleGenerate = async (notes, model) => {
        const payload = {
            prospect_company: form.prospect_company || 'Generic Company',
            meeting_context: form.meeting_context + (notes ? `\n\nRefinement: ${notes}` : ''),
            product_description: `Type: ${form.pitch_type}, Tone: ${form.tone}. ${form.meeting_context}`,
            model: model
        };
        return api.generatePitch(payload);
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
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '0.12em' }}>03 — PITCH BUILDER</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', fontWeight: 700 }}>Sales Intelligence</div>
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
                                background: form.pitch_type === t ? 'var(--amber)' : 'rgba(22,37,64,0.6)',
                                border: form.pitch_type === t ? '1px solid var(--amber)' : '1px solid rgba(47,128,237,0.1)',
                                color: form.pitch_type === t ? 'var(--navy)' : '#fff', fontWeight: form.pitch_type === t ? 600 : 400
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
                                background: form.tone === t ? 'var(--amber)' : 'rgba(22,37,64,0.6)',
                                border: form.tone === t ? '1px solid var(--amber)' : '1px solid rgba(47,128,237,0.1)',
                                color: form.tone === t ? 'var(--navy)' : '#fff', fontWeight: form.tone === t ? 600 : 400
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
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
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
