import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, PenTool, Target, MessageSquare, GraduationCap, BarChart3, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const modules = [
    { n: '01', icon: PenTool, title: 'Campaign Creator', model: 'Gemini 1.5 Pro', time: '<15s', color: 'var(--accent)', glow: 'var(--accent-soft)' },
    { n: '02', icon: ShoppingBag, title: 'Instagram Studio', model: 'DALL-E 3', time: '<60s', color: 'var(--text-primary)', glow: 'var(--bg-hover)' },
    { n: '03', icon: MessageSquare, title: 'Pitch Builder', model: 'Groq Mixtral', time: '<3s', color: 'var(--accent)', glow: 'var(--accent-soft)' },
    { n: '04', icon: TrendingUp, title: 'Competitor Intel', model: 'SerpAPI + LLM', time: '<30s', color: 'var(--text-primary)', glow: 'var(--bg-hover)' },
    { n: '05', icon: Target, title: 'Lead Scorer', model: 'AI Rules Engine', time: '<5s', color: 'var(--accent)', glow: 'var(--accent-soft)' },
    { n: '06', icon: GraduationCap, title: 'Sales Simulator', model: 'Groq LLaMA 3', time: '<500ms', color: 'var(--text-primary)', glow: 'var(--bg-hover)' },
    { n: '07', icon: BarChart3, title: 'BI Intelligence', model: 'Cognitive Engine', time: 'Daily', color: 'var(--accent)', glow: 'var(--accent-soft)' },
];

const Outcomes = () => (
    <section id="solutions" style={{ padding: '120px 0', background: 'var(--bg-page)', position: 'relative', overflow: 'hidden' }}>
        {/* Grid */}
        <div className="drd-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4 }} />
        {/* Glow */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232, 106, 42, 0.05), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ textAlign: 'center', marginBottom: 64 }}
            >
                <div className="drd-pill" style={{ display: 'inline-flex', marginBottom: 20, background: 'var(--accent-soft)', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
                    09 — GENERATION MATRIX
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 20 }}>
                    Seven <br /><span style={{ color: 'var(--accent)' }}>performance modules</span>
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--text-body)', maxWidth: 600, margin: '0 auto', lineHeight: 1.7, fontWeight: 500 }}>
                    Synchronized intelligence. Seven specialized AI modules. Orchestrated through a cognitive memory layer that continuously optimizes for ROI.
                </p>
            </motion.div>

            {/* Module pills — stacked row */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 48 }}>
                {modules.map((m, i) => (
                    <motion.div
                        key={m.n}
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 24,
                            padding: '20px 28px',
                            background: '#FFFFFF',
                            border: '1px solid var(--border-default)',
                            borderRadius: 16, cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.2, 0, 0, 1)',
                            boxShadow: 'var(--shadow-warm)'
                        }}
                        whileHover={{ y: -4, borderColor: 'var(--accent)', boxShadow: '0 12px 32px -8px rgba(232, 106, 42, 0.12)' }}
                    >
                        {/* Icon */}
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: m.glow, border: `1px solid ${m.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <m.icon size={18} style={{ color: m.color }} />
                        </div>

                        {/* Number */}
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.04em', minWidth: 28 }}>{m.n}</span>
                        |
                        {/* Title */}
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', flex: 1 }}>{m.title}</span>

                        {/* Model tag */}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: m.color, background: m.glow, padding: '4px 10px', borderRadius: 6 }}>{m.model}</span>

                        {/* Speed */}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', minWidth: 52, textAlign: 'right' }}>↙ {m.time}</span>
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ textAlign: 'center' }}
            >
                <Link to="/login"
                    style={{
                        fontSize: 16, padding: '16px 40px', borderRadius: 12, background: 'var(--accent)', color: '#FFFFFF', fontWeight: 800, textDecoration: 'none',
                        display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 12px rgba(232, 106, 42, 0.2)', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = ''}
                >
                    Initialize Enterprise License →
                </Link>
            </motion.div>
        </div>
    </section>
);

export default Outcomes;
