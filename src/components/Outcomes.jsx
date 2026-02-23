import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, PenTool, Target, MessageSquare, GraduationCap, BarChart3, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const modules = [
    { n: '01', icon: PenTool, title: 'Campaign Creator', model: 'Gemini 1.5 Pro', time: '<15s', color: 'var(--blue-bright)', glow: 'rgba(79,158,255,0.12)' },
    { n: '02', icon: ShoppingBag, title: 'Instagram Studio', model: 'Gemini + DALL-E 3', time: '<60s', color: '#f472b6', glow: 'rgba(244,114,182,0.12)' },
    { n: '03', icon: MessageSquare, title: 'Pitch Builder', model: 'Groq Mixtral', time: '<3s', color: 'var(--amber)', glow: 'rgba(245,158,11,0.12)' },
    { n: '04', icon: TrendingUp, title: 'Competitor Intel', model: 'Gemini + SerpAPI', time: '<30s', color: 'var(--cyan)', glow: 'rgba(34,211,238,0.12)' },
    { n: '05', icon: Target, title: 'Lead Scorer', model: 'AI Rules Engine', time: '<5s', color: 'var(--green)', glow: 'rgba(16,185,129,0.12)' },
    { n: '06', icon: GraduationCap, title: 'Sales Simulator', model: 'Groq LLaMA 70B', time: '<500ms', color: 'var(--gold)', glow: 'rgba(245,158,11,0.12)' },
    { n: '07', icon: BarChart3, title: 'BI Intelligence', model: 'Gemini 1.5 Pro', time: 'Weekly', color: '#818cf8', glow: 'rgba(129,140,248,0.12)' },
];

const Outcomes = () => (
    <section id="solutions" style={{ padding: '96px 0', background: 'var(--navy)', position: 'relative', overflow: 'hidden' }}>
        {/* Grid */}
        <div className="drd-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        {/* Glow */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(47,128,237,0.08), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ textAlign: 'center', marginBottom: 64 }}
            >
                <div className="drd-pill" style={{ display: 'inline-flex', marginBottom: 20 }}>
                    09 — Module Navigation
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', marginBottom: 16 }}>
                    Seven <span style={{ color: 'var(--blue-bright)' }}>generation modules</span>
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--gray)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                    One unified workspace. Seven specialised AI agents. All connected through Outcome Memory that learns what works for your business.
                </p>
            </motion.div>

            {/* Module pills — stacked row */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 48 }}>
                {modules.map((m, i) => (
                    <motion.div
                        key={m.n}
                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 20,
                            padding: '16px 22px',
                            background: 'rgba(22,37,64,0.4)',
                            border: '1px solid rgba(47,128,237,0.15)',
                            borderRadius: 12, cursor: 'pointer', transition: 'all 0.25s',
                        }}
                        whileHover={{ x: 6, borderColor: m.color, background: m.glow }}
                    >
                        {/* Icon */}
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: m.glow, border: `1px solid ${m.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <m.icon size={18} style={{ color: m.color }} />
                        </div>

                        {/* Number */}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: `${m.color}60`, letterSpacing: '0.08em', minWidth: 24 }}>{m.n}</span>

                        {/* Title */}
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, color: '#fff', flex: 1 }}>{m.title}</span>

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
                <Link to="/login" className="btn-drd-primary" style={{ fontSize: 16, padding: '14px 36px', borderRadius: 'var(--radius-lg)' }}>
                    Try all 7 modules free →
                </Link>
            </motion.div>
        </div>
    </section>
);

export default Outcomes;
