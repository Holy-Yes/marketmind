import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, BarChart3, Target, PenTool, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const kpis = [
    { label: 'Leads Scored', value: '2,481', change: '+18%', color: '#E86A2A' },
    { label: 'Campaigns Live', value: '34', change: '+5 this week', color: '#1A1A18' },
    { label: 'Win Rate', value: '64%', change: '+8 pts', color: '#E86A2A' },
    { label: 'Revenue Impact', value: '$48K', change: 'via memory rules', color: '#1A1A18' },
];

const modules = [
    { icon: PenTool, label: 'Campaign Creator', color: '#E86A2A', glow: 'rgba(232, 106, 42, 0.1)' },
    { icon: Target, label: 'Lead Scorer', color: '#1A1A18', glow: 'rgba(26, 26, 24, 0.1)' },
    { icon: BarChart3, label: 'Intelligence brief', color: '#E86A2A', glow: 'rgba(232, 106, 42, 0.1)' },
    { icon: Brain, label: 'Sales Simulator', color: '#1A1A18', glow: 'rgba(26, 26, 24, 0.1)' },
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
            overflow: 'hidden', background: 'var(--bg-page)', paddingTop: 52,
        }}>
            {/* Grid overlay */}
            <div className="drd-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

            {/* Ambient orbs */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-15%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232, 106, 42, 0.08), transparent 70%)', filter: 'blur(60px)' }} />
                <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26, 26, 24, 0.05), transparent 70%)', filter: 'blur(60px)' }} />
                <div style={{ position: 'absolute', top: '40%', left: '40%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217, 206, 186, 0.2), transparent 70%)', filter: 'blur(60px)' }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '64px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="hero-grid">
                {/* LEFT */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                        className="drd-pill" style={{ marginBottom: 28, gap: 10, background: 'var(--accent-soft)', border: '1px solid var(--accent)', color: 'var(--accent)' }}
                    >
                        <span className="pulse-dot" style={{ width: 6, height: 6, background: 'var(--accent)' }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em' }}>
                            STRATEGIC INTELLIGENCE — v1.0
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 24 }}
                    >
                        <span style={{ fontSize: 'clamp(48px,6vw,84px)', display: 'block', color: 'var(--text-primary)' }}>Market</span>
                        <span style={{ fontSize: 'clamp(48px,6vw,84px)', display: 'block', color: 'var(--accent)' }}>Mind</span>
                        <span style={{ fontSize: 'clamp(18px,2.2vw,22px)', display: 'block', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', letterSpacing: '0.05em', marginTop: 12, textTransform: 'uppercase' }}>Cognitive Performance Suite</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        style={{ width: 64, height: 3, background: 'var(--accent)', borderRadius: 2, marginBottom: 24 }}
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                        style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--text-body)', lineHeight: 1.7, marginBottom: 40, maxWidth: 480, fontWeight: 500 }}
                    >
                        Orchestrate global campaigns, calibrate leads, and synthesize strategic intelligence across 7 high-performance AI modules.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 56 }}
                    >
                        <Link to="/login"
                            style={{
                                fontSize: 16, padding: '16px 36px', borderRadius: 12, background: 'var(--accent)', color: '#FFFFFF', fontWeight: 800, textDecoration: 'none',
                                display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 12px rgba(232, 106, 42, 0.2)', transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = ''}
                        >
                            Open Command Lab <ArrowRight size={18} />
                        </Link>
                        <a href="#solutions"
                            style={{
                                fontSize: 16, padding: '16px 36px', borderRadius: 12, background: '#FFFFFF', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontWeight: 700, textDecoration: 'none',
                                transition: 'all 0.2s', boxShadow: 'var(--shadow-warm)'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                            onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                        >
                            Review Matrix
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
                        style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}
                    >
                        {[{ v: '7', l: 'Neural Modules' }, { v: 'LOC', l: 'Context Memory' }, { v: '<1s', l: 'Token Latency' }].map(({ v, l }) => (
                            <div key={l}>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 32, color: 'var(--text-primary)' }}>{v}</div>
                                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
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
                        background: 'linear-gradient(135deg, rgba(232, 106, 42, 0.15), rgba(217, 206, 186, 0.2))',
                        filter: 'blur(48px)', transform: 'scale(0.96)', zIndex: 0,
                    }} />

                    {/* Card */}
                    <div style={{
                        position: 'relative', zIndex: 1,
                        borderRadius: 20, overflow: 'hidden',
                        border: '1px solid var(--border-default)',
                        background: '#FFFFFF',
                        boxShadow: '0 24px 64px -12px rgba(26, 26, 24, 0.12)',
                    }}>
                        {/* Chrome bar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 20px', background: 'var(--bg-input)', borderBottom: '1px solid var(--border-default)' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
                            <div style={{ flex: 1, margin: '0 12px', background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 6, padding: '6px 14px', fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--text-secondary)', textAlign: 'center', fontWeight: 600 }}>
                                app.marketmind.ai/dashboard
                            </div>
                        </div>

                        <div style={{ display: 'flex', height: 400 }}>
                            {/* Sidebar */}
                            <div style={{ width: 200, background: '#FFFFFF', borderRight: '1px solid var(--border-default)', padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 0 16px', borderBottom: '1px solid var(--border-default)', marginBottom: 12 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Zap size={14} color="#fff" fill="#fff" />
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>MarketMind</span>
                                </div>
                                {sideNav.map(({ emoji, label, active }) => (
                                    <div key={label} style={{
                                        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                                        borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-body)',
                                        fontWeight: active ? 700 : 500,
                                        color: active ? 'var(--accent)' : 'var(--text-secondary)',
                                        background: active ? 'var(--accent-soft)' : 'transparent',
                                        cursor: 'default',
                                    }}>
                                        <span>{emoji}</span>{label}
                                    </div>
                                ))}
                            </div>

                            {/* Main content */}
                            <div style={{ flex: 1, background: 'var(--bg-page)', padding: 24, overflow: 'hidden' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                                    <div>
                                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>Good morning 👋</div>
                                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700, marginTop: 4, letterSpacing: '0.05em' }}>AI INTELLIGENCE BRIEF READY</div>
                                    </div>
                                    <div style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--accent)', fontSize: 12, color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700 }}>+ New Module</div>
                                </div>

                                {/* KPIs */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                                    {kpis.map(({ label, value, change, color }) => (
                                        <div key={label} style={{ padding: '14px 16px', borderRadius: 12, background: '#FFFFFF', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-warm)' }}>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 4 }}>{label.toUpperCase()}</div>
                                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>{value}</div>
                                            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color, fontWeight: 800, marginTop: 4 }}>{change}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Modules */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    {modules.map(({ icon: Icon, label, color, glow }) => (
                                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, background: '#FFFFFF', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-warm)' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 8, background: glow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Icon size={14} style={{ color }} />
                                            </div>
                                            <div>
                                                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</div>
                                                <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--accent)', fontWeight: 800, marginTop: 2 }}>● Validated</div>
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
