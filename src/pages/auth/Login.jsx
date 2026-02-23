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
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--navy)', position: 'relative', overflow: 'hidden' }}>
            {/* grid */}
            <div className="drd-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            {/* orbs */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(47,128,237,0.12), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.08), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

            {/* LEFT — brand */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px', position: 'relative', zIndex: 1 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 56 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#2F80ED,#22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(79,158,255,0.4)' }}>
                        <Zap size={20} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '0.08em', color: '#fff' }}>MARKETMIND</span>
                </Link>

                <div style={{ marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--blue-bright)', textTransform: 'uppercase' }}>
                    — DRD v1.0 Platform
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.05, marginBottom: 8 }}>
                    Generate campaigns,<br />score leads, win more.
                </h1>
                <div style={{ width: 48, height: 2, background: 'linear-gradient(90deg,var(--blue),var(--cyan))', borderRadius: 1, margin: '20px 0' }} />
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--gray)', lineHeight: 1.7, maxWidth: 400, marginBottom: 48 }}>
                    The AI platform that creates content, intelligence and decisions your business needs to sell smarter.
                </p>

                {['7 AI modules, one workspace', 'Outcome Memory learns what works for you', 'Results in seconds, not hours'].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--blue-bright)' }}>✦</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--gray-light)' }}>{t}</span>
                    </div>
                ))}
            </div>

            {/* RIGHT — form */}
            <div style={{
                width: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '48px', position: 'relative', zIndex: 1,
                background: 'rgba(22,37,64,0.6)',
                backdropFilter: 'blur(16px)',
                borderLeft: '1px solid rgba(47,128,237,0.15)',
            }}>
                <div style={{ maxWidth: 380, margin: '0 auto', width: '100%' }}>
                    {/* Logo small */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#2F80ED,#22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Zap size={14} color="#fff" fill="#fff" />
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: '#fff' }}>MarketMind</span>
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: '#fff', marginBottom: 6, letterSpacing: '-0.01em' }}>Welcome back</h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--gray)', marginBottom: 32 }}>Sign in to your workspace</p>

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

                        <button type="submit" disabled={loading} className="btn-drd-primary"
                            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, borderRadius: 'var(--radius-lg)', marginBottom: 12 }}>
                            {loading ? 'Signing in…' : <><span>Sign In</span><ArrowRight size={16} /></>}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ position: 'relative', margin: '16px 0', textAlign: 'center' }}>
                        <div style={{ height: 1, background: 'rgba(47,128,237,0.15)', position: 'absolute', top: '50%', left: 0, right: 0 }} />
                        <span style={{ background: 'rgba(22,37,64,0.9)', padding: '0 12px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', position: 'relative', letterSpacing: '0.06em' }}>OR</span>
                    </div>

                    {/* Demo button */}
                    <button onClick={handleDemoLogin} disabled={loading}
                        style={{
                            width: '100%', padding: '14px', borderRadius: 'var(--radius-lg)',
                            border: '1px dashed rgba(79,158,255,0.35)',
                            background: 'rgba(47,128,237,0.06)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
                            color: 'var(--blue-bright)', transition: 'all 0.2s', marginBottom: 24,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-bright)'; e.currentTarget.style.background = 'rgba(47,128,237,0.14)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(79,158,255,0.35)'; e.currentTarget.style.background = 'rgba(47,128,237,0.06)'; }}
                    >
                        <span>⚡ Demo Access</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', fontWeight: 400 }}>demo@marketmind.ai / demo1234</span>
                    </button>

                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-dim)', textAlign: 'center' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--blue-bright)', fontWeight: 600, textDecoration: 'none' }}>Create one free →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
