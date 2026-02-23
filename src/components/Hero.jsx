import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, BarChart3, Target, PenTool, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const kpis = [
    { label: 'Leads Scored', value: '2,481', change: '+18%', color: 'var(--green)' },
    { label: 'Campaigns Live', value: '34', change: '+5 this week', color: 'var(--blue-bright)' },
    { label: 'Win Rate', value: '64%', change: '+8 pts', color: 'var(--amber)' },
    { label: 'Revenue AI Impact', value: '$48K', change: 'via memory rules', color: 'var(--cyan)' },
];

const modules = [
    { icon: PenTool, label: 'Campaign Creator', color: 'var(--blue-bright)', glow: 'rgba(79,158,255,0.15)' },
    { icon: Target, label: 'Lead Scorer', color: 'var(--green)', glow: 'rgba(16,185,129,0.15)' },
    { icon: BarChart3, label: 'Intelligence Brief', color: 'var(--amber)', glow: 'rgba(245,158,11,0.15)' },
    { icon: Brain, label: 'Sales Simulator', color: 'var(--cyan)', glow: 'rgba(34,211,238,0.15)' },
];

const sideNav = [
    { emoji: '✦', label: 'Dashboard', active: true },
    { emoji: '✍️', label: 'Create Content', active: false },
    { emoji: '📊', label: 'Score Leads', active: false },
    { emoji: '📨', label: 'Build Pitch', active: false },
    { emoji: '🔍', label: 'Competitors', active: false },
    { emoji: '🎯', label: 'Practice Sale', active: false },
    { emoji: '📊', label: 'Intelligence', active: false },
];

const Hero = () => {
    const orbRef = useRef(null);

    return (
        <section style={{
            position: 'relative', minHeight: '100vh',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            overflow: 'hidden', background: 'var(--navy)', paddingTop: 52,
        }}>
            {/* Grid overlay */}
            <div className="drd-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

            {/* Ambient orbs */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-15%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(47,128,237,0.12), transparent 70%)', filter: 'blur(60px)' }} />
                <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.08), transparent 70%)', filter: 'blur(60px)' }} />
                <div style={{ position: 'absolute', top: '40%', left: '40%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.06), transparent 70%)', filter: 'blur(60px)' }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '64px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="hero-grid">
                {/* LEFT */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                        className="drd-pill" style={{ marginBottom: 28, gap: 8 }}
                    >
                        <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em' }}>
                            DESIGN REQUIREMENTS DOCUMENT — v1.0
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 20 }}
                    >
                        <span style={{ fontSize: 'clamp(40px,5.5vw,72px)', display: 'block', color: '#fff' }}>Market</span>
                        <span style={{ fontSize: 'clamp(40px,5.5vw,72px)', display: 'block', color: 'var(--blue-bright)' }}>Mind</span>
                        <span style={{ fontSize: 'clamp(18px,2vw,24px)', display: 'block', fontWeight: 400, color: 'var(--gray)', fontFamily: 'var(--font-body)', letterSpacing: '0em', marginTop: 8 }}>Generative AI Platform</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        style={{ width: 48, height: 2, background: 'linear-gradient(90deg,var(--blue),var(--cyan))', borderRadius: 1, marginBottom: 20 }}
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                        style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--gray)', lineHeight: 1.7, marginBottom: 36, maxWidth: 460 }}
                    >
                        Generate campaigns, score leads, practise pitches and close more deals — powered by Google Gemini, Groq, and IBM watsonx.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 44 }}
                    >
                        <Link to="/login" className="btn-drd-primary"
                            style={{ fontSize: 15, padding: '12px 28px', borderRadius: 'var(--radius-lg)' }}>
                            Launch Dashboard <ArrowRight size={16} />
                        </Link>
                        <a href="#solutions" className="btn-drd-secondary"
                            style={{ fontSize: 15, padding: '12px 28px', borderRadius: 'var(--radius-lg)' }}>
                            See all 7 modules
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
                        style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}
                    >
                        {[{ v: '7', l: 'AI Modules' }, { v: '∞', l: 'Outcome Memory' }, { v: '<3s', l: 'Token Speed' }].map(({ v, l }) => (
                            <div key={l}>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--blue-bright)' }}>{v}</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gray)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>{l}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* RIGHT — Dashboard preview */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: 'relative' }}
                >
                    {/* Glow */}
                    <div style={{
                        position: 'absolute', inset: 0, borderRadius: 20,
                        background: 'linear-gradient(135deg,rgba(47,128,237,0.25),rgba(34,211,238,0.15))',
                        filter: 'blur(32px)', transform: 'scale(0.94)', zIndex: 0,
                    }} />

                    {/* Card */}
                    <div style={{
                        position: 'relative', zIndex: 1,
                        borderRadius: 20, overflow: 'hidden',
                        border: '1px solid rgba(47,128,237,0.2)',
                        background: 'rgba(13,27,46,0.88)',
                        backdropFilter: 'blur(20px)',
                    }}>
                        {/* Chrome bar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: 'rgba(22,37,64,0.8)', borderBottom: '1px solid rgba(47,128,237,0.12)' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(239,68,68,0.6)' }} />
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(245,158,11,0.6)' }} />
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(16,185,129,0.6)' }} />
                            <div style={{ flex: 1, margin: '0 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '4px 10px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', textAlign: 'center' }}>
                                app.marketmind.ai/dashboard
                            </div>
                        </div>

                        <div style={{ display: 'flex', height: 400 }}>
                            {/* Sidebar */}
                            <div style={{ width: 180, background: 'rgba(13,27,46,0.95)', borderRight: '1px solid rgba(47,128,237,0.1)', padding: 14, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px 14px', borderBottom: '1px solid rgba(47,128,237,0.1)', marginBottom: 6 }}>
                                    <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg,#2F80ED,#22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Zap size={12} color="#fff" fill="#fff" />
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, color: '#fff' }}>MarketMind</span>
                                </div>
                                {sideNav.map(({ emoji, label, active }) => (
                                    <div key={label} style={{
                                        display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
                                        borderRadius: 8, fontSize: 11.5, fontFamily: 'var(--font-body)',
                                        fontWeight: active ? 600 : 400,
                                        color: active ? '#fff' : 'var(--text-dim)',
                                        background: active ? 'rgba(47,128,237,0.2)' : 'transparent',
                                        border: active ? '1px solid rgba(79,158,255,0.25)' : '1px solid transparent',
                                        cursor: 'default',
                                    }}>
                                        <span>{emoji}</span>{label}
                                    </div>
                                ))}
                            </div>

                            {/* Main content */}
                            <div style={{ flex: 1, background: 'rgba(13,27,46,0.7)', padding: 18, overflow: 'hidden' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                    <div>
                                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: '#fff' }}>Good morning 👋</div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gray)', marginTop: 2, letterSpacing: '0.05em' }}>AI INTELLIGENCE BRIEF READY</div>
                                    </div>
                                    <div style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--blue)', fontSize: 11, color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 600 }}>+ New Campaign</div>
                                </div>

                                {/* KPIs */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                                    {kpis.map(({ label, value, change, color }) => (
                                        <div key={label} style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(47,128,237,0.12)' }}>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.06em', marginBottom: 4 }}>{label.toUpperCase()}</div>
                                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#fff' }}>{value}</div>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color, marginTop: 2 }}>{change}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Modules */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                    {modules.map(({ icon: Icon, label, color, glow }) => (
                                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 9, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(47,128,237,0.1)' }}>
                                            <div style={{ width: 28, height: 28, borderRadius: 8, background: glow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Icon size={12} style={{ color }} />
                                            </div>
                                            <div>
                                                <div style={{ fontFamily: 'var(--font-body)', fontSize: 10.5, fontWeight: 600, color: '#fff' }}>{label}</div>
                                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--green)', marginTop: 1 }}>● Ready</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style>{`.hero-grid { @media (max-width: 900px) { grid-template-columns: 1fr !important; } }`}</style>
        </section>
    );
};

export default Hero;
