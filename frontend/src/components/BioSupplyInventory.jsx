import React, { useState } from 'react';
import { Package, AlertTriangle, CheckCircle, RefreshCw, TrendingDown, Truck, ShoppingCart, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const initialInventory = [
    { id: 1, name: 'Bacillus Subtilis Culture', category: 'Microbial Inoculant', stock: 12, unit: 'litres', capacity: 100, status: 'Low', supplier: 'BioGreen Labs, Chennai', lastRestock: '2026-02-14', costPerUnit: '₹850', reorderThreshold: 20 },
    { id: 2, name: 'Dry Sawdust / Carbon Matter', category: 'Carbon Amendment', stock: 680, unit: 'kg', capacity: 1000, status: 'Optimal', supplier: 'Madurai Timber Co-op', lastRestock: '2026-02-22', costPerUnit: '₹12', reorderThreshold: 200 },
    { id: 3, name: 'Liquid Odor Suppressant', category: 'Chemical Agent', stock: 4, unit: 'litres', capacity: 50, status: 'Critical', supplier: 'EcoShield Chemicals, Trichy', lastRestock: '2026-01-28', costPerUnit: '₹1,200', reorderThreshold: 10 },
    { id: 4, name: 'EM Bokashi Compost Starter', category: 'Microbial Inoculant', stock: 35, unit: 'kg', capacity: 80, status: 'Moderate', supplier: 'Annamalai BioFarms', lastRestock: '2026-02-10', costPerUnit: '₹320', reorderThreshold: 16 },
    { id: 5, name: 'Lime Powder (CaCO3)', category: 'pH Amendment', stock: 220, unit: 'kg', capacity: 500, status: 'Optimal', supplier: 'Sivagangai Minerals', lastRestock: '2026-02-18', costPerUnit: '₹28', reorderThreshold: 100 },
    { id: 6, name: 'Protective PPE Kits', category: 'Safety Gear', stock: 8, unit: 'sets', capacity: 50, status: 'Low', supplier: 'SafeWork India Pvt Ltd', lastRestock: '2026-02-01', costPerUnit: '₹2,400', reorderThreshold: 10 },
];

export default function BioSupplyInventory() {
    const { t } = useLanguage();
    const [inventory] = useState(initialInventory);
    const [reordered, setReordered] = useState({});
    const [processing, setProcessing] = useState({});

    const getStatusColor = (s) => {
        if (s === 'Critical') return { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)' };
        if (s === 'Low') return { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)' };
        if (s === 'Moderate') return { color: '#eab308', bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.4)' };
        return { color: 'var(--accent)', bg: 'rgba(16,185,129,0.12)', border: 'var(--accent-deep)' };
    };

    const getBarColor = (s) => {
        if (s === 'Critical') return '#ef4444';
        if (s === 'Low') return '#f59e0b';
        if (s === 'Moderate') return '#eab308';
        return 'var(--accent)';
    };

    const handleReorder = (item) => {
        setProcessing(p => ({ ...p, [item.id]: true }));
        setTimeout(() => {
            setProcessing(p => ({ ...p, [item.id]: false }));
            setReordered(p => ({ ...p, [item.id]: true }));
            toast.success(`Purchase order simulated for ${item.name}.`, { duration: 3000 });
        }, 1500);
    };

    const criticalCount = inventory.filter(i => i.status === 'Critical').length;
    const lowCount = inventory.filter(i => i.status === 'Low').length;

    return (
        <div className="space-y-6">
            {/* Summary stats */}
            <div
                className="grid grid-cols-2 lg:grid-cols-4 gap-px"
                style={{ background: 'var(--border)' }}
            >
                {[
                    { icon: Package, label: t('totalItems'), value: inventory.length, color: 'var(--accent)' },
                    { icon: AlertTriangle, label: t('critical'), value: criticalCount, color: '#ef4444' },
                    { icon: TrendingDown, label: t('lowStock'), value: lowCount, color: '#f59e0b' },
                    { icon: Truck, label: t('inventoryValue'), value: '₹2,84,600', color: 'var(--accent-acid)' },
                ].map(s => (
                    <div key={s.label} className="p-5" style={{ background: 'var(--bg-primary)' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <s.icon className="w-4 h-4" style={{ color: s.color }} />
                            <span className="brutal-label">{s.label}</span>
                        </div>
                        <p className="font-heading font-bold" style={{ fontSize: '2.2rem', lineHeight: 1, color: s.color }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Main table */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderTop: '3px solid var(--accent)' }}>
                <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
                    <h3 className="font-heading font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                        <ShoppingCart className="w-4 h-4 inline mr-2" style={{ color: 'var(--accent)' }} />
                        {t('bioSupplyRegistry')}
                    </h3>
                    <span className="brutal-label">{t('autoReorderNote')}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                {[t('material'), t('category'), t('stockLevel'), t('status'), t('supplier'), t('action')].map(h => (
                                    <th key={h} className="text-left brutal-label px-5 py-3" style={{ color: 'var(--text-muted)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map(item => {
                                const pct = Math.round((item.stock / item.capacity) * 100);
                                const needsReorder = pct < 20;
                                const sc = getStatusColor(item.status);
                                return (
                                    <tr
                                        key={item.id}
                                        style={{
                                            borderBottom: '1px solid var(--border)',
                                            background: needsReorder ? 'rgba(239,68,68,0.03)' : 'transparent',
                                            borderLeft: needsReorder ? '3px solid #ef4444' : '3px solid transparent',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={e => { if (!needsReorder) e.currentTarget.style.background = 'var(--bg-raised)'; }}
                                        onMouseLeave={e => { if (!needsReorder) e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-heading font-bold text-base" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                                            <p className="font-body text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{item.costPerUnit}/{item.unit}</p>
                                        </td>
                                        <td className="px-3 py-4 font-body text-xs" style={{ color: 'var(--text-muted)' }}>{item.category}</td>
                                        <td className="px-3 py-4">
                                            <div className="flex flex-col items-start gap-2">
                                                <span className="font-body text-xs" style={{ color: 'var(--text-primary)' }}>
                                                    {item.stock} <span style={{ color: 'var(--text-muted)' }}>/ {item.capacity} {item.unit}</span>
                                                </span>
                                                <div style={{ width: 80, height: 3, background: 'var(--border-mid)' }}>
                                                    <div style={{ height: '100%', width: `${pct}%`, background: getBarColor(item.status), transition: 'width 0.5s' }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4">
                                            <span
                                                className="brutal-badge"
                                                style={{ color: sc.color, background: sc.bg, borderColor: sc.border }}
                                            >{item.status}</span>
                                        </td>
                                        <td className="px-3 py-4">
                                            <p className="font-body text-xs" style={{ color: 'var(--text-primary)' }}>{item.supplier}</p>
                                            <p className="brutal-label mt-1">Last: {item.lastRestock}</p>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            {needsReorder ? (
                                                <button
                                                    onClick={() => handleReorder(item)}
                                                    disabled={reordered[item.id] || processing[item.id]}
                                                    className="brutal-badge inline-flex items-center gap-1.5 cursor-pointer transition-all duration-200"
                                                    style={{
                                                        color: reordered[item.id] ? 'var(--accent)' : '#f59e0b',
                                                        borderColor: reordered[item.id] ? 'var(--accent)' : '#f59e0b',
                                                        background: reordered[item.id] ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                                        cursor: reordered[item.id] || processing[item.id] ? 'default' : 'pointer',
                                                    }}
                                                >
                                                    {reordered[item.id] ? (<><CheckCircle className="w-3 h-3" /> {t('ordered')}</>) :
                                                        processing[item.id] ? (<><Loader className="w-3 h-3 animate-spin" /> {t('processing')}</>) :
                                                            (<><RefreshCw className="w-3 h-3" /> {t('autoReorder')}</>)}
                                                </button>
                                            ) : (
                                                <span className="brutal-label">—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
