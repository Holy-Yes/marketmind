import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Zap, Sparkles, Image, Presentation, BarChart2,
    MessageSquare, Brain, LayoutDashboard, LogOut,
    ChevronRight, ChevronLeft, Sun, Moon, ShoppingBag
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NAV_SECTIONS = [
    { label: 'PLATFORM', items: [{ label: 'Overview', icon: LayoutDashboard, path: '/dashboard', emoji: '⊞' }] },
    {
        label: 'MODULES', items: [
            { label: 'Create Content', icon: Sparkles, path: '/dashboard/create-content', emoji: '✦', model: 'Gemini' },
            { label: 'Social Prompts', icon: Image, path: '/dashboard/generate-posts', emoji: '📸', model: 'Visual Brief' },
            { label: 'Build a Pitch', icon: Presentation, path: '/dashboard/build-pitch', emoji: '📨', model: 'Groq <3s' },
            { label: 'Analyse Competitors', icon: BarChart2, path: '/dashboard/analyse-competitors', emoji: '🔍', badge: 'LIVE' },
            { label: 'My Products', icon: ShoppingBag, path: '/dashboard/products', emoji: '📦', badge: 'PRO' },
            { label: 'Practice a Sale', icon: MessageSquare, path: '/dashboard/practice-sale', emoji: '💬', model: 'LLaMA 70B' },
            { label: 'View Intelligence', icon: Brain, path: '/dashboard/intelligence', emoji: '📊', badge: 'NEW' },
        ]
    },
];

export default function AppSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => { logout(); navigate('/'); };
    const w = collapsed ? 68 : 220;

    return (
        <aside style={{
            width: w, minHeight: '100vh',
            background: '#1A1A18',
            display: 'flex', flexDirection: 'column', flexShrink: 0,
            transition: 'width 0.25s ease', position: 'sticky', top: 0, zIndex: 20,
            borderRight: '1px solid rgba(217, 206, 186, 0.1)',
        }}>
            {/* Logo */}
            <div style={{
                padding: '18px 14px', display: 'flex', alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between',
                borderBottom: '1px solid rgba(217, 206, 186, 0.1)',
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                    <div style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: '#E86A2A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, boxShadow: '0 4px 12px rgba(232, 106, 42, 0.3)',
                    }}>
                        <Zap size={14} color="#fff" fill="#fff" />
                    </div>
                    {!collapsed && (
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', color: '#fff' }}>MARKETMIND</span>
                    )}
                </Link>
                {!collapsed && (
                    <button onClick={() => setCollapsed(true)} style={{ background: 'transparent', color: 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', padding: 4 }}>
                        <ChevronLeft size={14} />
                    </button>
                )}
                {collapsed && (
                    <button onClick={() => setCollapsed(false)} style={{ position: 'absolute', right: -12, top: 22, background: '#1A1A18', color: '#fff', border: '1px solid rgba(217,206,186,0.2)', cursor: 'pointer', padding: '4px 2px', borderRadius: 4 }}>
                        <ChevronRight size={12} />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {NAV_SECTIONS.map(({ label, items }) => (
                    <div key={label}>
                        {!collapsed && (
                            <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', padding: '0 8px', marginBottom: 6, marginTop: 4 }}>
                                {label}
                            </div>
                        )}
                        {items.map(({ label: lbl, icon: Icon, path, emoji, badge, model }) => {
                            const active = location.pathname === path;
                            return (
                                <Link key={path} to={path} title={collapsed ? lbl : undefined} style={{
                                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                                    borderRadius: 8, marginBottom: 2, textDecoration: 'none',
                                    background: active ? '#E86A2A' : 'transparent',
                                    color: active ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                                    transition: 'all 0.18s',
                                    justifyContent: collapsed ? 'center' : undefined,
                                }}
                                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; } }}
                                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; } }}
                                >
                                    <Icon size={16} style={{ flexShrink: 0 }} />
                                    {!collapsed && (
                                        <>
                                            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: active ? 600 : 400, flex: 1 }}>{lbl}</span>
                                            {badge ? (
                                                <span style={{ fontFamily: 'var(--font-body)', fontSize: 8, fontWeight: 700, letterSpacing: '0.06em', padding: '2px 6px', borderRadius: 4, background: active ? 'rgba(255,255,255,0.2)' : 'rgba(232, 106, 42, 0.15)', color: active ? '#fff' : '#E86A2A' }}>{badge}</span>
                                            ) : model ? (
                                                <span style={{ fontFamily: 'var(--font-body)', fontSize: 8, color: active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>{model}</span>
                                            ) : null}
                                        </>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* User & Logout */}
            <div style={{ borderTop: '1px solid rgba(217, 206, 186, 0.1)', padding: '12px 8px' }}>
                {!collapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 4 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(232, 106, 42, 0.2)', border: '1px solid rgba(232, 106, 42, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: '#E86A2A', flexShrink: 0 }}>
                            {(user?.name || 'U')[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</p>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                        </div>
                    </div>
                )}
                <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                    width: '100%', background: 'transparent', color: 'rgba(255,255,255,0.5)',
                    border: 'none', borderRadius: 8, cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: 13,
                    transition: 'all 0.18s',
                    justifyContent: collapsed ? 'center' : undefined,
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#FCA5A5'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                >
                    <LogOut size={14} />
                    {!collapsed && 'Sign Out'}
                </button>
            </div>
        </aside>
    );
}
