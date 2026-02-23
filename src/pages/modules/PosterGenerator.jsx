import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import api from '../../lib/api';
import { Image as ImageIcon, Sparkles, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STYLES = ['Aesthetic', 'Bold', 'Minimalist', 'Informative', 'High-Energy', 'Luxury', 'Viral'];
const FORMATS = ['Square (1:1)', 'Story (9:16)', 'Landscape (16:9)', 'Portrait (4:5)'];

export default function PosterGenerator() {
    const [form, setForm] = useState({ 
        description: '', 
        style: 'Aesthetic',
        format: 'Square (1:1)'
    });
    const [status, setStatus] = useState('idle'); // idle | generating | complete | error
    const [generatedImage, setGeneratedImage] = useState('');
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!form.description.trim()) return;
        
        setStatus('generating');
        setError('');
        
        try {
            const response = await api.generateInstagram({
                product_description: form.description,
                mode: 'post',
                visual_style: form.style.toLowerCase(),
                goal: 'awareness'
            });
            
            if (response.image_url) {
                setGeneratedImage(response.image_url);
                setStatus('complete');
            } else {
                setError('Failed to generate image. Please try again.');
                setStatus('error');
            }
        } catch (err) {
            setError(err.message || 'Generation failed');
            setStatus('error');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
            <AppSidebar />
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                {/* Header */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ImageIcon size={20} color="#f472b6" />
                        </div>
                        <div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#f472b6', letterSpacing: '0.12em' }}>02 — POSTER GENERATOR</div>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#fff', margin: 0, marginTop: 4 }}>Visual Content Studio</h1>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    {/* Left: Input Controls */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div style={{
                            background: 'rgba(22,37,64,0.6)', border: '1px solid rgba(244,114,182,0.15)', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 24
                        }}>
                            <div>
                                <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gray)', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                                    What should the poster be about?
                                </label>
                                <textarea
                                    placeholder="Describe the product, mood, message, and target audience..."
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    style={{
                                        width: '100%', minHeight: 120, padding: '12px 14px', background: 'rgba(13,27,46,0.5)',
                                        border: '1px solid rgba(244,114,182,0.2)', borderRadius: 10, color: '#fff', fontFamily: 'var(--font-body)',
                                        fontSize: 13, lineHeight: 1.5, resize: 'none'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gray)', display: 'block', marginBottom: 12, fontWeight: 600 }}>
                                    Visual Style
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                    {STYLES.map(s => (
                                        <button key={s}
                                            onClick={() => setForm({ ...form, style: s })}
                                            style={{
                                                padding: '10px 12px', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 12,
                                                cursor: 'pointer',
                                                background: form.style === s ? 'rgba(244,114,182,0.2)' : 'rgba(13,27,46,0.5)',
                                                border: form.style === s ? '1px solid #f472b6' : '1px solid rgba(244,114,182,0.1)',
                                                color: form.style === s ? '#f472b6' : 'var(--gray)',
                                                fontWeight: form.style === s ? 600 : 400,
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gray)', display: 'block', marginBottom: 12, fontWeight: 600 }}>
                                    Format
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                    {FORMATS.map(f => (
                                        <button key={f}
                                            onClick={() => setForm({ ...form, format: f })}
                                            style={{
                                                padding: '10px 12px', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 12,
                                                cursor: 'pointer',
                                                background: form.format === f ? 'rgba(244,114,182,0.2)' : 'rgba(13,27,46,0.5)',
                                                border: form.format === f ? '1px solid #f472b6' : '1px solid rgba(244,114,182,0.1)',
                                                color: form.format === f ? '#f472b6' : 'var(--gray)',
                                                fontWeight: form.format === f ? 600 : 400,
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={status === 'generating' || !form.description.trim()}
                                style={{
                                    padding: '12px 24px', background: status === 'generating' ? '#f472b650' : '#f472b6',
                                    color: '#fff', border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)',
                                    fontSize: 14, fontWeight: 600, cursor: status === 'generating' ? 'wait' : 'pointer',
                                    opacity: status === 'generating' || !form.description.trim() ? 0.6 : 1,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {status === 'generating' ? (
                                    <><Sparkles size={16} style={{ display: 'inline', marginRight: 8, animation: 'spin 1s linear infinite' }} /> Generating...</>
                                ) : (
                                    <><Sparkles size={16} style={{ display: 'inline', marginRight: 8 }} /> Generate Poster</>
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/* Right: Image Preview */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div style={{
                            background: 'rgba(22,37,64,0.6)', border: '1px solid rgba(244,114,182,0.15)', borderRadius: 16, padding: 28,
                            minHeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <AnimatePresence mode="wait">
                                {status === 'idle' && (
                                    <motion.div initial={{ opacity: 0 }} exit={{ opacity: 0 }} style={{ textAlign: 'center' }}>
                                        <ImageIcon size={48} color="rgba(244,114,182,0.3)" style={{ marginBottom: 16 }} />
                                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--gray)' }}>
                                            Your AI-generated poster will appear here
                                        </p>
                                    </motion.div>
                                )}

                                {status === 'generating' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 16 }}>
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ height: [10, 30, 10] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                                                    style={{ width: 4, background: '#f472b6', borderRadius: 2 }}
                                                />
                                            ))}
                                        </div>
                                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--gray)' }}>
                                            Creating your poster...
                                        </p>
                                    </motion.div>
                                )}

                                {status === 'complete' && generatedImage && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%' }}>
                                        <img src={generatedImage} alt="Generated Poster" style={{
                                            width: '100%', borderRadius: 12, marginBottom: 20, border: '1px solid rgba(244,114,182,0.2)'
                                        }} />
                                        <button
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = generatedImage;
                                                link.download = 'poster.png';
                                                link.click();
                                            }}
                                            style={{
                                                width: '100%', padding: '12px 24px', background: '#f472b6', color: '#fff',
                                                border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 13,
                                                fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', gap: 8
                                            }}
                                        >
                                            <Download size={16} /> Download Poster
                                        </button>
                                    </motion.div>
                                )}

                                {status === 'error' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                                        borderRadius: 12, padding: 20, textAlign: 'center', width: '100%'
                                    }}>
                                        <AlertCircle size={32} color="#ef4444" style={{ marginBottom: 12 }} />
                                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gray)', margin: 0, marginBottom: 12 }}>
                                            {error}
                                        </p>
                                        <button
                                            onClick={() => setStatus('idle')}
                                            style={{
                                                padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none',
                                                borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Try Again
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
