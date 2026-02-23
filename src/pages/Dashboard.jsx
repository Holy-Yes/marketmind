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
    { label: 'Create Content', desc: 'Campaign copy, calendars & hashtag strategy', icon: Sparkles, path: '/dashboard/create-content', model: 'Gemini 1.5 Pro', color: 'var(--blue-bright)', glow: 'rgba(79,158,255,0.12)', time: '<15s' },
    { label: 'Generate Posts', desc: 'Instagram posts & Reel scripts with images', icon: Image, path: '/dashboard/generate-posts', model: 'Gemini + DALL-E 3', color: '#f472b6', glow: 'rgba(244,114,182,0.12)', time: '<60s' },
    { label: 'Build a Pitch', desc: 'Cold emails, sales pitch & proposal docs', icon: Presentation, path: '/dashboard/build-pitch', model: 'Groq Mixtral', color: 'var(--amber)', glow: 'rgba(245,158,11,0.12)', time: '<3s' },
    { label: 'Analyse Competitors', desc: 'Pricing, social, product & gap analysis', icon: BarChart2, path: '/dashboard/analyse-competitors', model: 'Gemini + Live', color: 'var(--cyan)', glow: 'rgba(34,211,238,0.12)', time: '<30s', badge: 'LIVE' },
    { label: 'Score My Leads', desc: 'AI lead scoring with next-best-action guidance', icon: Target, path: '/dashboard/score-leads', model: 'IBM watsonx', color: 'var(--green)', glow: 'rgba(16,185,129,0.12)', time: '<5s' },
    { label: 'Practice a Sale', desc: 'Role-play with AI buyer personas', icon: MessageSquare, path: '/dashboard/practice-sale', model: 'Groq LLaMA 70B', color: 'var(--gold)', glow: 'rgba(245,158,11,0.12)', time: '<500ms' },
    { label: 'View Intelligence', desc: 'Monday brief, forecasts & opportunity alerts', icon: Brain, path: '/dashboard/intelligence', model: 'Gemini Pro', color: '#818cf8', glow: 'rgba(129,140,248,0.12)', time: 'Weekly', badge: 'NEW' },
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
        <div style={{ padding: '16px 18px', borderRadius: 12, background: 'rgba(22,37,64,0.5)', border: '1px solid rgba(47,128,237,0.15)', transition: 'all 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(79,158,255,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(47,128,237,0.15)'; e.currentTarget.style.transform = ''; }}
        >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: '#fff', lineHeight: 1, marginBottom: 4 }}>
                {typeof value === 'number' ? <CountUp end={value} separator="," /> : value}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: changeColor || 'var(--green)' }}>{change}</div>
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
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
            <AppSidebar />
            <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>

                {/* ── Header ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)', display: 'inline-block' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', letterSpacing: '0.1em' }}>ALL SYSTEMS OPERATIONAL</span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(24px,3vw,36px)', color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>
                        {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
                    </h1>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--gray)' }}>
                        Your AI marketing intelligence platform is ready. What do you want to generate today?
                    </p>
                </motion.div>

                {/* ── Outcome Memory Banner ── */}
                {memStatus && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        style={{ marginBottom: 28, borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, position: 'relative', overflow: 'hidden', background: 'rgba(22,37,64,0.6)', border: '1px solid rgba(47,128,237,0.25)' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 85% 50%, rgba(47,128,237,0.12), transparent 60%)' }} />
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#2F80ED,#22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 12px rgba(79,158,255,0.35)' }}>
                            <Zap size={18} color="#fff" fill="#fff" />
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: '#fff', marginBottom: 6 }}>
                                Outcome Memory — {memStatus.status === 'active' ? `${memStatus.rules_active} rules active` : 'Learning mode'}
                            </p>
                            <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
                                <div style={{ height: '100%', width: `${memStatus.progress_to_first_rule || 20}%`, background: 'linear-gradient(90deg,var(--blue),var(--cyan))', borderRadius: 2, transition: 'width 1s ease' }} />
                            </div>
                            {memStatus.status !== 'active' && (
                                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>
                                    Generate {memStatus.next_rule_at || 5} more outputs to activate your first AI rule
                                </p>
                            )}
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
                            <div key={i} className="shimmer" style={{ height: 96, borderRadius: 12, background: 'rgba(22,37,64,0.4)' }} />
                        ))}
                    </div>
                )}

                {/* ── Section label + module pills ── */}
                <div style={{ marginBottom: 20 }}>
                    <div className="drd-section-label">09 — Module Navigation</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: '#fff', letterSpacing: '-0.01em' }}>
                        Seven <span style={{ color: 'var(--blue-bright)' }}>generation modules</span>
                    </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
                    {MODULE_CARDS.map((m, i) => (
                        <motion.div key={m.path}
                            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                        >
                            <Link to={m.path} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 18, padding: '14px 20px', borderRadius: 11, background: 'rgba(22,37,64,0.4)', border: '1px solid rgba(47,128,237,0.14)', transition: 'all 0.22s', color: 'inherit' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.background = m.glow; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(47,128,237,0.14)'; e.currentTarget.style.background = 'rgba(22,37,64,0.4)'; e.currentTarget.style.transform = ''; }}
                            >
                                {/* Icon */}
                                <div style={{ width: 38, height: 38, borderRadius: 10, background: m.glow, border: `1px solid ${m.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <m.icon size={17} style={{ color: m.color }} />
                                </div>

                                {/* Number */}
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.06em', minWidth: 22 }}>0{i + 1}</span>

                                {/* Title + desc */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#fff' }}>{m.label}</div>
                                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>{m.desc}</div>
                                </div>

                                {/* Model tag */}
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.06em', color: m.color, background: m.glow, padding: '3px 8px', borderRadius: 5 }}>{m.model}</span>

                                {/* Badge */}
                                {m.badge && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.06em', color: m.badge === 'NEW' ? 'var(--blue-bright)' : 'var(--amber)', background: m.badge === 'NEW' ? 'rgba(47,128,237,0.15)' : 'rgba(245,158,11,0.15)', padding: '2px 6px', borderRadius: 4 }}>{m.badge}</span>}

                                {/* Speed + arrow */}
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', minWidth: 48, textAlign: 'right' }}>↙ {m.time}</span>
                                <ArrowRight size={13} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* ── Lead Score Rings (DRD slide 08) ── */}
                <div style={{ marginBottom: 12 }}>
                    <div className="drd-section-label">08 — Lead Score Rings</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 16, letterSpacing: '-0.01em' }}>
                        Active <span style={{ color: 'var(--blue-bright)' }}>lead scores</span>
                    </h2>
                </div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    style={{ padding: '20px 24px', borderRadius: 14, background: 'rgba(22,37,64,0.4)', border: '1px solid rgba(47,128,237,0.15)', display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
                    <ScoreRing score={91} label="HOT" color="var(--green)" />
                    <ScoreRing score={50} label="WARM" color="var(--amber)" />
                    <ScoreRing score={30} label="COOL" color="var(--blue-bright)" />
                    <ScoreRing score={10} label="COLD" color="var(--gray)" />
                    <div style={{ flex: 1, paddingLeft: 12 }}>
                        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#fff', marginBottom: 4 }}>Acme Corp — Jamie Chen, VP Sales</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--gray)', lineHeight: 1.6, marginBottom: 12 }}>Visited pricing page 3× this week · Matches profile of your 5 fastest-closing deals</div>
                        <Link to="/dashboard/score-leads" style={{ display: 'inline-block', padding: '8px 14px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--green)', textDecoration: 'none' }}>
                            → Send pricing PDF today
                        </Link>
                    </div>
                </motion.div>

                {/* ── Visual Section: Pipeline & Social ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, marginBottom: 40 }}>
                    {/* Pipeline Funnel */}
                    <div style={{ padding: '24px', borderRadius: 16, background: 'rgba(22,37,64,0.4)', border: '1px solid rgba(47,128,237,0.15)' }}>
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--blue-bright)', marginBottom: 4 }}>REVENUE FUNNEL</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Conversion Pipeline</div>
                        </div>
                        <div style={{ height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <FunnelChart>
                                    <Tooltip
                                        contentStyle={{ background: 'var(--navy)', border: '1px solid rgba(255,255,255,0.1)' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Funnel
                                        dataKey="value"
                                        data={[
                                            { value: 100, name: 'Prospected', fill: 'rgba(47,128,237,0.8)' },
                                            { value: 80, name: 'Qualified', fill: 'rgba(47,128,237,0.6)' },
                                            { value: 50, name: 'Proposal', fill: 'rgba(47,128,237,0.4)' },
                                            { value: 30, name: 'Negotiation', fill: 'rgba(16,185,129,0.8)' },
                                            { value: 15, name: 'Closed', fill: 'rgba(16,185,129,1.0)' },
                                        ]}
                                        isAnimationActive
                                    >
                                        <LabelList position="right" fill="var(--text-dim)" stroke="none" dataKey="name" fontSize={11} fontFamily="var(--font-mono)" />
                                    </Funnel>
                                </FunnelChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Social Growth Sparkline */}
                    <div style={{ padding: '24px', borderRadius: 16, background: 'rgba(22,37,64,0.4)', border: '1px solid rgba(47,128,237,0.15)' }}>
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#f472b6', marginBottom: 4 }}>ENGAGEMENT GROWTH</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Social Footprint</div>
                        </div>
                        <div style={{ height: 160 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { day: 'M', val: 400 }, { day: 'T', val: 600 }, { day: 'W', val: 550 },
                                    { day: 'T', val: 900 }, { day: 'F', val: 1100 }, { day: 'S', val: 950 }, { day: 'S', val: 1200 }
                                ]}>
                                    <Area type="monotone" dataKey="val" stroke="#f472b6" fill="rgba(244,114,182,0.15)" strokeWidth={3} />
                                    <Tooltip hide />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 2 }}>EST. REACH</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>42.8K</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 10, color: 'var(--green)', marginBottom: 2 }}>+12.4%</div>
                                <TrendingUp size={16} color="var(--green)" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Opportunity Alerts ── */}
                {alerts.length > 0 && (
                    <div>
                        <div className="drd-section-label">ALERTS</div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 14, letterSpacing: '-0.01em' }}>
                            🔔 Opportunity Alerts
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {alerts.map(a => (
                                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderRadius: 10, background: 'rgba(22,37,64,0.4)', border: `1px solid ${a.urgency === 'high' ? 'rgba(239,68,68,0.25)' : 'rgba(47,128,237,0.15)'}`, transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,58,95,0.5)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(22,37,64,0.4)'; }}
                                >
                                    {a.urgency === 'high'
                                        ? <AlertCircle size={16} style={{ color: 'var(--red)', flexShrink: 0 }} />
                                        : <TrendingUp size={16} style={{ color: 'var(--amber)', flexShrink: 0 }} />}
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: '#fff', marginBottom: 2 }}>{a.title}</p>
                                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-dim)' }}>→ {a.action}</p>
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.06em', padding: '3px 8px', borderRadius: 4, background: a.urgency === 'high' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: a.urgency === 'high' ? 'var(--red)' : 'var(--amber)' }}>
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
