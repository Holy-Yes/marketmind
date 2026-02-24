import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import GenerationCanvas from '../../components/GenerationCanvas';
import { askAI, askAIStream } from '../../services/aiService';
import { Sparkles, Brain, Database, Zap } from 'lucide-react';
import StyleSelector from '../../components/StyleSelector';

const GOALS = ['Awareness', 'Conversion', 'Retention', 'Engagement'];
const PLATFORMS = ['Instagram', 'LinkedIn', 'Google', 'Email', 'Sales Meeting'];
const TONES = ['Professional', 'Playful', 'Bold', 'Empathetic', 'Urgent'];

export default function CreateContent() {
    const [form, setForm] = useState({ product_description: '', goal: 'Awareness', platform: 'Instagram', tone: 'Professional', visual_style: 'photorealistic' });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleGenerate = async (notes, model, onStream) => {
        const prompt = `Generate a complete Instagram marketing campaign for:
Product: ${form.product_description}
Target audience: General
Goal: ${form.goal}
Tone: ${form.tone}

${notes ? `Focus specifically on: ${notes}` : ''}

Provide:
1. Three caption variants ready to post
2. Ten hashtags with tier labels (mega/mid/niche)
3. Best posting time and day
4. One visual direction suggestion
5. One CTA recommendation`;

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
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(47,128,237,0.15)', border: '1px solid rgba(47,128,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={18} color="var(--blue-bright)" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--blue-bright)', letterSpacing: '0.12em' }}>01 — CAMPAIGN CREATOR</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', fontWeight: 700 }}>AI Campaign Engine</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, background: 'rgba(47,128,237,0.15)', color: 'var(--blue-bright)', padding: '2px 8px', borderRadius: 4 }}>Gemini 1.5 Pro</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', padding: '2px 8px' }}>↙ LAST RUN &lt; 12s</span>
                </div>
            </div>

            {/* DRD Context Layer — Slide 04 */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 12 }}>CONTEXT LAYERS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(13,27,46,0.3)', border: '1px solid rgba(47,128,237,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Database size={14} color="var(--blue-bright)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: form.product_description ? '#fff' : 'var(--text-dim)' }}>
                            {form.product_description ? 'Product context active' : 'Awaiting product description'}
                        </span>
                        {form.product_description && <Zap size={10} color="var(--blue-bright)" style={{ marginLeft: 'auto' }} />}
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(13,27,46,0.3)', border: '1px solid rgba(47,128,237,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Brain size={14} color="var(--text-dim)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-dim)' }}>No brand voice profile uploaded</span>
                    </div>
                </div>
            </div>

            {/* DRD Form Inputs */}
            <div style={{ marginBottom: 24 }}>
                <label className="drd-label">What are we promoting?</label>
                <textarea
                    className="drd-input"
                    placeholder="Describe your product, service or special offer in detail..."
                    value={form.product_description}
                    onChange={e => set('product_description', e.target.value)}
                    style={{ minHeight: 120, lineHeight: 1.6 }}
                />
            </div>

            <div style={{ marginBottom: 24 }}>
                <label className="drd-label">Campaign Goal</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {GOALS.map(g => (
                        <button key={g}
                            onClick={() => set('goal', g)}
                            style={{
                                padding: '6px 14px', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 12,
                                transition: 'all 0.2s', cursor: 'pointer',
                                background: form.goal === g ? 'var(--accent)' : 'var(--bg-input)',
                                border: form.goal === g ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                                color: form.goal === g ? '#FFFFFF' : 'var(--text-primary)', fontWeight: form.goal === g ? 600 : 400
                            }}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: 24 }}>
                <label className="drd-label">Primary Platform</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {PLATFORMS.map(p => (
                        <button key={p}
                            onClick={() => set('platform', p)}
                            style={{
                                padding: '6px 14px', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 12,
                                transition: 'all 0.2s', cursor: 'pointer',
                                background: form.platform === p ? 'var(--accent)' : 'var(--bg-input)',
                                border: form.platform === p ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                                color: form.platform === p ? '#FFFFFF' : 'var(--text-primary)', fontWeight: form.platform === p ? 600 : 400
                            }}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: 32 }}>
                <label className="drd-label">Brand Tone</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {TONES.map(t => (
                        <button key={t}
                            onClick={() => set('tone', t)}
                            style={{
                                padding: '6px 14px', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 12,
                                transition: 'all 0.2s', cursor: 'pointer',
                                background: form.tone === t ? 'var(--accent)' : 'var(--bg-input)',
                                border: form.tone === t ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                                color: form.tone === t ? '#FFFFFF' : 'var(--text-primary)', fontWeight: form.tone === t ? 600 : 400
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <StyleSelector
                selectedStyle={form.visual_style}
                onSelect={(style) => set('visual_style', style)}
            />
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
            <AppSidebar />
            <div style={{ flex: 1 }}>
                <GenerationCanvas
                    inputPanel={inputPanel}
                    onGenerate={handleGenerate}
                    moduleName="Campaign"
                    placeholder="Your complete campaign package — headlines, body copy, hashtag strategy and content calendar — will stream here."
                />
            </div>
        </div>
    );
}
