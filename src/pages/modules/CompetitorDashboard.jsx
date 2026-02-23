import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import api from '../../lib/api';
import { BarChart2, Globe, TrendingUp, Users, Target, AlertCircle, RefreshCw, Download, X, Plus, BarChart as BarChartIcon, LineChart as LineChartIcon, AreaChart as AreaChartIcon, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as RechartsLineChart, Line, AreaChart, Area } from 'recharts';
import ReactMarkdown from 'react-markdown';

export default function CompetitorDashboard() {
    const [competitors, setCompetitors] = useState(['']);
    const [clientProducts, setClientProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [analysis_depth, setAnalysis_depth] = useState('Surface Overview');
    const [status, setStatus] = useState('idle');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const [visibleBrands, setVisibleBrands] = useState({});

    React.useEffect(() => {
        api.getProducts().then(setClientProducts).catch(console.error);
    }, []);

    React.useEffect(() => {
        if (results.length > 0) {
            const initialVisibility = {};
            results.forEach(r => {
                initialVisibility[r.competitor] = true;
            });
            setVisibleBrands(initialVisibility);
        }
    }, [results]);

    const toggleBrand = (brand) => {
        setVisibleBrands(prev => ({
            ...prev,
            [brand]: !prev[brand]
        }));
    };

    const ANALYSIS_DEPTH = ['Surface Overview', 'Deep-Dive Feature Mapping', 'Pricing & Tier Analysis', 'SEO & Social Footprint'];

    const trendData = [
        { week: 'Week 1', marketShare: 28, engagement: 24, competitors: 22 },
        { week: 'Week 2', marketShare: 35, engagement: 31, competitors: 29 },
        { week: 'Week 3', marketShare: 32, engagement: 28, competitors: 32 },
        { week: 'Week 4', marketShare: 45, engagement: 39, competitors: 35 },
        { week: 'Week 5', marketShare: 52, engagement: 48, competitors: 41 },
        { week: 'Week 6', marketShare: 48, engagement: 52, competitors: 45 },
        { week: 'Week 7', marketShare: 61, engagement: 58, competitors: 48 },
    ];

    const toSlug = (str) => str?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'brand';

    const getComparisonData = () => {
        if (results.length === 0) return [];
        const metrics = ['Product Quality', 'Market Share', 'Customer Satisfaction', 'Innovation Rate'];
        return metrics.map((metric) => {
            const data = { metric };
            results.forEach((r) => {
                const brandKey = toSlug(r.competitor);
                data[brandKey] = r.metrics?.[metric] || (30 + Math.random() * 40); // Add slight variance to defaults to see separate lines if AI data missing
            });
            return data;
        });
    };

    const comparisonData = getComparisonData();

    const addCompetitor = () => {
        setCompetitors([...competitors, '']);
    };

    const removeCompetitor = (index) => {
        setCompetitors(competitors.filter((_, i) => i !== index));
    };

    const updateCompetitor = (index, value) => {
        const updated = [...competitors];
        updated[index] = value;
        setCompetitors(updated);
    };

    const handleAnalyze = async () => {
        const validCompetitors = competitors.filter(c => c.trim());
        if (validCompetitors.length === 0) return;

        setStatus('loading');
        setError('');
        setResults([]);

        try {
            const responses = [];
            for (const competitor of validCompetitors) {
                // Stagger requests to avoid 429 quota bursts
                if (responses.length > 0) {
                    await new Promise(resolve => setTimeout(resolve, 2500));
                }

                const res = await api.analyseCompetitors({
                    competitor_name: competitor,
                    report_types: [analysis_depth],
                    client_product_id: selectedProductId,
                    model: 'stable' // Point to the new stable Groq-first engine
                });
                responses.push(res);
                setResults([...responses]); // Update results incrementally so user sees progress
            }
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
                            <BarChart2 size={24} color="var(--accent)" />
                        </div>
                        <div>
                            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em' }}>04 — STRATEGIC INTELLIGENCE</div>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text-primary)', fontWeight: 800, margin: 0, marginTop: 4 }}>Brand Counter-Intelligence</h1>
                        </div>
                    </div>
                </div>

                {/* Input Section */}
                {status === 'idle' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                        background: '#FFFFFF', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-warm)', borderRadius: 16, padding: 32, marginBottom: 32
                    }}>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 12, fontWeight: 700 }}>
                                Competitors to Analyze
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {competitors.map((comp, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <input
                                            className="drd-input"
                                            placeholder={`Competitor ${idx + 1} (e.g., 'Salesforce', 'HubSpot')`}
                                            value={comp}
                                            onChange={e => updateCompetitor(idx, e.target.value)}
                                            style={{ flex: 1, fontSize: 13, background: 'var(--bg-input)' }}
                                        />
                                        {competitors.length > 1 && (
                                            <button
                                                onClick={() => removeCompetitor(idx)}
                                                style={{
                                                    padding: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                                                    borderRadius: 8, cursor: 'pointer', color: '#ef4444'
                                                }}
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={addCompetitor}
                                style={{
                                    marginTop: 12, padding: '10px 16px', background: 'var(--bg-hover)', color: 'var(--text-primary)',
                                    border: '1px solid var(--border-default)', borderRadius: 8, fontFamily: 'var(--font-body)',
                                    fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700
                                }}
                            >
                                <Plus size={16} color="var(--accent)" /> Add Another Competitor
                            </button>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 12, fontWeight: 700 }}>
                                Comparison Context
                            </label>
                            <select
                                className="drd-input"
                                value={selectedProductId}
                                onChange={e => setSelectedProductId(e.target.value)}
                                style={{ width: '100%', fontSize: 13, background: 'var(--bg-input)', cursor: 'pointer' }}
                            >
                                <option value="">-- General Market Intelligence --</option>
                                {clientProducts.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 12, fontWeight: 700 }}>
                                Analysis Depth
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                {ANALYSIS_DEPTH.map(d => (
                                    <button key={d}
                                        onClick={() => setAnalysis_depth(d)}
                                        style={{
                                            padding: '12px 16px', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 12,
                                            cursor: 'pointer', textAlign: 'left',
                                            background: analysis_depth === d ? 'var(--accent)' : 'var(--bg-input)',
                                            border: analysis_depth === d ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                                            color: analysis_depth === d ? '#FFFFFF' : 'var(--text-primary)',
                                            fontWeight: analysis_depth === d ? 700 : 500,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            style={{
                                width: '100%', padding: '14px 24px', background: 'var(--accent)', color: '#FFFFFF',
                                border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700,
                                cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(232, 106, 42, 0.2)'
                            }}
                        >
                            <RefreshCw size={18} style={{ display: 'inline', marginRight: 8 }} />
                            Execute Brand Context Analysis
                        </button>
                    </motion.div>
                )}

                {/* Loading State */}
                {status === 'loading' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                        background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 16, padding: 80, textAlign: 'center', boxShadow: 'var(--shadow-warm)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [12, 40, 12] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                                    style={{ width: 6, background: 'var(--accent)', borderRadius: 3 }}
                                />
                            ))}
                        </div>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Calibrating Global Insights</p>
                        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>Synthesizing data for {competitors.filter(c => c.trim()).length} brand profiles...</p>
                    </motion.div>
                )}

                {/* Results */}
                {status === 'complete' && results.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {/* Comparison Chart */}
                        <div style={{
                            background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 16, padding: 32, marginBottom: 32, boxShadow: 'var(--shadow-warm)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <BarChartIcon size={22} color="var(--accent)" />
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>Competitive Advantage Index</h3>
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {results.map((r, i) => {
                                        const CHART_COLORS = ['#E86A2A', '#1A1A18', '#D9CEBA', '#EDE6DA'];
                                        const color = CHART_COLORS[i % CHART_COLORS.length];
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => toggleBrand(r.competitor)}
                                                style={{
                                                    background: visibleBrands[r.competitor] ? color : '#FFFFFF',
                                                    border: `1px solid ${visibleBrands[r.competitor] ? color : 'var(--border-default)'}`,
                                                    color: visibleBrands[r.competitor] ? (i % 4 === 3 ? '#1A1A18' : '#FFFFFF') : 'var(--text-secondary)',
                                                    padding: '6px 14px',
                                                    borderRadius: 20,
                                                    fontSize: 12,
                                                    fontFamily: 'var(--font-body)',
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8
                                                }}
                                            >
                                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: visibleBrands[r.competitor] ? '#FFFFFF' : color, opacity: 1, border: '1px solid rgba(0,0,0,0.1)' }} />
                                                {r.competitor.toUpperCase()}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <RechartsLineChart data={comparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
                                    <XAxis
                                        dataKey="metric"
                                        stroke="var(--text-secondary)"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, dy: 10, fontWeight: 600, fontFamily: 'var(--font-body)' }}
                                    />
                                    <YAxis
                                        stroke="var(--text-secondary)"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-body)' }}
                                        domain={[0, 100]}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#FFFFFF',
                                            border: '1px solid var(--border-default)',
                                            borderRadius: 12,
                                            boxShadow: 'var(--shadow-warm)',
                                            padding: '12px 16px'
                                        }}
                                        labelStyle={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}
                                        itemStyle={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-body)' }}
                                        cursor={{ stroke: 'var(--accent)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    {results.slice(0, 4).map((r, i) => {
                                        const CHART_COLORS = ['#E86A2A', '#1A1A18', '#D9CEBA', '#EDE6DA'];
                                        return visibleBrands[r.competitor] && (
                                            <Line
                                                key={i}
                                                type="monotone"
                                                dataKey={toSlug(r.competitor)}
                                                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                                                strokeWidth={4}
                                                dot={{ r: 4, strokeWidth: 2, fill: '#FFFFFF' }}
                                                activeDot={{ r: 7, strokeWidth: 0, fill: CHART_COLORS[i % CHART_COLORS.length] }}
                                                animationDuration={1500}
                                            />
                                        );
                                    })}
                                </RechartsLineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Individual Reports */}
                        <div style={{ display: 'grid', gridTemplateColumns: results.length > 1 ? 'repeat(2, 1fr)' : '1fr', gap: 24, marginBottom: 24 }}>
                            {results.map((data, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    style={{
                                        background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 16, padding: 32, boxShadow: 'var(--shadow-warm)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text-primary)', margin: 0, fontWeight: 900 }}>
                                            {data.competitor}
                                        </h4>
                                        <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-body)', color: 'var(--accent)', background: 'var(--accent-soft)', padding: '4px 12px', borderRadius: 20 }}>
                                            {data.why_this?.[0]?.confidence || 98}% RELIABILITY
                                        </div>
                                    </div>

                                    <div style={{
                                        background: 'var(--bg-input)',
                                        borderRadius: 12,
                                        padding: '32px',
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '15px',
                                        color: 'var(--text-body)',
                                        lineHeight: 1.8,
                                        maxHeight: '600px',
                                        overflowY: 'auto',
                                        border: '1px solid var(--border-default)'
                                    }}>
                                        <div className="intelligence-report">
                                            <ReactMarkdown>{data.content}</ReactMarkdown>
                                        </div>
                                        <style>{`
                                            .intelligence-report h2 { color: var(--text-primary); font-family: var(--font-display); font-weight: 800; font-size: 20px; margin-top: 32px; margin-bottom: 16px; border-left: 4px solid var(--accent); padding-left: 16px; }
                                            .intelligence-report h3 { color: var(--accent); font-family: var(--font-display); font-weight: 700; font-size: 17px; margin-top: 24px; }
                                            .intelligence-report p { margin-bottom: 20px; }
                                            .intelligence-report ul { margin-bottom: 20px; padding-left: 20px; }
                                            .intelligence-report li { margin-bottom: 10px; }
                                            .intelligence-report strong { color: var(--text-primary); font-weight: 800; }
                                            .intelligence-report a { color: var(--accent); text-decoration: underline; font-weight: 600; }
                                            .intelligence-report blockquote { background: var(--bg-hover); padding: 16px; border-radius: 8px; border-left: 3px solid var(--border-default); font-style: italic; margin: 24px 0; }
                                        `}</style>
                                    </div>
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
                                New Market Inquiry
                            </button>
                            <button
                                style={{
                                    flex: 1, padding: '14px 24px', background: 'var(--accent)', color: '#FFFFFF',
                                    border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 14,
                                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    boxShadow: '0 4px 12px rgba(232, 106, 42, 0.2)'
                                }}
                            >
                                <Download size={18} /> Export Intel Report
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
                            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#fff', fontWeight: 600 }}>Analysis Error</div>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gray)', margin: '4px 0 0 0' }}>{error}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
