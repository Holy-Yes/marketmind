import React, { useState, useRef } from 'react';
import AppSidebar from '../../components/AppSidebar';
import GenerationCanvas from '../../components/GenerationCanvas';
import api from '../../lib/api';
import { MessageSquare, User, Brain, Database, Zap, Mic, Square, Play, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PERSONAS = ['Skeptical CFO', 'Curious SMB Owner', 'Analytical CMO', 'Budget-Constrained Startup', 'Enterprise IT Gatekeeper'];

export default function PracticeSale() {
    const [form, setForm] = useState({ buyer_persona: 'Curious SMB Owner', product_context: '' });
    const [recording, setRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');
    const [followUpQuestions, setFollowUpQuestions] = useState([]);
    const [history, setHistory] = useState([]); // Persistent back-and-forth context
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const clearConversation = () => {
        setHistory([]);
        setFollowUpQuestions([]);
        set('product_context', '');
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setRecording(true);
        } catch (err) {
            console.error('Mic permission denied:', err);
            alert('Please allow microphone access to record your practice responses.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const handleGenerate = async (notes, model) => {
        const currentRepMessage = form.product_context || 'Hi, I wanted to discuss how our AI marketing platform can help your business grow.';

        // Construct the full payload with history
        const payload = {
            persona: form.buyer_persona,
            rep_message: notes ? `${currentRepMessage}\n\nRefinement: ${notes}` : currentRepMessage,
            history: history,
            model: model
        };

        console.log("🚀 [Simulator] Sending interactive payload to backend:", payload);
        const result = await api.practiceSale(payload);

        // Update history for the next turn
        if (result.content) {
            setHistory(prev => [
                ...prev,
                { role: 'rep', content: payload.rep_message },
                { role: 'persona', content: result.content }
            ]);

            // Generate follow-up questions for the rep (UI/UX enhancement)
            try {
                const qPrompt = `Based on this buyer response: "${result.content}"\n\nGenerate 3 follow-up questions the sales rep should ask. Format as a numbered list.`;
                const qResult = await api.unified_generate?.(qPrompt, model) || {
                    content: '1. What specific challenges are you facing today?\n2. How is this currently impacting your business?\n3. What would success look like for you?'
                };
                setFollowUpQuestions(qResult.content?.split('\n').filter(q => q.trim()) || []);
            } catch (e) {
                console.log('Follow-up generation skipped', e);
            }
        }

        return result;
    };

    const inputPanel = (
        <div style={{ padding: '24px 28px' }}>
            {/* DRD Header */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent-soft)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquare size={20} color="var(--accent)" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em' }}>06 — PERFORMANCE SIMULATOR</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-primary)', fontWeight: 800 }}>AI Role-Play Studio</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 9, background: 'var(--accent)', color: '#FFFFFF', padding: '3px 10px', borderRadius: 4 }}>STRATEGIC VOICE ENGINE</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 9, color: 'var(--text-secondary)', padding: '3px 8px' }}>↙ LATENCY &lt; 500ms</span>
                </div>
            </div>

            {/* DRD Context Layer */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: 12 }}>CONTEXT LAYERS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ padding: '12px 16px', borderRadius: 10, background: '#F9F9F9', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <User size={14} color="var(--accent)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-primary)' }}>
                            {form.buyer_persona} persona loaded
                        </span>
                        <Zap size={11} color="var(--accent)" fill="var(--accent)" style={{ marginLeft: 'auto' }} />
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: 10, background: '#F9F9F9', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Mic size={14} color={recording ? 'var(--red)' : 'var(--text-secondary)'} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: recording ? 'var(--red)' : 'var(--text-secondary)' }}>
                            {recording ? 'Recording session...' : 'Voice capture: Active'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Clear Conversation UI */}
            {history.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                    <button
                        onClick={clearConversation}
                        className="btn-drd-ghost"
                        style={{ width: '100%', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--red)', background: 'rgba(239,68,68,0.05)', fontSize: 11, padding: '10px' }}
                    >
                        <Trash2 size={12} /> Reset Simulation Memory
                    </button>
                </div>
            )}

            {/* Voice Recording Section */}
            <div style={{ marginBottom: 24, padding: 20, background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 12, boxShadow: 'var(--shadow-warm)' }}>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 10, color: 'var(--text-secondary)', marginBottom: 16, letterSpacing: '0.05em' }}>VOICE CAPTURE PERFORMANCE</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <button
                        onClick={recording ? stopRecording : startRecording}
                        style={{
                            flex: 1, padding: '12px 20px', borderRadius: 10,
                            background: recording ? 'rgba(239,68,68,0.1)' : 'var(--bg-hover)',
                            border: `1px solid ${recording ? 'var(--red)' : 'var(--border-default)'}`,
                            color: recording ? 'var(--red)' : 'var(--text-primary)',
                            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            transition: 'all 0.2s'
                        }}
                    >
                        {recording ? (
                            <>
                                <Square size={16} fill="var(--red)" /> Stop Session
                            </>
                        ) : (
                            <>
                                <Mic size={16} color="var(--accent)" /> Initialize Mic
                            </>
                        )}
                    </button>
                </div>
                {audioUrl && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <audio src={audioUrl} controls style={{ flex: 1, height: 32, borderRadius: 8 }} />
                            <button
                                onClick={() => { setAudioUrl(''); }}
                                style={{
                                    padding: '8px 12px', background: 'rgba(239,68,68,0.2)', border: '1px solid var(--red)',
                                    borderRadius: 8, color: 'var(--red)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                                }}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* DRD Form Inputs */}
            <div style={{ marginBottom: 24 }}>
                <label className="drd-label">Buyer Persona</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {PERSONAS.map(p => (
                        <button key={p}
                            onClick={() => set('buyer_persona', p)}
                            style={{
                                padding: '12px 14px', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 13,
                                transition: 'all 0.15s', cursor: 'pointer', textAlign: 'left',
                                background: form.buyer_persona === p ? 'var(--accent)' : '#FFFFFF',
                                border: form.buyer_persona === p ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                                color: form.buyer_persona === p ? '#FFFFFF' : 'var(--text-primary)', fontWeight: form.buyer_persona === p ? 700 : 500
                            }}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: 32 }}>
                <label className="drd-label">What are you selling today?</label>
                <textarea
                    className="drd-input"
                    placeholder="Provide context for the product or service you're simulating..."
                    value={form.product_context}
                    onChange={e => set('product_context', e.target.value)}
                    style={{ minHeight: 120, lineHeight: 1.6 }}
                />
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
            <AppSidebar />
            <div style={{ flex: 1 }}>
                <GenerationCanvas
                    inputPanel={inputPanel}
                    onGenerate={handleGenerate}
                    moduleName="Simulation"
                    placeholder="Your sales role-play — including buyer objections, counter-arguments, and follow-up questions — will appear here."
                />
                {followUpQuestions.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{
                        position: 'fixed', bottom: 20, right: 20, width: 300, background: '#FFFFFF',
                        border: '1px solid var(--border-default)', borderRadius: 16, padding: 24, zIndex: 10, boxShadow: 'var(--shadow-warm)'
                    }}>
                        <h4 style={{ color: 'var(--text-primary)', fontSize: 11, marginBottom: 16, fontWeight: 700, fontFamily: 'var(--font-body)', letterSpacing: '0.1em' }}>STRATEGIC FOLLOW-UPS</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {followUpQuestions.map((q, i) => (
                                <button key={i}
                                    onClick={() => set('product_context', q)}
                                    style={{
                                        padding: '10px 14px', borderRadius: 8, background: 'var(--bg-input)',
                                        border: '1px solid var(--border-default)', color: 'var(--text-body)', fontFamily: 'var(--font-body)',
                                        fontSize: 12, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', lineHeight: 1.4
                                    }}
                                >
                                    {q.replace(/^\d+\.\s*/, '')}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
