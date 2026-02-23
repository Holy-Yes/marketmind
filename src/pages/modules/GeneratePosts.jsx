import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import GenerationCanvas from '../../components/GenerationCanvas';
import api from '../../lib/api';
import { Image as ImageIcon, Camera, Brain, Database, Zap } from 'lucide-react';
import StyleSelector from '../../components/StyleSelector';

const POST_TYPES = ['Static Post', 'Carousel (5 Slides)', 'Story Series'];
const TONES = ['Aesthetic', 'Bold', 'Minimalist', 'Informative', 'High-Energy'];

export default function GeneratePosts() {
    const [form, setForm] = useState({ product_description: '', post_type: 'Static Post', tone: 'Aesthetic' });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleGenerate = async (notes, model) => {
        const mode = 'post';
        const payload = {
            product_description: form.product_description + (notes ? `\n\nRefinement: ${notes}` : ''),
            mode: mode,
            visual_style: form.tone.toLowerCase(),
            goal: 'awareness',
            model: model
        };
        return api.generateInstagram(payload);
    };

    const inputPanel = (
        <div style={{ padding: '24px 28px' }}>
            {/* DRD Header */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Camera size={18} color="#f472b6" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#f472b6', letterSpacing: '0.12em' }}>02 — INSTAGRAM STUDIO</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', fontWeight: 700 }}>Social Content Lab</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, background: 'rgba(244,114,182,0.15)', color: '#f472b6', padding: '2px 8px', borderRadius: 4 }}>Multi-Model Engine</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', padding: '2px 8px' }}>↙ LAST RUN &lt; 60s</span>
                </div>
            </div>

            {/* DRD Context Layer */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 12 }}>CONTEXT LAYERS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(13,27,46,0.3)', border: '1px solid rgba(244,114,182,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Database size={14} color="#f472b6" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: form.product_description ? '#fff' : 'var(--text-dim)' }}>
                            {form.product_description ? 'Product context active' : 'Awaiting product description'}
                        </span>
                        {form.product_description && <Zap size={10} color="#f472b6" style={{ marginLeft: 'auto' }} />}
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(13,27,46,0.3)', border: '1px solid rgba(244,114,182,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Brain size={14} color="var(--text-dim)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-dim)' }}>No brand voice profile uploaded</span>
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
                                padding: '6px 14px', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 12,
                                transition: 'all 0.2s', cursor: 'pointer',
                                background: form.post_type === t ? '#f472b6' : 'rgba(22,37,64,0.6)',
                                border: form.post_type === t ? '1px solid #f472b6' : '1px solid rgba(244,114,182,0.1)',
                                color: form.post_type === t ? 'var(--navy)' : '#fff', fontWeight: form.post_type === t ? 600 : 400
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
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
            <AppSidebar />
            <div style={{ flex: 1 }}>
                <GenerationCanvas
                    inputPanel={inputPanel}
                    onGenerate={handleGenerate}
                    moduleName="Post"
                    placeholder="Your Instagram post — including AI-generated imagery, captions, and Reel scripts — will stream here."
                />
            </div>
        </div>
    );
}
