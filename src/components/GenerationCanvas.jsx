import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Copy, Download, RotateCcw, ChevronDown, Check, AlertCircle, ThumbsUp, ThumbsDown, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * GenerationCanvas — DRD §05 / §06 / §07
 * High-fidelity 40/60 split canvas matching DRD v1.0.
 */

function WhyThisPanel({ rules = [] }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ marginTop: 20 }}>
            <div
                onClick={() => setOpen(!open)}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 18px', background: 'rgba(22,37,64,0.5)',
                    border: '1px solid rgba(47,128,237,0.2)', borderRadius: 12,
                    cursor: 'pointer', userSelect: 'none'
                }}
            >
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gray)', fontWeight: 500 }}>
                    🧠 Why this was generated — {rules.length} Outcome Memory rules active
                </span>
                <ChevronDown size={14} style={{ color: 'var(--blue-bright)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: '8px 4px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {rules.length === 0 ? (
                                <div style={{ padding: '16px', textAlign: 'center' }}>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginBottom: 12 }}>LEARNING MODE — 1/5 OUTCOMES</div>
                                    <div style={{ height: 4, background: 'rgba(47,128,237,0.15)', borderRadius: 2, overflow: 'hidden', width: '100%' }}>
                                        <div style={{ height: '100%', width: '20%', background: 'var(--blue-bright)' }} />
                                    </div>
                                </div>
                            ) : rules.map((r, i) => (
                                <div key={i} style={{
                                    padding: '12px 16px', borderTop: '1px solid rgba(47,128,237,0.1)',
                                    display: 'flex', alignItems: 'center', gap: 14
                                }}>
                                    <div style={{ width: 48, height: 4, background: 'rgba(47,128,237,0.2)', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                                        <div style={{ height: '100%', width: `${r.confidence}%`, background: 'var(--blue-bright)' }} />
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--gray)', flex: 1 }}>{r.rule}</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--blue-bright)' }}>{r.confidence}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, info) { console.error("GenerationCanvas Crash:", error, info); }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 40, background: 'rgba(239,68,68,0.05)', border: '1px solid var(--red)', borderRadius: 16, textAlign: 'center', margin: 40 }}>
                    <AlertCircle size={40} color="var(--red)" style={{ marginBottom: 16 }} />
                    <h3 style={{ color: '#fff', marginBottom: 8 }}>Interface Error</h3>
                    <p style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 20 }}>{this.state.error?.message}</p>
                    <button onClick={() => window.location.reload()} className="btn-drd-secondary">Reload Platform</button>
                </div>
            );
        }
        return this.props.children;
    }
}

function AIPulse() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 40 }}>
            {[1, 2, 3, 4, 5].map(i => (
                <motion.div
                    key={i}
                    animate={{ height: [10, 30, 10] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                    style={{ width: 4, background: 'var(--blue-bright)', borderRadius: 2 }}
                />
            ))}
        </div>
    );
}

export default function GenerationCanvas({
    inputPanel,              // React node for the left context input panel
    onGenerate,             // async fn(notes?) → { content, why_this? }
    placeholder = 'AI-generated content will appear here…',
    moduleName = 'Content',
}) {
    const [status, setStatus] = useState('idle'); // idle | thinking | streaming | complete | failed
    const [content, setContent] = useState('');
    const [whyThis, setWhyThis] = useState([]);
    const [notes, setNotes] = useState('');
    const [selectedModel, setSelectedModel] = useState('Gemini 1.5');
    const [imageUrl, setImageUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'pos' | 'neg' | null
    const [progress, setProgress] = useState(0);
    const outputRef = useRef(null);

    const MODELS = [
        { id: 'gemini', name: 'Gemini 1.5', provider: 'Google', color: '#4f9eff' },
        { id: 'hugging', name: 'HF (Mistral)', provider: 'HuggingFace', color: '#ffb54d' }
    ];

    const generate = async (refinementNotes = '') => {
        console.log(`[Canvas] Starting generation for ${moduleName}...`, { model: selectedModel, notes: refinementNotes });
        setStatus('thinking'); setContent(''); setWhyThis([]); setImageUrl(''); setFeedback(null); setProgress(0);

        try {
            // Simulated progress while thinking
            const progInterval = setInterval(() => {
                setProgress(p => (p < 90 ? p + (90 - p) * 0.1 : p));
            }, 400);

            console.log(`[Canvas] Triggering onGenerate...`);

            // Safety timeout: if onGenerate hangs for > 60s, force fail
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Generation timed out after 60s')), 60000)
            );

            const result = await Promise.race([
                onGenerate(refinementNotes, selectedModel.toLowerCase()),
                timeoutPromise
            ]);

            console.log(`[Canvas] Received result:`, result);

            clearInterval(progInterval);
            setProgress(100);

            // Brief pause to show 100%
            await new Promise(r => setTimeout(r, 400));
            if (result.image_url) {
                console.log(`[Canvas] Setting image URL: ${result.image_url}`);
                setImageUrl(result.image_url);
            }

            console.log(`[Canvas] Switching to streaming state...`);
            setStatus('streaming');

            const text = result.content || '';
            const words = text.split(' ');
            let displayed = '';

            for (const word of words) {
                displayed += (displayed ? ' ' : '') + word;
                setContent(displayed);
                if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
                await new Promise(r => setTimeout(r, 15 + Math.random() * 10));
            }

            setWhyThis(result.why_this || []);
            setStatus('complete');
        } catch (err) {
            let errorMsg = err.message;
            try {
                const parsed = JSON.parse(err.message);
                console.error(`[Canvas] Generation Failed (Server Error):`, parsed);
                errorMsg = parsed.detail?.[0]?.msg || parsed.detail || err.message;
            } catch (e) {
                console.error(`[Canvas] Generation Failed (Local Error):`, err);
            }
            setStatus('failed');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true); setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <ErrorBoundary>
            <div style={{ display: 'flex', height: 'calc(100vh - 52px)', overflow: 'hidden', background: 'var(--navy)' }}>
                {/* LEFT — Context Input Panel (40%) — DRD Slide 05 */}
                <div style={{
                    width: '40%', minWidth: 320, borderRight: '1px solid rgba(47,128,237,0.15)',
                    display: 'flex', flexDirection: 'column', background: 'rgba(22,37,64,0.6)', backdropFilter: 'blur(8px)'
                }}>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {inputPanel}
                    </div>

                    {/* Fixed Gen button at bottom of input panel */}
                    <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(47,128,237,0.1)', background: 'rgba(13,27,46,0.4)' }}>
                        <button
                            className="btn-drd-primary"
                            style={{ width: '100%', justifyContent: 'center', height: 44, fontSize: 15 }}
                            disabled={status === 'thinking' || status === 'streaming'}
                            onClick={() => generate()}
                        >
                            {status === 'thinking' || status === 'streaming' ? (
                                <div className="thinking-dots"><span></span><span></span><span></span></div>
                            ) : (
                                <><Sparkles size={16} /> Generate {moduleName}</>
                            )}
                        </button>
                    </div>
                </div>

                {/* RIGHT — Live Generation Canvas (60%) — DRD Slide 05 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(13,27,46,0.4)', position: 'relative' }}>
                    <div className="drd-grid" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }} />

                    {/* Header Actions */}
                    <div style={{
                        height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0 24px', borderBottom: '1px solid rgba(47,128,237,0.1)', position: 'relative', zIndex: 2
                    }}>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--blue-bright)', marginRight: 8 }}>
                                {status.toUpperCase()} ⚡
                            </div>
                            <div style={{ display: 'flex', gap: 4, background: 'rgba(22,37,64,0.5)', padding: 3, borderRadius: 20, border: '1px solid rgba(47,128,237,0.1)' }}>
                                {MODELS.map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => setSelectedModel(m.name)}
                                        style={{
                                            padding: '4px 12px', borderRadius: 16, border: 'none',
                                            fontFamily: 'var(--font-mono)', fontSize: 10, cursor: 'pointer',
                                            background: selectedModel === m.name ? m.color : 'transparent',
                                            color: selectedModel === m.name ? '#000' : 'var(--text-dim)',
                                            transition: 'all 0.2s', fontWeight: selectedModel === m.name ? 700 : 400
                                        }}
                                    >
                                        {m.name.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {status === 'complete' && (
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button onClick={handleCopy} className="btn-drd-ghost" style={{ fontSize: 12, padding: '4px 8px' }}>
                                    {copied ? <><Check size={13} /> COPIED</> : <><Copy size={13} /> COPY</>}
                                </button>
                                <button className="btn-drd-ghost" style={{ fontSize: 12, padding: '4px 8px' }}>
                                    <Download size={13} /> EXPORT
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Canvas Area */}
                    <div ref={outputRef} style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', position: 'relative', zIndex: 1 }}>
                        <AnimatePresence mode="wait">
                            {status === 'idle' && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                                >
                                    <Sparkles size={48} style={{ color: 'rgba(47,128,237,0.2)', marginBottom: 20 }} />
                                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--text-dim)', maxWidth: 300, lineHeight: 1.6 }}>
                                        {placeholder}
                                    </p>
                                </motion.div>
                            )}

                            {status === 'thinking' && (
                                <AILoadingScreen progress={progress} />
                            )}

                            {(status === 'streaming' || status === 'complete') && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="output">
                                    <div style={{
                                        fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--white)', lineHeight: 1.8,
                                        maxWidth: 680, margin: '0 auto'
                                    }}>
                                        <div className="prose-drd">
                                            <ReactMarkdown>{content}</ReactMarkdown>
                                            {status === 'streaming' && <span className="stream-cursor" />}
                                        </div>

                                        {imageUrl && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                style={{ marginTop: 32, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(47,128,237,0.2)' }}
                                            >
                                                <img src={imageUrl} alt="AI Generated" style={{ width: '100%', display: 'block' }} />
                                                <div style={{ padding: '12px 18px', background: 'rgba(22,37,64,0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: 12, color: 'var(--gray)', fontFamily: 'var(--font-mono)' }}>GENERATED VISUAL BRIEF</span>
                                                    <button className="btn-drd-ghost" style={{ padding: 6 }}>
                                                        <Download size={14} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {status === 'complete' && (
                                            <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <WhyThisPanel rules={whyThis} />
                                                <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                                                    <button
                                                        onClick={() => setFeedback('pos')}
                                                        style={{
                                                            background: feedback === 'pos' ? 'rgba(39,174,96,0.2)' : 'transparent',
                                                            border: `1px solid ${feedback === 'pos' ? 'var(--green)' : 'rgba(255,255,255,0.1)'}`,
                                                            padding: 8, borderRadius: 8, color: feedback === 'pos' ? 'var(--green)' : '#fff', cursor: 'pointer'
                                                        }}
                                                    >
                                                        <ThumbsUp size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setFeedback('neg')}
                                                        style={{
                                                            background: feedback === 'neg' ? 'rgba(231,76,60,0.2)' : 'transparent',
                                                            border: `1px solid ${feedback === 'neg' ? 'var(--red)' : 'rgba(255,255,255,0.1)'}`,
                                                            padding: 8, borderRadius: 8, color: feedback === 'neg' ? 'var(--red)' : '#fff', cursor: 'pointer'
                                                        }}
                                                    >
                                                        <ThumbsDown size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {status === 'failed' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                    <AlertCircle size={40} color="var(--red)" style={{ marginBottom: 16 }} />
                                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', marginBottom: 8 }}>Generation failed</p>
                                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--gray)', marginBottom: 24 }}>The AI pipeline hit a bottleneck. Please try again.</p>
                                    <button onClick={() => generate()} className="btn-drd-secondary">Retry Generation</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Refinement Bar (Slide 06Action bar) */}
                    <AnimatePresence>
                        {status === 'complete' && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                style={{ padding: '16px 32px', borderTop: '1px solid rgba(47,128,237,0.1)', background: 'rgba(13,27,46,0.8)', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 2 }}
                            >
                                <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: 12 }}>
                                    <input
                                        className="drd-input"
                                        style={{ flex: 1, background: 'rgba(13,27,46,0.6)' }}
                                        placeholder="Refine output — e.g. 'Make it more urgent'"
                                        value={notes} onChange={e => setNotes(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && notes && generate(notes)}
                                    />
                                    <button
                                        onClick={() => { if (notes) generate(notes); setNotes(''); }}
                                        className="btn-drd-primary" style={{ padding: '0 24px', flexShrink: 0 }}
                                    >
                                        <RotateCcw size={14} /> Refine
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <style>{`
                .prose-drd h1, .prose-drd h2, .prose-drd h3 { color: #fff; margin-bottom: 16px; margin-top: 24px; }
                .prose-drd h1 { font-size: 24px; }
                .prose-drd h2 { font-size: 20px; }
                .prose-drd p { margin-bottom: 20px; }
                .prose-drd ul, .prose-drd ol { margin-bottom: 20px; padding-left: 20px; }
                .prose-drd li { margin-bottom: 8px; }
                .prose-drd blockquote { border-left: 2px solid var(--blue-bright); padding-left: 16px; font-style: italic; color: var(--gray); margin: 24px 0; }
                .prose-drd table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 13px; }
                .prose-drd th { text-align: left; padding: 12px; border-bottom: 2px solid rgba(47,128,237,0.2); color: #fff; }
                .prose-drd td { padding: 12px; border-bottom: 1px solid rgba(47,128,237,0.1); }
            `}</style>
            </div>
        </ErrorBoundary>
    );
}

function AILoadingScreen({ progress }) {
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}
        >
            <AIPulse />
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--blue-bright)', letterSpacing: '0.2em', marginBottom: 16 }}>
                    {progress < 100 ? 'ANALYZING CONTEXT...' : 'FINALIZING PACKAGE...'}
                </div>
                <div style={{ width: 240, height: 4, background: 'rgba(47,128,237,0.1)', borderRadius: 2, overflow: 'hidden', margin: '0 auto' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        style={{ height: '100%', background: 'var(--blue-bright)', boxShadow: '0 0 12px var(--blue-bright)' }}
                    />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 8 }}>
                    {Math.round(progress)}% COMPLETE
                </div>
            </div>
        </motion.div>
    );
}
