import React, { useState, useEffect } from 'react';
import AppSidebar from '../../components/AppSidebar';
import api from '../../lib/api';
import { Brain, TrendingUp, BarChart3, PieChart, AlertCircle, RefreshCw, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import ReactMarkdown from 'react-markdown';

const chartData = [
    { day: 'Mon', revenue: 4000, leads: 240, conversion: 2.4 },
    { day: 'Tue', revenue: 3000, leads: 221, conversion: 2.2 },
    { day: 'Wed', revenue: 2000, leads: 229, conversion: 2.1 },
    { day: 'Thu', revenue: 2780, leads: 200, conversion: 2.5 },
    { day: 'Fri', revenue: 1890, leads: 229, conversion: 2.3 },
    { day: 'Sat', revenue: 2390, leads: 200, conversion: 3.1 },
    { day: 'Sun', revenue: 3490, leads: 321, conversion: 3.8 },
];

export default function IntelligenceDashboard() {
    const [form, setForm] = useState({ report_type: 'Weekly Brief', focus_area: '' });
    const [status, setStatus] = useState('idle'); // idle | loading | complete
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [metrics, setMetrics] = useState(null);

    const REPORT_TYPES = ['Weekly Brief', 'Monthly Performance Digest', 'Growth Forecast', 'Opportunity Alert Summary'];

    // Mock metrics generation
    useEffect(() => {
        if (status === 'complete') {
            setMetrics({
                revenue: { value: 125000, change: 12.5 },
                conversion: { value: 3.8, change: 0.4 },
                leads: { value: 542, change: 28 },
                engagement: { value: 72, change: 5 }
            });
        }
    }, [status]);

    const handleGenerate = async () => {
        setStatus('loading');
        setError('');

        try {
            const response = await api.getWeeklyBrief({
                report_type: form.report_type,
                focus_area: form.focus_area,
                period: 'this_week',
                model: 'gemini-1.5-pro'
            });

            setData(response);
            setStatus('complete');
        } catch (err) {
            setError(err.message);
            setStatus('idle');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
            <AppSidebar />
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                {/* Header */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-soft)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Brain size={24} color="var(--accent)" />
                        </div>
                        <div>
                            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em' }}>07 — STRATEGIC INTELLIGENCE</div>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-primary)', fontWeight: 800, margin: 0, marginTop: 4 }}>Executive Intelligence Brief</h1>
                        </div>
                    </div>
                </div>

                {/* Input Section */}
                {status === 'idle' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                        background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 16, padding: 32, marginBottom: 32, boxShadow: 'var(--shadow-warm)'
                    }}>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 12, fontWeight: 700 }}>
                                Intelligence Vector
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                {REPORT_TYPES.map(r => (
                                    <button key={r}
                                        onClick={() => setForm({ ...form, report_type: r })}
                                        style={{
                                            padding: '12px 16px', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 12,
                                            cursor: 'pointer', textAlign: 'left',
                                            background: form.report_type === r ? 'var(--accent)' : 'var(--bg-input)',
                                            border: form.report_type === r ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                                            color: form.report_type === r ? '#FFFFFF' : 'var(--text-primary)',
                                            fontWeight: form.report_type === r ? 700 : 500,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gray)', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                                Focus Area (Optional)
                            </label>
                            <textarea
                                className="drd-input"
                                placeholder="e.g. 'Concentrate on customer retention metrics for this month'..."
                                value={form.focus_area}
                                onChange={e => setForm({ ...form, focus_area: e.target.value })}
                                style={{ minHeight: 100, fontSize: 13 }}
                            />
                        </div>

                        <button
                            onClick={handleGenerate}
                            style={{
                                width: '100%', padding: '14px 24px', background: 'var(--accent)', color: '#FFFFFF',
                                border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700,
                                cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(232, 106, 42, 0.2)'
                            }}
                        >
                            <RefreshCw size={18} style={{ display: 'inline', marginRight: 8 }} />
                            Synthesize Global Logic
                        </button>
                    </motion.div>
                )}

                {/* Loading State */}
                {status === 'loading' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                        background: 'rgba(22,37,64,0.6)', border: '1px solid rgba(129,140,248,0.15)', borderRadius: 16, padding: 60, textAlign: 'center'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 16 }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [10, 30, 10] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                                    style={{ width: 4, background: '#818cf8', borderRadius: 2 }}
                                />
                            ))}
                        </div>
                        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gray)' }}>Generating {form.report_type}...</p>
                    </motion.div>
                )}

                {/* Results */}
                {status === 'complete' && data && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {/* Key Metrics */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                            {metrics && [
                                { label: 'GROSS REVENUE', icon: TrendingUp, color: '#E86A2A', value: metrics.revenue.value, change: metrics.revenue.change, format: '₹' },
                                { label: 'CONVERSION Δ', icon: BarChart3, color: '#1A1A18', value: metrics.conversion.value, change: metrics.conversion.change, format: '%' },
                                { label: 'TOTAL LEADS', icon: PieChart, color: '#D9CEBA', value: metrics.leads.value, change: metrics.leads.change, format: '' },
                                { label: 'USER VELOCITY', icon: TrendingUp, color: '#EDE6DA', value: metrics.engagement.value, change: metrics.engagement.change, format: '%' }
                            ].map((m, i) => {
                                const Icon = m.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        style={{
                                            background: '#FFFFFF', border: '1px solid var(--border-default)',
                                            borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-warm)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                                            <div>
                                                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 10, color: m.color === '#1A1A18' ? 'var(--text-secondary)' : m.color === '#EDE6DA' ? 'var(--text-secondary)' : m.color, marginBottom: 6, letterSpacing: '0.05em' }}>{m.label}</div>
                                                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-primary)', fontWeight: 800 }}>
                                                    {m.format === '₹' && '₹'}
                                                    <CountUp end={m.value} duration={2} />
                                                    {m.format === '%' && '%'}
                                                </div>
                                            </div>
                                            <div style={{ width: 36, height: 36, borderRadius: 8, background: m.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Icon size={20} color={m.color} />
                                            </div>
                                        </div>
                                        <div style={{
                                            fontFamily: 'var(--font-mono)', fontSize: 12,
                                            color: m.change >= 0 ? '#10b981' : '#ef4444'
                                        }}>
                                            {m.change >= 0 ? '↑' : '↓'} {Math.abs(m.change).toFixed(1)}% this week
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Performance Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 16, padding: 32, marginBottom: 32, boxShadow: 'var(--shadow-warm)'
                            }}
                        >
                            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#fff', margin: '0 0 20px 0', fontWeight: 600 }}>📈 Weekly Performance Trend</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
                                    <XAxis dataKey="day" stroke="var(--text-secondary)" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 12, boxShadow: 'var(--shadow-warm)' }}
                                        labelStyle={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* Intelligence Report */}
                        <div style={{
                            background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 16, padding: 32, marginBottom: 32, boxShadow: 'var(--shadow-warm)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                <Brain size={18} color="#818cf8" />
                                <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#fff', margin: 0, fontWeight: 600 }}>{form.report_type}</h3>
                            </div>

                            <div style={{
                                background: 'var(--bg-input)',
                                borderRadius: 12,
                                padding: '32px',
                                fontFamily: 'var(--font-body)',
                                fontSize: '15px',
                                color: 'var(--text-body)',
                                lineHeight: 1.9,
                                maxHeight: '600px',
                                overflowY: 'auto',
                                border: '1px solid var(--border-default)'
                            }}>
                                <div className="intelligence-brief">
                                    <ReactMarkdown>{data.content}</ReactMarkdown>
                                </div>
                                <style>{`
                                    .intelligence-brief h2 { color: var(--text-primary); font-family: var(--font-display); font-weight: 800; font-size: 20px; margin-top: 32px; margin-bottom: 16px; border-left: 4px solid var(--accent); padding-left: 16px; }
                                    .intelligence-brief h3 { color: var(--accent); font-family: var(--font-display); font-weight: 700; font-size: 17px; margin-top: 24px; }
                                    .intelligence-brief p { margin-bottom: 20px; }
                                    .intelligence-brief ul { margin-bottom: 20px; padding-left: 20px; }
                                    .intelligence-brief li { margin-bottom: 10px; position: relative; list-style-type: none; }
                                    .intelligence-brief li::before { content: '→'; position: absolute; left: -22px; color: var(--accent); font-weight: 800; }
                                    .intelligence-brief strong { color: var(--text-primary); font-weight: 800; }
                                    .intelligence-brief blockquote { background: var(--bg-hover); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent); font-style: italic; color: var(--text-primary); margin: 24px 0; }
                                `}</style>
                            </div>
                        </div>

                        {/* Insights */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                            {[
                                { title: '🎯 Top Priority', text: 'Focus on increasing conversion rate through A/B testing' },
                                { title: '📈 Growth Opportunity', text: 'Marketing automation can boost lead generation by 35%' },
                                { title: '⚡ Quick Win', text: 'Implement email retargeting campaign this week' }
                            ].map((insight, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    style={{
                                        background: 'rgba(22,37,64,0.6)', border: '1px solid rgba(129,140,248,0.1)',
                                        borderRadius: 12, padding: 16
                                    }}
                                >
                                    <h4 style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#818cf8', margin: '0 0 8px 0', fontWeight: 600 }}>
                                        {insight.title}
                                    </h4>
                                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
                                        {insight.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 16 }}>
                            <button
                                onClick={() => setStatus('idle')}
                                style={{
                                    flex: 1, padding: '14px 24px', background: '#FFFFFF', color: 'var(--text-primary)',
                                    border: '1px solid var(--border-default)', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 14,
                                    fontWeight: 700, cursor: 'pointer', boxShadow: 'var(--shadow-warm)'
                                }}
                            >
                                New Intelligence Query
                            </button>
                            <button
                                style={{
                                    flex: 1, padding: '14px 24px', background: 'var(--accent)', color: '#FFFFFF',
                                    border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 14,
                                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    boxShadow: '0 4px 12px rgba(232, 106, 42, 0.2)'
                                }}
                            >
                                <Download size={18} /> Export Executive Summary
                            </button>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <div style={{
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: 20, display: 'flex', gap: 12
                    }}>
                        <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
                        <div>
                            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#fff', fontWeight: 600 }}>Generation Error</div>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gray)', margin: '4px 0 0 0' }}>{error}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
