import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import GenerationCanvas from '../../components/GenerationCanvas';
import { askAI, askAIStream } from '../../services/aiService';
import { Image as ImageIcon, Camera, Brain, Database, Zap } from 'lucide-react';
import StyleSelector from '../../components/StyleSelector';

const POST_TYPES = ['Static Post', 'Carousel (5 Slides)', 'Story Series'];
const TONES = ['Aesthetic', 'Bold', 'Minimalist', 'Informative', 'High-Energy'];

export default function GeneratePosts() {
    const [form, setForm] = useState({ product_description: '', post_type: 'Static Post', tone: 'Aesthetic' });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleGenerate = async (notes, model, onStream) => {
        const prompt = `You are a social media expert. Generate a concept and content for a ${form.post_type} about:
${form.product_description}
Visual Style: ${form.tone}
${notes ? `Refinement: ${notes}` : ''}

Provide:
1. A creative concept for the post
2. The exact caption to use
3. 3 visual direction prompts for AI image generation
4. Recommended posting time

Make it engaging and high-conversion.`;

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
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent-soft)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Camera size={20} color="var(--accent)" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em' }}>02 — SOCIAL STUDIO</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-primary)', fontWeight: 800 }}>Social Prompt & Concept Lab</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 9, background: 'var(--accent)', color: '#FFFFFF', padding: '3px 10px', borderRadius: 4 }}>STRATEGIC ENGINE</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 9, color: 'var(--text-secondary)', padding: '3px 8px' }}>↙ LATENCY &lt; 60s</span>
                </div>
            </div>

            {/* DRD Context Layer */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: 12 }}>CONTEXT LAYERS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ padding: '12px 16px', borderRadius: 10, background: '#F9F9F9', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Database size={14} color="var(--accent)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: form.product_description ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                            {form.product_description ? 'Product intelligence active' : 'Awaiting product description'}
                        </span>
                        {form.product_description && <Zap size={11} color="var(--accent)" fill="var(--accent)" style={{ marginLeft: 'auto' }} />}
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: 10, background: '#F9F9F9', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Brain size={14} color="var(--text-secondary)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)' }}>No brand voice profile detected</span>
                    </div>
                </div>
            </div>

            {/* DRD Form Inputs */}
            <div style={{ marginBottom: 24 }}>
                <label className="drd-label">What should the post be about?</label>
                <textarea
                    className="drd-input"
                    placeholder="Describe the mood, subject, and goal of this post..."
                    value={form.product_description}
                    onChange={e => set('product_description', e.target.value)}
                    style={{ minHeight: 120, lineHeight: 1.6 }}
                />
            </div>

            <div style={{ marginBottom: 24 }}>
                <label className="drd-label">Format</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {POST_TYPES.map(t => (
                        <button key={t}
                            onClick={() => set('post_type', t)}
                            style={{
                                padding: '8px 16px', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 12,
                                transition: 'all 0.2s', cursor: 'pointer',
                                background: form.post_type === t ? 'var(--accent)' : '#FFFFFF',
                                border: form.post_type === t ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                                color: form.post_type === t ? '#FFFFFF' : 'var(--text-primary)', fontWeight: form.post_type === t ? 700 : 500
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <StyleSelector
                selectedStyle={form.tone.toLowerCase().replace(' ', '_')}
                onSelect={(style) => set('tone', style)}
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
                    moduleName="Post"
                    placeholder="Your Instagram post — including AI-generated image prompts, creative captions, and Reel scripts — will stream here."
                />
            </div>
        </div>
    );
}
