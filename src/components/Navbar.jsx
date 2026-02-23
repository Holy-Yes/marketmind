import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    const nav = (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            height: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 32px',
            background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'linear-gradient(180deg, rgba(237, 230, 218, 0.6) 0%, transparent 100%)',
            backdropFilter: scrolled ? 'blur(16px)' : 'none',
            borderBottom: scrolled ? '1px solid var(--border-default)' : 'none',
            transition: 'all 0.5s ease',
        }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(232, 106, 42, 0.2)',
                }}>
                    <Zap size={16} color="#fff" fill="#fff" />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
                    MARKETMIND
                </span>
            </Link>

            {/* Desktop links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden md:flex">
                {['Solutions', 'Features', 'Pricing'].map(l => (
                    <a key={l} href={`#${l.toLowerCase()}`} style={{
                        fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700,
                        color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s',
                    }}
                        onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                        onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                    >{l}</a>
                ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hidden md:flex">
                <Link to="/login" style={{
                    fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700,
                    color: 'var(--text-primary)', textDecoration: 'none', padding: '6px 12px',
                }}>Sign in</Link>
                <Link to="/register" style={{
                    fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 800,
                    color: '#fff', textDecoration: 'none',
                    padding: '10px 24px', borderRadius: 10,
                    background: 'var(--accent)',
                    boxShadow: '0 4px 12px rgba(232, 106, 42, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
                }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(232, 106, 42, 0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 12px rgba(232, 106, 42, 0.2)'; }}
                >Initialize Brief →</Link>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer' }} className="md:hidden">
                {open ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Mobile drawer */}
            {open && (
                <div style={{
                    position: 'absolute', top: 52, left: 0, right: 0,
                    background: '#FFFFFF', backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid var(--border-default)',
                    padding: '24px', display: 'flex', flexDirection: 'column', gap: 16,
                    boxShadow: 'var(--shadow-warm)'
                }}>
                    {['Solutions', 'Features', 'Pricing'].map(l => (
                        <a key={l} href={`#${l.toLowerCase()}`} style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>{l}</a>
                    ))}
                    <Link to="/login" style={{ marginTop: 8, padding: '14px', textAlign: 'center', background: 'var(--accent)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 800 }}>
                        Synthesize Now
                    </Link>
                </div>
            )}
        </nav>
    );

    return nav;
};

export default Navbar;
