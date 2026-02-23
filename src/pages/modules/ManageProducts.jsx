import React, { useState, useEffect } from 'react';
import AppSidebar from '../../components/AppSidebar';
import api from '../../lib/api';
import { ShoppingBag, Plus, Trash2, Package, TrendingUp, DollarSign, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        category: 'SaaS',
        price: '',
        sales_volume: ''
    });
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await api.getProducts();
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            await api.createProduct({
                ...form,
                price: parseFloat(form.price) || 0,
                sales_volume: parseInt(form.sales_volume) || 0
            });
            setSuccess('Product added successfully!');
            setForm({ name: '', description: '', category: 'SaaS', price: '', sales_volume: '' });
            fetchProducts();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await api.deleteProduct(id);
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
            <AppSidebar />
            <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ShoppingBag size={20} color="#818cf8" />
                                </div>
                                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#fff', margin: 0 }}>My Products</h1>
                            </div>
                            <p style={{ color: 'var(--gray)', fontSize: 14, margin: 0 }}>Manage your portfolio to enable deep competitive sales analysis.</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 32 }}>
                        {/* Form Column */}
                        <div style={{ background: 'rgba(22,37,64,0.4)', borderRadius: 16, border: '1px solid rgba(129,140,248,0.1)', padding: 24, height: 'fit-content' }}>
                            <h3 style={{ color: '#fff', fontSize: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Plus size={18} color="#818cf8" /> Add New Product
                            </h3>
                            <form onSubmit={handleAdd}>
                                <div style={{ marginBottom: 16 }}>
                                    <label className="drd-label">Product Name</label>
                                    <input required className="drd-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. MarketMind Ultra" />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label className="drd-label">Description</label>
                                    <textarea required className="drd-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What makes this product unique?" style={{ minHeight: 80 }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                                    <div>
                                        <label className="drd-label">Price ($)</label>
                                        <input type="number" className="drd-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
                                    </div>
                                    <div>
                                        <label className="drd-label">Sales Vol</label>
                                        <input type="number" className="drd-input" value={form.sales_volume} onChange={e => setForm({ ...form, sales_volume: e.target.value })} placeholder="Units" />
                                    </div>
                                </div>
                                <button type="submit" disabled={adding} style={{
                                    width: '100%', padding: '12px', background: '#818cf8', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                }}>
                                    {adding ? <Loader2 className="animate-spin" size={18} /> : 'Save Product'}
                                </button>

                                {success && (
                                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 12, padding: '10px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, color: '#4ade80', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <CheckCircle2 size={14} /> {success}
                                    </motion.div>
                                )}
                            </form>
                        </div>

                        {/* List Column */}
                        <div>
                            {loading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Loader2 className="animate-spin" color="#818cf8" /></div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {products.map(p => (
                                        <motion.div key={p.id} layout style={{ background: 'rgba(22,37,64,0.4)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', padding: 20 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                                <div>
                                                    <h4 style={{ color: '#fff', margin: 0, fontSize: 17 }}>{p.name}</h4>
                                                    <span style={{ fontSize: 10, color: '#818cf8', background: 'rgba(129,140,248,0.1)', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.category}</span>
                                                </div>
                                                <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.5)', cursor: 'pointer' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p style={{ color: 'var(--gray)', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>{p.description}</p>
                                            <div style={{ display: 'flex', gap: 24 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <DollarSign size={14} color="var(--gray)" />
                                                    <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>${p.price}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <TrendingUp size={14} color="var(--gray)" />
                                                    <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{p.sales_volume} sales</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {products.length === 0 && (
                                        <div style={{ textAlign: 'center', padding: 100, color: 'var(--gray)' }}>
                                            <Package size={40} style={{ opacity: 0.2, marginBottom: 16 }} />
                                            <p>No products in your portfolio yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
