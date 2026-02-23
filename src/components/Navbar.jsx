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
            background: scrolled ? 'rgba(13,27,46,0.92)' : 'linear-gradient(180deg,rgba(13,27,46,0.85) 0%,transparent 100%)',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(47,128,237,0.12)' : 'none',
            transition: 'all 0.4s',
        }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'linear-gradient(135deg,#2F80ED,#22D3EE)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 14px rgba(79,158,255,0.4)',
                }}>
                    <Zap size={16} color="#fff" fill="#fff" />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, letterSpacing: '0.08em', color: '#fff' }}>
                    MARKETMIND
                </span>
            </Link>

            {/* Desktop links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden md:flex">
                {['Solutions', 'Features', 'Pricing'].map(l => (
                    <a key={l} href={`#${l.toLowerCase()}`} style={{
                        fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
                        color: 'var(--gray)', textDecoration: 'none', transition: 'color 0.2s',
                    }}
                        onMouseEnter={e => e.target.style.color = '#fff'}
                        onMouseLeave={e => e.target.style.color = 'var(--gray)'}
                    >{l}</a>
                ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hidden md:flex">
                <Link to="/login" style={{
                    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                    color: 'var(--gray)', textDecoration: 'none', padding: '6px 12px',
                }}>Sign in</Link>
                <Link to="/register" style={{
                    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                    color: '#fff', textDecoration: 'none',
                    padding: '8px 20px', borderRadius: 'var(--radius-md)',
                    background: 'var(--blue)',
                    boxShadow: 'var(--shadow-blue)',
                    transition: 'all 0.2s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#4F9EFF'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue)'; e.currentTarget.style.transform = ''; }}
                >Get Started Free →</Link>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer' }} className="md:hidden">
                {open ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Mobile drawer */}
            {open && (
                <div style={{
                    position: 'absolute', top: 52, left: 0, right: 0,
                    background: 'rgba(13,27,46,0.97)', backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(47,128,237,0.15)',
                    padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                    {['Solutions', 'Features', 'Pricing'].map(l => (
                        <a key={l} href={`#${l.toLowerCase()}`} style={{ color: 'var(--gray)', fontFamily: 'var(--font-body)', fontSize: 15, textDecoration: 'none' }}>{l}</a>
                    ))}
                    <Link to="/login" style={{ marginTop: 8, padding: '12px 0', textAlign: 'center', background: 'var(--blue)', color: '#fff', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                        Launch Dashboard
                    </Link>
                </div>
            )}
        </nav>
    );

    return nav;
};

export default Navbar;
