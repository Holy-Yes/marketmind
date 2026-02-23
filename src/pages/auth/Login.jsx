import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap, ArrowRight } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDemoLogin = async () => {
        setLoading(true); setError('');
        try {
            await login('demo@marketmind.ai', 'demo1234');
            navigate('/dashboard');
        } catch {
            setError('Demo login failed — make sure the backend is running on port 8000.');
        } finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await login(form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Check your credentials.');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-page)', position: 'relative', overflow: 'hidden' }}>
            {/* grid */}
            <div className="drd-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4 }} />
            {/* orbs */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232, 106, 42, 0.08), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217, 206, 186, 0.1), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

            {/* LEFT — brand */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px', position: 'relative', zIndex: 1 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 56 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(232, 106, 42, 0.2)' }}>
                        <Zap size={20} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>MARKETMIND</span>
                </Link>

                <div style={{ marginBottom: 12, fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', color: 'var(--accent)', textTransform: 'uppercase' }}>
                    — COGNITIVE PLATFORM v1.0
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.05, marginBottom: 12 }}>
                    Orchestrate campaigns,<br />calibrate intelligence.
                </h1>
                <div style={{ width: 48, height: 3, background: 'var(--accent)', borderRadius: 1.5, margin: '24px 0' }} />
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--text-body)', lineHeight: 1.7, maxWidth: 420, marginBottom: 48, fontWeight: 500 }}>
                    The high-performance AI workspace for strategic marketing, lead synthesis, and sales optimization.
                </p>

                {['7 high-performance neural modules', 'LOC memory engine activates from entry', 'Sub-second inference for total control'].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 900, fontSize: 14, color: 'var(--accent)' }}>✦</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)' }}>{t}</span>
                    </div>
                ))}
            </div>

            {/* RIGHT — form */}
            <div style={{
                width: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '48px', position: 'relative', zIndex: 1,
                background: '#FFFFFF',
                boxShadow: '-12px 0 64px rgba(26, 26, 24, 0.08)',
                borderLeft: '1px solid var(--border-default)',
            }}>
                <div style={{ maxWidth: 380, margin: '0 auto', width: '100%' }}>
                    {/* Logo small */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Zap size={16} color="#fff" fill="#fff" />
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>MarketMind</span>
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>Initialize Access</h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-secondary)', marginBottom: 40, fontWeight: 500 }}>Authenticate your command workspace</p>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 18 }}>
                            <label className="drd-label">Email address</label>
                            <input type="email" required className="drd-input"
                                placeholder="you@company.com" value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <label className="drd-label">Password</label>
                            <input type="password" required className="drd-input"
                                placeholder="Enter your password" value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                        </div>

                        {error && (
                            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--red)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 20, fontFamily: 'var(--font-body)', fontSize: 13 }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            style={{
                                width: '100%', padding: '14px', fontSize: 16, borderRadius: 12, marginBottom: 16,
                                background: 'var(--accent)', color: '#FFFFFF', fontWeight: 800, border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(232, 106, 42, 0.2)', transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = ''}
                        >
                            {loading ? 'Authenticating…' : <><span>Initialize Workspace</span><ArrowRight size={18} /></>}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ position: 'relative', margin: '24px 0', textAlign: 'center' }}>
                        <div style={{ height: 1, background: 'var(--border-default)', position: 'absolute', top: '50%', left: 0, right: 0 }} />
                        <span style={{ background: '#FFFFFF', padding: '0 16px', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, color: 'var(--text-secondary)', position: 'relative', letterSpacing: '0.1em' }}>CONTROL UNIT</span>
                    </div>

                    {/* Demo button */}
                    <button onClick={handleDemoLogin} disabled={loading}
                        style={{
                            width: '100%', padding: '16px', borderRadius: 12,
                            border: '1px solid var(--border-default)',
                            background: 'var(--bg-page)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
                            color: 'var(--text-primary)', transition: 'all 0.2s', marginBottom: 32,
                            boxShadow: 'var(--shadow-warm)'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-soft)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'var(--bg-page)'; }}
                    >
                        <span>⚡ Demo Terminal Access</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>demo@marketmind.ai / demo1234</span>
                    </button>

                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', fontWeight: 500 }}>
                        Awaiting assignment?{' '}
                        <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 800, textDecoration: 'none' }}>Initialize Account Free →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
