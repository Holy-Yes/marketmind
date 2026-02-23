import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Outcomes from '../components/Outcomes';

/* ── Design goals (DRD slide 02) ── */
const goals = [
    { icon: '⚡', title: 'Generation feels alive', body: 'Stream output word-by-word. Users perceive generation as immediate and intelligent.', tag: 'STREAMING' },
    { icon: '🎯', title: 'Context always visible', body: 'Surface all context layers on every view. Users understand why output was generated.', tag: 'TRANSPARENCY' },
    { icon: '🚫', title: 'Zero template feel', body: 'No dropdowns. No fill-in-the-blank. Describe goals in natural language exclusively.', tag: 'UX PRINCIPLE' },
    { icon: '🏎️', title: 'Speed is a feature', body: 'Time-to-first-token under 1 second from click. Progress shown for every generation stage.', tag: 'PERFORMANCE' },
];

/* ── Performance targets (DRD slide 10) ── */
const perf = [
    { v: '<1s', l: 'Interactive desktop' },
    { v: '<1s', l: 'First token from click' },
    { v: '60fps', l: 'Canvas transitions' },
    { v: '<50ms', l: 'Button state change' },
];

const LandingPage = () => (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
        <Navbar />
        <Hero />

        {/* ── DESIGN GOALS ── */}
        <section id="features" style={{ padding: '120px 0', position: 'relative', background: '#FFFFFF', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
            <div className="drd-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.3 }} />
            <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 72 }}>
                    <div className="drd-pill" style={{ display: 'inline-flex', marginBottom: 20, background: 'var(--accent-soft)', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
                        02 — PHILOSOPHY
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,4.5vw,60px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 20 }}>
                        Engineered for <br /><span style={{ color: 'var(--accent)' }}>cognitive dominance</span>
                    </h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--text-body)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7, fontWeight: 500 }}>
                        Every line of code is traced back to four foundational principles that define the MarketMind experience.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
                    {goals.map((g, i) => (
                        <motion.div
                            key={g.tag}
                            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            style={{
                                padding: '32px', background: 'var(--bg-page)', borderRadius: 20, border: '1px solid var(--border-default)',
                                boxShadow: 'var(--shadow-warm)', transition: 'all 0.3s ease'
                            }}
                            whileHover={{ y: -8, borderColor: 'var(--accent)', boxShadow: '0 20px 40px -12px rgba(232, 106, 42, 0.12)' }}
                        >
                            <span style={{ fontSize: 32, display: 'block', marginBottom: 20 }}>{g.icon}</span>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', marginBottom: 12 }}>{g.title}</div>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-body)', lineHeight: 1.7, marginBottom: 24, fontWeight: 500 }}>{g.body}</p>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: 'var(--accent)', background: 'var(--accent-soft)', padding: '6px 12px', borderRadius: 8, textTransform: 'uppercase' }}>{g.tag}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── MODULES ── */}
        <Outcomes />

        {/* ── PERFORMANCE TARGETS ── */}
        <section style={{ padding: '100px 0', background: 'var(--bg-page)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--border-default),transparent)' }} />
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
                    <div className="drd-pill" style={{ display: 'inline-flex', marginBottom: 20, background: 'var(--accent-soft)', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
                        10 — LATENCY BENCHMARKS
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,3.5vw,48px)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        Performance <span style={{ color: 'var(--accent)' }}>thresholds</span>
                    </h2>
                </motion.div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                    {perf.map(({ v, l }, i) => (
                        <motion.div
                            key={l}
                            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                            style={{
                                padding: '32px 24px', textAlign: 'center', background: '#FFFFFF', borderRadius: 16, border: '1px solid var(--border-default)',
                                boxShadow: 'var(--shadow-warm)'
                            }}
                        >
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 40, color: 'var(--accent)', marginBottom: 8 }}>{v}</div>
                            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 800 }}>{l}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '120px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden', background: '#FFFFFF' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232, 106, 42, 0.06), transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <div className="drd-pill" style={{ display: 'inline-flex', marginBottom: 28, background: 'var(--accent-soft)', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)', animation: 'pulse-dot 2s ease infinite' }} />
                        SYSTEM STATUS — ONLINE
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,6vw,72px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 24, lineHeight: 1 }}>
                        Experience the <br /><span style={{ color: 'var(--accent)' }}>new standard.</span>
                    </h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, color: 'var(--text-body)', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 48px', fontWeight: 500 }}>
                        Join a select group of marketers leveraging cognitive AI to orchestrate campaigns, synthesize intelligence, and close deals in milliseconds.
                    </p>
                    <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register"
                            style={{
                                fontSize: 18, padding: '18px 48px', borderRadius: 14, background: 'var(--accent)', color: '#FFFFFF', fontWeight: 800, textDecoration: 'none',
                                boxShadow: '0 8px 16px rgba(232, 106, 42, 0.2)', transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = ''}
                        >
                            Start Initialization →
                        </Link>
                        <Link to="/login"
                            style={{
                                fontSize: 18, padding: '18px 48px', borderRadius: 14, background: '#FFFFFF', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontWeight: 700, textDecoration: 'none',
                                boxShadow: 'var(--shadow-warm)', transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                            onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                        >
                            ⚡ Demo Terminal
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
            borderTop: '1px solid var(--border-default)',
            padding: '40px 32px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            maxWidth: 1200, margin: '0 auto',
            background: 'var(--bg-page)'
        }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>MARKETMIND</span>
            <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                {['Privacy', 'Terms', 'Docs', 'Support'].map(l => (
                    <a key={l} href="#" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 700 }}>{l}</a>
                ))}
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>© 2026 Cognitive Systems Corp</span>
        </footer>
    </div>
);

export default LandingPage;
