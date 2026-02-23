import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppSidebar from '../components/AppSidebar';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import {
    Sparkles, Image, Presentation, BarChart2, Target,
    MessageSquare, Brain, ArrowRight, Zap, TrendingUp, AlertCircle, ShoppingCart
} from 'lucide-react';
import {
    AreaChart, Area, BarChart as RBChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, Cell, FunnelChart, Funnel, LabelList
} from 'recharts';
import CountUp from 'react-countup';

const MODULE_CARDS = [
    { label: 'Create Content', desc: 'Campaign copy, calendars & hashtag strategy', icon: Sparkles, path: '/dashboard/create-content', model: 'Gemini 1.5 Pro', color: '#E86A2A', glow: 'rgba(232, 106, 42, 0.08)', time: '<15s' },
    { label: 'Social Prompts', desc: 'Instagram posts & Reel scripts with images', icon: Image, path: '/dashboard/generate-posts', model: 'Visual Brief', color: '#1A1A18', glow: 'rgba(26, 26, 24, 0.05)', time: '<60s' },
    { label: 'Build a Pitch', desc: 'Cold emails, sales pitch & proposal docs', icon: Presentation, path: '/dashboard/build-pitch', model: 'Groq Mixtral', color: '#E86A2A', glow: 'rgba(232, 106, 42, 0.08)', time: '<3s' },
    { label: 'Analyse Competitors', desc: 'Pricing, social, product & gap analysis', icon: BarChart2, path: '/dashboard/analyse-competitors', model: 'Gemini + Live', color: '#1A1A18', glow: 'rgba(26, 26, 24, 0.05)', time: '<30s', badge: 'LIVE' },
    { label: 'Score My Leads', desc: 'AI lead scoring with next-best-action guidance', icon: Target, path: '/dashboard/score-leads', model: 'IBM watsonx', color: '#E86A2A', glow: 'rgba(232, 106, 42, 0.08)', time: '<5s' },
    { label: 'Practice a Sale', desc: 'Role-play with AI buyer personas', icon: MessageSquare, path: '/dashboard/practice-sale', model: 'LLaMA 70B', color: '#1A1A18', glow: 'rgba(26, 26, 24, 0.05)', time: '<500ms' },
    { label: 'View Intelligence', desc: 'Monday brief, forecasts & opportunity alerts', icon: Brain, path: '/dashboard/intelligence', model: 'Gemini Pro', color: '#E86A2A', glow: 'rgba(232, 106, 42, 0.08)', time: 'Weekly', badge: 'NEW' },
];

/* ── Score Ring ── */
function ScoreRing({ score, label, color }) {
    const r = 28, circ = 2 * Math.PI * r;
    const pct = Math.min(Math.max(score, 0), 100) / 100;
    const offset = circ * (1 - pct);
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 68, height: 68 }}>
                <svg width="68" height="68" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="34" cy="34" r={r} fill="none" stroke={`${color}25`} strokeWidth="6" />
                    <circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="6"
                        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s ease' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color }}>
                    {score}
                </div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color, letterSpacing: '0.08em', marginTop: 4 }}>{label}</div>
        </div>
    );
}

/* ── Stat card ── */
function KpiCard({ label, value, change, changeColor }) {
    return (
        <div style={{ padding: '20px', borderRadius: 12, background: '#FFFFFF', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-warm)', transition: 'all 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.transform = ''; }}
        >
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: 'var(--text-primary)', lineHeight: 1, marginBottom: 4 }}>
                {typeof value === 'number' ? <CountUp end={value} separator="," /> : value}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: changeColor || 'var(--success)' }}>{change}</div>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [memStatus, setMemStatus] = useState(null);

    useEffect(() => {
        api.getDashboardStats().then(setStats).catch(() => { });
        api.getOpportunityAlerts().then(r => setAlerts(r.alerts || [])).catch(() => { });
        api.getMemoryStatus().then(setMemStatus).catch(() => { });
    }, []);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
            <AppSidebar />
            <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>

                {/* ── Header ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span className="pulse-dot" />
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em' }}>LIVE INTELLIGENCE FEED</span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
                        {greeting}, {user?.name?.split(' ')[0] || 'there'}
                    </h1>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-secondary)' }}>
                        Everything is calibrated. What should we generate today?
                    </p>
                </motion.div>

                {/* ── Outcome Memory Banner ── */}
                {memStatus && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        style={{ marginBottom: 28, borderRadius: 14, padding: '20px', display: 'flex', alignItems: 'center', gap: 20, position: 'relative', overflow: 'hidden', background: '#FFFFFF', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-warm)' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 85% 50%, #FBF0E8, transparent 60%)' }} />
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: '#E86A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(232, 106, 42, 0.25)' }}>
                            <Zap size={20} color="#fff" fill="#fff" />
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                                    Outcome Memory — {memStatus.status === 'active' ? `${memStatus.rules_active} rules active` : 'Calibrating Context'}
                                </p>
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>{Math.round(memStatus.progress_to_first_rule || 20)}% COMPLETE</span>
                            </div>
                            <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${memStatus.progress_to_first_rule || 20}%`, background: '#E86A2A', borderRadius: 3, transition: 'width 1s ease' }} />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── KPI Stats ── */}
                {stats ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 32 }}>
                        {stats.stats.map((s, i) => (
                            <KpiCard key={i} label={s.label} value={s.value} change={s.change}
                                changeColor={s.positive === true ? 'var(--green)' : s.positive === false ? 'var(--red)' : 'var(--gray)'} />
                        ))}
                    </motion.div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 32 }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="shimmer" style={{ height: 110, borderRadius: 12, background: '#FFFFFF', border: '1px solid var(--border-default)' }} />
                        ))}
                    </div>
                )}

                {/* ── Section label + module pills ── */}
                <div style={{ marginBottom: 24 }}>
                    <div className="drd-section-label" style={{ color: 'var(--text-secondary)' }}>09 — Module Navigation</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                        Strategic <span style={{ color: 'var(--accent)' }}>Intelligence Modules</span>
                    </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
                    {MODULE_CARDS.map((m, i) => (
                        <motion.div key={m.path}
                            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                        >
                            <Link to={m.path} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 18, padding: '16px 24px', borderRadius: 12, background: '#FFFFFF', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-warm)', transition: 'all 0.22s', color: 'inherit' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.transform = 'translateX(6px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.transform = ''; }}
                            >
                                {/* Icon */}
                                <div style={{ width: 42, height: 42, borderRadius: 10, background: m.glow, border: `1px solid ${m.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <m.icon size={18} style={{ color: m.color }} />
                                </div>

                                {/* Title + desc */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{m.label}</div>
                                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{m.desc}</div>
                                </div>

                                {/* Model tag */}
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, color: m.color, background: m.glow, padding: '4px 10px', borderRadius: 20 }}>{m.model}</span>

                                {/* Badge */}
                                {m.badge && <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 800, color: '#FFFFFF', background: m.color, padding: '3px 8px', borderRadius: 4 }}>{m.badge}</span>}

                                {/* Arrow */}
                                <ArrowRight size={14} style={{ color: 'var(--border-default)', marginLeft: 12 }} />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* ── Lead Score Rings (DRD slide 08) ── */}
                <div style={{ marginBottom: 16 }}>
                    <div className="drd-section-label" style={{ color: 'var(--text-secondary)' }}>08 — Lead Score Rings</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', marginBottom: 16, letterSpacing: '-0.01em' }}>
                        Predictive <span style={{ color: 'var(--accent)' }}>Lead Calibration</span>
                    </h2>
                </div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    style={{ padding: '24px', borderRadius: 14, background: '#FFFFFF', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-warm)', display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
                    <ScoreRing score={91} label="HOT" color="var(--success)" />
                    <ScoreRing score={50} label="WARM" color="var(--warning)" />
                    <ScoreRing score={30} label="COOL" color="var(--accent)" />
                    <ScoreRing score={10} label="COLD" color="var(--text-secondary)" />
                    <div style={{ flex: 1, paddingLeft: 12 }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 4 }}>Acme Corp — Jamie Chen, VP Sales</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>Visited pricing page 3× this week · Matches profile of your 5 fastest-closing deals</div>
                        <Link to="/dashboard/score-leads" style={{ display: 'inline-block', padding: '8px 16px', background: 'var(--success-bg)', border: '1px solid var(--success)', borderRadius: 8, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, color: 'var(--success)', textDecoration: 'none' }}>
                            → Send pricing PDF today
                        </Link>
                    </div>
                </motion.div>

                {/* ── Visual Section: Pipeline & Social ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, marginBottom: 40 }}>
                    {/* Pipeline Funnel */}
                    <div style={{ padding: '24px', borderRadius: 16, background: '#FFFFFF', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-warm)' }}>
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 10, color: 'var(--accent)', marginBottom: 4 }}>REVENUE FUNNEL</div>
                            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Conversion Pipeline</div>
                        </div>
                        <div style={{ height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <FunnelChart>
                                    <Tooltip
                                        contentStyle={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 8 }}
                                        itemStyle={{ color: 'var(--text-primary)' }}
                                    />
                                    <Funnel
                                        dataKey="value"
                                        data={[
                                            { value: 100, name: 'Prospected', fill: '#E86A2A' },
                                            { value: 80, name: 'Qualified', fill: '#333333' },
                                            { value: 50, name: 'Proposal', fill: '#D9CEBA' },
                                            { value: 30, name: 'Negotiation', fill: '#EDE6DA' },
                                            { value: 15, name: 'Closed', fill: '#2A7A50' },
                                        ]}
                                        isAnimationActive
                                    >
                                        <LabelList position="right" fill="var(--text-secondary)" stroke="none" dataKey="name" fontSize={11} fontFamily="var(--font-body)" fontWeight={600} />
                                    </Funnel>
                                </FunnelChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Social Growth Sparkline */}
                    <div style={{ padding: '24px', borderRadius: 16, background: '#FFFFFF', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-warm)' }}>
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 10, color: 'var(--accent)', marginBottom: 4 }}>ENGAGEMENT GROWTH</div>
                            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Social Footprint</div>
                        </div>
                        <div style={{ height: 160 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { day: 'M', val: 400 }, { day: 'T', val: 600 }, { day: 'W', val: 550 },
                                    { day: 'T', val: 900 }, { day: 'F', val: 1100 }, { day: 'S', val: 950 }, { day: 'S', val: 1200 }
                                ]}>
                                    <Area type="monotone" dataKey="val" stroke="#E86A2A" fill="#FBF0E8" strokeWidth={3} />
                                    <Tooltip hide />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 2 }}>EST. REACH</div>
                                <div style={{ fontSize: 24, fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>42.8K</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', marginBottom: 2 }}>+12.4%</div>
                                <TrendingUp size={20} color="var(--success)" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Opportunity Alerts ── */}
                {alerts.length > 0 && (
                    <div style={{ marginBottom: 60 }}>
                        <div className="drd-section-label" style={{ color: 'var(--text-secondary)' }}>04 — PERSISTENT ALERTS</div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', marginBottom: 16, letterSpacing: '-0.01em' }}>
                            🔔 Opportunity Monitoring
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {alerts.map(a => (
                                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 12, background: '#FFFFFF', border: `1px solid ${a.urgency === 'high' ? 'var(--error)' : 'var(--border-default)'}`, boxShadow: 'var(--shadow-warm)', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
                                >
                                    {a.urgency === 'high'
                                        ? <AlertCircle size={18} style={{ color: 'var(--error)', flexShrink: 0 }} />
                                        : <TrendingUp size={18} style={{ color: 'var(--warning)', flexShrink: 0 }} />}
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 2 }}>{a.title}</p>
                                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)' }}>→ {a.action}</p>
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', padding: '4px 10px', borderRadius: 20, background: a.urgency === 'high' ? 'var(--error-bg)' : 'var(--warning-bg)', color: a.urgency === 'high' ? 'var(--error)' : 'var(--warning)' }}>
                                        {a.urgency.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
