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
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
        <Navbar />
        <Hero />

        {/* ── DESIGN GOALS ── */}
        <section id="features" style={{ padding: '96px 0', position: 'relative', background: 'rgba(13,27,46,0.5)' }}>
            <div className="drd-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5 }} />
            <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
                    <div className="drd-pill" style={{ display: 'inline-flex', marginBottom: 20 }}>
                        02 — Design Goals
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', marginBottom: 14 }}>
                        What we're <span style={{ color: 'var(--blue-bright)' }}>designing for</span>
                    </h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--gray)', maxWidth: 520, margin: '0 auto' }}>
                        Every decision traced back to four core principles that make MarketMind feel premium, not generic.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
                    {goals.map((g, i) => (
                        <motion.div
                            key={g.tag}
                            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                            className="drd-card"
                            style={{ padding: '22px 24px' }}
                        >
                            <span style={{ fontSize: 24, display: 'block', marginBottom: 12 }}>{g.icon}</span>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 8 }}>{g.title}</div>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gray)', lineHeight: 1.65, marginBottom: 14 }}>{g.body}</p>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--blue-bright)', background: 'rgba(47,128,237,0.1)', padding: '3px 8px', borderRadius: 4 }}>{g.tag}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── MODULES ── */}
        <Outcomes />

        {/* ── PERFORMANCE TARGETS ── */}
        <section style={{ padding: '80px 0', background: 'var(--navy)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(47,128,237,0.3),transparent)' }} />
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
                    <div className="drd-pill" style={{ display: 'inline-flex', marginBottom: 20 }}>
                        10 — Performance Design
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3vw,40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                        Speed <span style={{ color: 'var(--blue-bright)' }}>targets</span>
                    </h2>
                </motion.div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                    {perf.map(({ v, l }, i) => (
                        <motion.div
                            key={l}
                            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                            className="drd-card"
                            style={{ padding: '20px 16px', textAlign: 'center' }}
                        >
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: 'var(--blue-bright)', marginBottom: 6 }}>{v}</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gray)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{l}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '96px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(47,128,237,0.14), transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <div className="drd-pill" style={{ display: 'inline-flex', marginBottom: 24 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue-bright)', boxShadow: '0 0 8px var(--blue-bright)', animation: 'pulse-dot 2s ease infinite' }} />
                        DRD STATUS — ACTIVE
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4.5vw,60px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 20, lineHeight: 1.05 }}>
                        Ready to feel<br /><span style={{ color: 'var(--blue-bright)' }}>the difference?</span>
                    </h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--gray)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 40px' }}>
                        Join 2,000+ marketers using MarketMind to generate smarter campaigns, score better leads, and close more deals — all in seconds.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn-drd-primary" style={{ fontSize: 16, padding: '14px 36px', borderRadius: 'var(--radius-lg)' }}>
                            Register Free →
                        </Link>
                        <Link to="/login" className="btn-drd-secondary" style={{ fontSize: 16, padding: '14px 36px', borderRadius: 'var(--radius-lg)' }}>
                            ⚡ Demo Access
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
            borderTop: '1px solid rgba(47,128,237,0.12)',
            padding: '28px 32px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            maxWidth: 1200, margin: '0 auto',
        }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, letterSpacing: '0.08em', color: '#fff' }}>MARKETMIND</span>
            <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
                {['Privacy', 'Terms', 'Docs', 'Support'].map(l => (
                    <a key={l} href="#" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-dim)', textDecoration: 'none' }}>{l}</a>
                ))}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>© 2026 MarketMind</span>
        </footer>
    </div>
);

export default LandingPage;
