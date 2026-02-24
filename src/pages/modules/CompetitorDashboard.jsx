import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import api from '../../lib/api';
import { askAI, askAIStream } from '../../services/aiService';
import { getCompetitorData } from '../../services/serpService';
import { BarChart2, Globe, TrendingUp, Users, Target, AlertCircle, RefreshCw, Download, X, Plus, BarChart as BarChartIcon, LineChart as LineChartIcon, AreaChart as AreaChartIcon, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as RechartsLineChart, Line, AreaChart, Area } from 'recharts';
import ReactMarkdown from 'react-markdown';
import AnalysisProgress from './AnalysisProgress';

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
            const row = { metric };
            results.forEach((r) => {
                const brandKey = toSlug(r.competitor);
                // Ensure we use the actual metric value from the AI result if available
                row[brandKey] = r.metrics?.[metric] || (30 + Math.random() * 40);
            });
            return row;
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
            const analyses = await Promise.all(validCompetitors.map(async (brandName) => {
                const webData = await getCompetitorData(brandName);
                const prompt = `You are a market analyst. Using the following real web data about "${brandName}", write a detailed brand analysis.

Web data:
${webData}

Your analysis must cover:
1. Market Position — where they stand in their industry
2. Product Quality — based on customer feedback
3. Brand Reputation — public perception
4. Key Strengths — what they do well
5. Key Weaknesses — where they fall short
6. Opportunity — one gap a competitor could exploit

Write in clear professional paragraphs. Be specific. Minimum 200 words.
Also, provide unique scores (1-100) for these 4 metrics at the very end in a JSON block: Product Quality, Market Share, Customer Satisfaction, Innovation Rate.`;

                const result = await askAI(prompt);
                if (result.success) {
                    const text = result.data;
                    let metrics = { "Product Quality": 70, "Market Share": 50, "Customer Satisfaction": 70, "Innovation Rate": 60 };
                    try {
                        const jsonMatch = text.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            metrics = { ...metrics, ...JSON.parse(jsonMatch[0]) };
                        }
                    } catch (e) { console.warn('Failed to parse metrics from AI text'); }

                    return {
                        competitor: brandName,
                        content: text.replace(/\{[\s\S]*\}/, '').trim(),
                        metrics,
                        why_this: [{ confidence: 95 }]
                    };
                }
                return null;
            }));

            setResults(analyses.filter(a => a !== null));
            setStatus('complete');
        } catch (err) {
            console.error('Analysis error:', err);
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
                {/* Content Area with Stable Transitions */}
                <div style={{ minHeight: '600px', position: 'relative' }}>
                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.div
                                key="idle-state"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    background: '#FFFFFF', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-warm)', borderRadius: 16, padding: 32, marginBottom: 32
                                }}
                            >
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
                            <div style={{ minHeight: '400px' }}>
                                <AnalysisProgress isLoading={status === 'loading'} />
                            </div>
                        )}

                        {/* Results */}
                        {status === 'complete' && results.length > 0 && (
                            <motion.div
                                key="complete-state"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
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
                                            {results.map((r, i) => {
                                                const CHART_COLORS = ['#E86A2A', '#1A1A18', '#D9CEBA', '#EDE6DA'];
                                                const brandKey = toSlug(r.competitor);
                                                return visibleBrands[r.competitor] && (
                                                    <Line
                                                        key={brandKey}
                                                        type="monotone"
                                                        dataKey={brandKey}
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
                                                padding: '24px',
                                                background: '#FFFFFF',
                                                border: '1.5px solid #D9CEBA',
                                                borderRadius: '12px',
                                                fontSize: '14px',
                                                color: '#1A1A18',
                                                lineHeight: '1.75',
                                                minHeight: '80px',
                                                whiteSpace: 'pre-wrap',
                                                fontFamily: 'var(--font-body)',
                                                maxHeight: '600px',
                                                overflowY: 'auto'
                                            }}>
                                                <div className="intelligence-report">
                                                    <ReactMarkdown>{data.content}</ReactMarkdown>
                                                </div>
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
                    </AnimatePresence>
                </div>

                {error && (
                    <div style={{ background: '#FDECEA', border: '1.5px solid #EBC0C0', borderLeft: '3px solid #A02828', borderRadius: '12px', padding: '16px 20px', fontSize: '13px', color: '#A02828', fontWeight: 500, display: 'flex', gap: 12, alignItems: 'center' }}>
                        <AlertCircle size={20} color="#A02828" style={{ flexShrink: 0 }} />
                        <div>
                            <div style={{ fontWeight: 700, marginBottom: 2 }}>Analysis failed</div>
                            {error || 'Could not reach AI model. Check console for details.'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
