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
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--navy)', position: 'relative', overflow: 'hidden' }}>
            {/* grid */}
            <div className="drd-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            {/* orbs */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(47,128,237,0.12), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

            {/* LEFT — brand */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px', position: 'relative', zIndex: 1 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 56 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#2F80ED,#22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(79,158,255,0.4)' }}>
                        <Zap size={20} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '0.08em', color: '#fff' }}>MARKETMIND</span>
                </Link>

                <div style={{ marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--blue-bright)', textTransform: 'uppercase' }}>
                    — DRD v1.0 Workspace
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.05, marginBottom: 8 }}>
                    Your intelligence<br />platform starts here.
                </h1>
                <div style={{ width: 48, height: 2, background: 'linear-gradient(90deg,var(--blue),var(--cyan))', borderRadius: 1, margin: '20px 0' }} />

                <div style={{ marginTop: 20 }}>
                    {benefits.map((t, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                            <CheckCircle size={16} color="var(--blue-bright)" />
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--gray-light)' }}>{t}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT — form */}
            <div style={{
                width: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '48px', position: 'relative', zIndex: 1,
                background: 'rgba(22,37,64,0.6)',
                backdropFilter: 'blur(16px)',
                borderLeft: '1px solid rgba(47,128,237,0.15)',
                overflowY: 'auto'
            }}>
                <div style={{ maxWidth: 380, margin: '0 auto', width: '100%', padding: '20px 0' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: '#fff', marginBottom: 6, letterSpacing: '-0.01em' }}>Create account</h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--gray)', marginBottom: 32 }}>Build your AI-powered marketing workspace</p>

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

                        <button type="submit" disabled={loading} className="btn-drd-primary"
                            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, borderRadius: 'var(--radius-lg)', marginBottom: 12 }}>
                            {loading ? 'Creating workspace…' : <><span>Create Workspace</span><ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-dim)', textAlign: 'center', marginTop: 20 }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--blue-bright)', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
