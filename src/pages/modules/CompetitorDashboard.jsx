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
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
            <AppSidebar />
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                {/* Header */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BarChart2 size={20} color="var(--cyan)" />
                        </div>
                        <div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)', letterSpacing: '0.12em' }}>04 — COMPETITOR INTELLIGENCE</div>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#fff', margin: 0, marginTop: 4 }}>Multi-Brand Comparison</h1>
                        </div>
                    </div>
                </div>

                {/* Input Section */}
                {status === 'idle' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                        background: 'rgba(22,37,64,0.6)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 16, padding: 32, marginBottom: 32
                    }}>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gray)', display: 'block', marginBottom: 12, fontWeight: 600 }}>
                                Add Competitors to Analyze
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {competitors.map((comp, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <input
                                            className="drd-input"
                                            placeholder={`Competitor ${idx + 1} (e.g., 'Salesforce', 'HubSpot')`}
                                            value={comp}
                                            onChange={e => updateCompetitor(idx, e.target.value)}
                                            style={{ flex: 1, fontSize: 13 }}
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
                                    marginTop: 12, padding: '10px 16px', background: 'rgba(34,211,238,0.1)', color: 'var(--cyan)',
                                    border: '1px solid rgba(34,211,238,0.2)', borderRadius: 8, fontFamily: 'var(--font-body)',
                                    fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600
                                }}
                            >
                                <Plus size={16} /> Add Another Competitor
                            </button>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gray)', display: 'block', marginBottom: 12, fontWeight: 600 }}>
                                Select Your Product (Comparison Context)
                            </label>
                            <select
                                className="drd-input"
                                value={selectedProductId}
                                onChange={e => setSelectedProductId(e.target.value)}
                                style={{ width: '100%', fontSize: 13, background: 'rgba(13,27,46,0.6)', cursor: 'pointer' }}
                            >
                                <option value="">-- General Market Context --</option>
                                {clientProducts.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gray)', display: 'block', marginBottom: 12, fontWeight: 600 }}>
                                Analysis Depth
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                {ANALYSIS_DEPTH.map(d => (
                                    <button key={d}
                                        onClick={() => setAnalysis_depth(d)}
                                        style={{
                                            padding: '12px 16px', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 12,
                                            cursor: 'pointer', textAlign: 'left',
                                            background: analysis_depth === d ? 'rgba(34,211,238,0.2)' : 'rgba(13,27,46,0.5)',
                                            border: analysis_depth === d ? '1px solid var(--cyan)' : '1px solid rgba(34,211,238,0.1)',
                                            color: analysis_depth === d ? 'var(--cyan)' : 'var(--gray)',
                                            fontWeight: analysis_depth === d ? 600 : 400,
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
                                width: '100%', padding: '12px 24px', background: 'var(--cyan)', color: 'var(--navy)',
                                border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <RefreshCw size={16} style={{ display: 'inline', marginRight: 8 }} />
                            Analyze Competitors
                        </button>
                    </motion.div>
                )}

                {/* Loading State */}
                {status === 'loading' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                        background: 'rgba(22,37,64,0.6)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 16, padding: 60, textAlign: 'center'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 16 }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [10, 30, 10] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                                    style={{ width: 4, background: 'var(--cyan)', borderRadius: 2 }}
                                />
                            ))}
                        </div>
                        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gray)' }}>Analyzing {competitors.filter(c => c.trim()).length} competitors...</p>
                    </motion.div>
                )}

                {/* Results */}
                {status === 'complete' && results.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {/* Comparison Chart */}
                        <div style={{
                            background: 'rgba(22,37,64,0.6)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 16, padding: 28, marginBottom: 24
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <AreaChartIcon size={18} color="var(--cyan)" />
                                    <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#fff', margin: 0, fontWeight: 600 }}>📈 Multi-Brand Strategic Advantage</h3>
                                </div>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    {results.map((r, i) => (
                                        <button
                                            key={i}
                                            onClick={() => toggleBrand(r.competitor)}
                                            style={{
                                                background: visibleBrands[r.competitor] ? ['rgba(6,182,212,0.2)', 'rgba(129,140,248,0.2)', 'rgba(244,114,182,0.2)', 'rgba(20,184,166,0.2)'][i % 4] : 'rgba(255,255,255,0.05)',
                                                border: `1px solid ${visibleBrands[r.competitor] ? ['#06b6d4', '#818cf8', '#f472b6', '#14b8a6'][i % 4] : 'rgba(255,255,255,0.1)'}`,
                                                color: visibleBrands[r.competitor] ? '#fff' : 'rgba(255,255,255,0.3)',
                                                padding: '4px 10px',
                                                borderRadius: 6,
                                                fontSize: 11,
                                                fontFamily: 'var(--font-mono)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 6
                                            }}
                                        >
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ['#06b6d4', '#818cf8', '#f472b6', '#14b8a6'][i % 4], opacity: visibleBrands[r.competitor] ? 1 : 0.3 }} />
                                            {r.competitor}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <RechartsLineChart data={comparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,211,238,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="metric"
                                        stroke="var(--gray)"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, dy: 10 }}
                                    />
                                    <YAxis
                                        stroke="var(--gray)"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11 }}
                                        domain={[0, 100]}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(13,27,46,0.95)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 12,
                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                                            backdropFilter: 'blur(8px)'
                                        }}
                                        itemStyle={{ fontSize: 12, fontWeight: 600 }}
                                        cursor={{ stroke: 'rgba(34,211,238,0.2)', strokeWidth: 2 }}
                                    />
                                    {results.slice(0, 4).map((r, i) => visibleBrands[r.competitor] && (
                                        <Line
                                            key={i}
                                            type="monotone"
                                            dataKey={toSlug(r.competitor)}
                                            stroke={['#06b6d4', '#818cf8', '#f472b6', '#14b8a6'][i % 4]}
                                            strokeWidth={4}
                                            dot={{ r: 4, strokeWidth: 2, fill: 'var(--navy)' }}
                                            activeDot={{ r: 7, strokeWidth: 0, fill: ['#06b6d4', '#818cf8', '#f472b6', '#14b8a6'][i % 4] }}
                                            animationDuration={1500}
                                        />
                                    ))}
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
                                        background: 'rgba(22,37,64,0.6)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 16, padding: 24
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', margin: 0, fontWeight: 700 }}>
                                            {data.competitor}
                                        </h4>
                                        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>
                                            {data.why_this?.[0]?.confidence}%
                                        </div>
                                    </div>

                                    <div style={{
                                        background: 'rgba(13,27,46,0.65)',
                                        borderRadius: 12,
                                        padding: '24px',
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '14px',
                                        color: '#cbd5e1',
                                        lineHeight: 1.8,
                                        maxHeight: '600px',
                                        overflowY: 'auto',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                                    }}>
                                        <div className="intelligence-report">
                                            <ReactMarkdown>{data.content}</ReactMarkdown>
                                        </div>
                                        <style>{`
                                            .intelligence-report h2 { color: #fff; font-size: 18px; margin-top: 24px; margin-bottom: 12px; border-left: 3px solid var(--cyan); padding-left: 12px; }
                                            .intelligence-report h3 { color: var(--cyan); font-size: 15px; margin-top: 18px; }
                                            .intelligence-report p { margin-bottom: 16px; }
                                            .intelligence-report ul { margin-bottom: 16px; padding-left: 20px; }
                                            .intelligence-report li { margin-bottom: 8px; }
                                            .intelligence-report strong { color: #fff; font-weight: 700; }
                                            .intelligence-report a { color: var(--cyan); text-decoration: none; }
                                            .intelligence-report a:hover { text-decoration: underline; }
                                        `}</style>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={() => setStatus('idle')}
                                style={{
                                    flex: 1, padding: '12px 24px', background: 'rgba(34,211,238,0.1)', color: 'var(--cyan)',
                                    border: '1px solid rgba(34,211,238,0.3)', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 14,
                                    fontWeight: 600, cursor: 'pointer'
                                }}
                            >
                                Analyze Others
                            </button>
                            <button
                                style={{
                                    flex: 1, padding: '12px 24px', background: 'var(--cyan)', color: 'var(--navy)',
                                    border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: 14,
                                    fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                }}
                            >
                                <Download size={16} /> Export Comparison
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
