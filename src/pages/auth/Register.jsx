import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap, ArrowRight, CheckCircle } from 'lucide-react';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
        if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
        setLoading(true); setError('');
        try {
            await register(form.email, form.password, form.name);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Registration failed. Try again.');
        } finally { setLoading(false); }
    };

    const benefits = [
        '7 AI generation modules included',
        'Outcome Memory activates from day one',
        'No credit card required to start',
        'Built with Gemini 1.5 Pro & Groq',
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-page)', position: 'relative', overflow: 'hidden' }}>
            {/* grid */}
            <div className="drd-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4 }} />
            {/* orbs */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232, 106, 42, 0.08), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

            {/* LEFT — brand */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px', position: 'relative', zIndex: 1 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 56 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(232, 106, 42, 0.2)' }}>
                        <Zap size={20} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>MARKETMIND</span>
                </Link>

                <div style={{ marginBottom: 12, fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', color: 'var(--accent)', textTransform: 'uppercase' }}>
                    — COGNITIVE WORKSPACE v1.0
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.05, marginBottom: 12 }}>
                    Your intelligence<br />platform starts here.
                </h1>
                <div style={{ width: 48, height: 3, background: 'var(--accent)', borderRadius: 1.5, margin: '24px 0' }} />

                <div style={{ marginTop: 24 }}>
                    {benefits.map((t, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                            <CheckCircle size={18} color="var(--accent)" />
                            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)' }}>{t}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT — form */}
            <div style={{
                width: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '48px', position: 'relative', zIndex: 1,
                background: '#FFFFFF',
                boxShadow: '-12px 0 64px rgba(26, 26, 24, 0.08)',
                borderLeft: '1px solid var(--border-default)',
                overflowY: 'auto'
            }}>
                <div style={{ maxWidth: 380, margin: '0 auto', width: '100%', padding: '20px 0' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>Create License</h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-secondary)', marginBottom: 40, fontWeight: 500 }}>Build your AI-powered marketing workspace</p>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 16 }}>
                            <label className="drd-label">Full Name</label>
                            <input type="text" required className="drd-input"
                                placeholder="Jane Smith" value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label className="drd-label">Work Email</label>
                            <input type="email" required className="drd-input"
                                placeholder="you@company.com" value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label className="drd-label">Password</label>
                            <input type="password" required className="drd-input"
                                placeholder="Min. 8 characters" value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <label className="drd-label">Confirm Password</label>
                            <input type="password" required className="drd-input"
                                placeholder="Repeat password" value={form.confirm}
                                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
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
                            {loading ? 'Initializing...' : <><span>Initialize Workspace</span><ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', marginTop: 24, fontWeight: 500 }}>
                        Already assigned?{' '}
                        <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 800, textDecoration: 'none' }}>Authenticate →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
