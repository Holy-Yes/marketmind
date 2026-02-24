import React from 'react';
import { motion } from 'framer-motion';

const STYLES = [
    { id: 'photorealistic', name: 'Photorealistic', desc: 'Clean, high-end photography', preview: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
    { id: 'neon_cyber', name: 'Neon Cyber', desc: 'Vibrant, high-contrast digital', preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 'minimalist', name: 'Minimalist', desc: 'Product-focused, white space', preview: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)' },
    { id: 'editorial', name: 'Editorial', desc: 'Magazine style, bold typography', preview: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)' },
    { id: '3d_render', name: '3D Render', desc: 'Octane style, soft lighting', preview: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
    { id: 'sketch', name: 'Hand-Drawn', desc: 'Artistic sketch/illustration', preview: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)' }
];

export default function StyleSelector({ selectedStyle, onSelect }) {
    return (
        <div style={{ marginBottom: 24 }}>
            <label className="drd-label">Brand Aesthetic / Style</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {STYLES.map(s => (
                    <motion.div
                        key={s.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(s.id)}
                        style={{
                            padding: '10px', borderRadius: 12, background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                            border: `1px solid ${selectedStyle === s.id ? 'var(--blue-bright)' : 'rgba(47,128,237,0.1)'}`,
                            cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
                        }}
                    >
                        <div style={{ height: 40, borderRadius: 8, background: s.preview, marginBottom: 8, opacity: 0.8 }} />
                        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, color: '#fff' }}>{s.name}</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--text-dim)', marginTop: 2 }}>{s.desc}</div>

                        {selectedStyle === s.id && (
                            <motion.div
                                layoutId="style-check"
                                style={{ position: 'absolute', top: 6, right: 6, width: 14, height: 14, borderRadius: '50%', background: 'var(--blue-bright)', border: '2px solid var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#000' }} />
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
