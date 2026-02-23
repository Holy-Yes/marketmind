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
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquare size={18} color="var(--gold)" />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--gold)', letterSpacing: '0.12em' }}>06 — SALES SIMULATOR</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', fontWeight: 700 }}>AI Role-Play with Voice</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, background: 'rgba(245,158,11,0.15)', color: 'var(--gold)', padding: '2px 8px', borderRadius: 4 }}>Groq LLaMA 70B</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', padding: '2px 8px' }}>↙ LATENCY &lt; 500ms</span>
                </div>
            </div>

            {/* DRD Context Layer */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 12 }}>CONTEXT LAYERS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(13,27,46,0.3)', border: '1px solid rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <User size={14} color="var(--gold)" />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#fff' }}>
                            {form.buyer_persona} persona loaded
                        </span>
                        <Zap size={10} color="var(--gold)" style={{ marginLeft: 'auto' }} />
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(13,27,46,0.3)', border: '1px solid rgba(245,158,11,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Mic size={14} color={recording ? 'var(--red)' : 'var(--text-dim)'} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: recording ? 'var(--red)' : 'var(--text-dim)' }}>
                            {recording ? 'Recording in progress...' : 'Voice response: Ready'}
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
                        style={{ width: '100%', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--red)', background: 'rgba(239,68,68,0.05)', fontSize: 11 }}
                    >
                        <Trash2 size={12} /> Reset Simulation & Memory
                    </button>
                </div>
            )}

            {/* Voice Recording Section */}
            <div style={{ marginBottom: 24, padding: 16, background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 12 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--cyan)', marginBottom: 12, letterSpacing: '0.05em' }}>PRACTICE RESPONSE</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <button
                        onClick={recording ? stopRecording : startRecording}
                        style={{
                            flex: 1, padding: '10px 16px', borderRadius: 10,
                            background: recording ? 'rgba(239,68,68,0.2)' : 'rgba(34,211,238,0.15)',
                            border: `1px solid ${recording ? 'var(--red)' : 'var(--cyan)'}`,
                            color: recording ? 'var(--red)' : 'var(--cyan)',
                            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                        }}
                    >
                        {recording ? (
                            <>
                                <Square size={16} /> Stop Recording
                            </>
                        ) : (
                            <>
                                <Mic size={16} /> Record Response
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
                                padding: '10px 14px', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 13,
                                transition: 'all 0.15s', cursor: 'pointer', textAlign: 'left',
                                background: form.buyer_persona === p ? 'rgba(245,158,11,0.15)' : 'rgba(22,37,64,0.4)',
                                border: form.buyer_persona === p ? '1px solid var(--gold)' : '1px solid rgba(47,128,237,0.1)',
                                color: form.buyer_persona === p ? 'var(--gold)' : 'var(--gray)', fontWeight: form.buyer_persona === p ? 600 : 400
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
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
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
                        position: 'fixed', bottom: 20, right: 20, width: 300, background: 'rgba(13,27,46,0.95)',
                        border: '1px solid rgba(34,211,238,0.3)', borderRadius: 12, padding: 20, zIndex: 10
                    }}>
                        <h4 style={{ color: 'var(--cyan)', fontSize: 13, marginBottom: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>📋 FOLLOW-UP QUESTIONS</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {followUpQuestions.map((q, i) => (
                                <button key={i}
                                    onClick={() => set('product_context', q)}
                                    style={{
                                        padding: '8px 12px', borderRadius: 8, background: 'rgba(34,211,238,0.1)',
                                        border: '1px solid rgba(34,211,238,0.2)', color: 'var(--gray)', fontFamily: 'var(--font-body)',
                                        fontSize: 12, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'
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
