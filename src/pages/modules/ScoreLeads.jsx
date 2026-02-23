import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppSidebar from '../../components/AppSidebar';
import GenerationCanvas from '../../components/GenerationCanvas';
import api from '../../lib/api';
import { Target, Upload, Database, Zap, FileText, BarChart } from 'lucide-react';
import { BarChart as RBChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import CountUp from 'react-countup';

export default function ScoreLeads() {
    const [form, setForm] = useState({ lead_data: '', scoring_notes: '' });
    const [isUploading, setIsUploading] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const [outreachResult, setOutreachResult] = useState('');
    const [leads, setLeads] = useState([]);

    const handleGenerate = async (notes, model) => {
        setOutreachResult('');
        const payload = {
            lead_data: form.lead_data,
            notes: form.scoring_notes + (notes ? `\n\nRefinement: ${notes}` : ''),
            model: model
        };
        const res = await api.scoreLeads(payload);
        if (res.leads) setLeads(res.leads);
        return res;
    };

    const handleBulkOutreach = async (model) => {
        const hots = leads.filter(l => l.tier === 'Hot');
        if (!hots.length) return alert('No HOT leads found to outreach!');

        // This will be handled by the canvas streaming
        return api.generateBulkOutreach({ leads: hots, model });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        const reader = new FileReader();
        reader.onload = (re) => {
            set('lead_data', re.target.result.slice(0, 5000) + '\n[TRUNCATED]');
            setIsUploading(false);
        };
        reader.readAsText(file);
    };

    const inputPanel = (
        <div style={{ padding: '24px 28px' }}>
            {/* DRD Header */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Target size={18} color="var(--green)" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', letterSpacing: '0.12em' }}>05 — LEAD SCORER</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', fontWeight: 700 }}>Conversion Engine</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, background: 'rgba(16,185,129,0.15)', color: 'var(--green)', padding: '2px 8px', borderRadius: 4 }}>IBM watsonx AI</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', padding: '2px 8px' }}>↙ LAST RUN &lt; 5s</span>
                </div>
            </div>

            {/* DRD Stats Layer */}
            {leads.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: 32, padding: '16px 20px', background: 'rgba(16,185,129,0.05)', borderRadius: 12, border: '1px solid rgba(16,185,129,0.1)' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 4 }}>TOTAL LEADS</div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>
                                <CountUp end={leads.length} duration={1.5} />
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', marginBottom: 4 }}>HOT LEADS</div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-display)' }}>
                                <CountUp end={leads.filter(l => l.tier === 'Hot').length} duration={2} />
                            </div>
                        </div>
                    </div>

                    <div style={{ height: 120, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RBChart
                                layout="vertical"
                                data={[
                                    { name: 'Hot', count: leads.filter(l => l.tier === 'Hot').length, color: 'var(--green)' },
                                    { name: 'Warm', count: leads.filter(l => l.tier === 'Warm').length, color: 'var(--blue-bright)' },
                                    { name: 'Cool', count: leads.filter(l => l.tier === 'Cool').length, color: 'var(--gray)' }
                                ]}
                                margin={{ left: -30 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="var(--text-dim)" fontSize={10} fontFamily="var(--font-mono)" />
                                <Tooltip
                                    contentStyle={{ background: 'var(--navy)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12 }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                    {[0, 1, 2].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--green)' : index === 1 ? 'var(--blue-bright)' : 'var(--gray)'} />
                                    ))}
                                </Bar>
                            </RBChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            )}

            {/* DRD Context Layer */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 12 }}>CONTEXT LAYERS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(13,27,46,0.3)', border: `1px solid ${form.lead_data ? 'var(--green)' : 'rgba(16,185,129,0.1)'}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FileText size={14} color={form.lead_data ? 'var(--green)' : 'var(--text-dim)'} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: form.lead_data ? '#fff' : 'var(--text-dim)' }}>
                            {form.lead_data ? 'Lead dataset loaded' : 'Awaiting lead data'}
                        </span>
                        {form.lead_data && <Zap size={10} color="var(--green)" style={{ marginLeft: 'auto' }} />}
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(13,27,46,0.3)', border: '1px solid rgba(16,185,129,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Database size={14} color="var(--text-dim)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-dim)' }}>Historical outcomes active (N=47)</span>
                    </div>
                </div>
            </div>

            {/* DRD Form Inputs */}
            <div style={{ marginBottom: 24 }}>
                <label className="drd-label">Upload Lead CSV or Paste Data</label>
                <div style={{ position: 'relative' }}>
                    <textarea
                        className="drd-input"
                        placeholder="Paste lead names, emails, and interaction history..."
                        value={form.lead_data}
                        onChange={e => set('lead_data', e.target.value)}
                        style={{ minHeight: 120, lineHeight: 1.6 }}
                    />
                    <label style={{
                        position: 'absolute', right: 12, bottom: 12,
                        background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                        borderRadius: 6, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6,
                        cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)'
                    }}>
                        <Upload size={12} />
                        {isUploading ? 'UPLOADING...' : 'UPLOAD CSV'}
                        <input type="file" accept=".csv,.txt" onChange={handleFileUpload} style={{ visibility: 'hidden', width: 0, height: 0, position: 'absolute' }} />
                    </label>
                </div>
            </div>

            <div style={{ marginBottom: 32 }}>
                <label className="drd-label">Scoring Preference / Custom Rules</label>
                <textarea
                    className="drd-input"
                    placeholder="e.g. 'Prioritize leads from the tech industry with >$10k budget'..."
                    value={form.scoring_notes}
                    onChange={e => set('scoring_notes', e.target.value)}
                    style={{ minHeight: 80, lineHeight: 1.6 }}
                />
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
            <AppSidebar />
            <div style={{ flex: 1 }}>
                <GenerationCanvas
                    inputPanel={inputPanel}
                    onGenerate={handleGenerate}
                    moduleName="Scoring"
                    placeholder="Your lead scores — including HOT/WARM/COLD categorizations, next-best-action recommendations, and reasoning — will stream here."
                    customActions={
                        leads.length > 0 && (
                            <button
                                onClick={() => handleBulkOutreach('gemini')}
                                className="drd-button"
                                style={{ width: 'auto', padding: '8px 16px', fontSize: 13, background: 'var(--green)', color: '#000' }}
                            >
                                <Zap size={14} style={{ marginRight: 8 }} />
                                Generate Outreach for HOT Leads
                            </button>
                        )
                    }
                />
            </div>
        </div>
    );
}
