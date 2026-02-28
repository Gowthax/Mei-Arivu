import React, { useState } from 'react';
import { MapPin, AlertTriangle, CheckCircle, Clock, TrendingUp, Layers, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const hotspots = [
    { name: 'Thirupparankundram Plant', lat: '9.8765', lng: '78.0648', status: 'Active', piles: 14, backlog: '2.3 tonnes', risk: 'Low' },
    { name: 'Mattuthavani Market', lat: '9.9312', lng: '78.1432', status: 'Overloaded', piles: 31, backlog: '8.7 tonnes', risk: 'High' },
    { name: 'Vaigai Riverbanks', lat: '9.9195', lng: '78.1010', status: 'Active', piles: 9, backlog: '1.1 tonnes', risk: 'Medium' },
    { name: 'Tallakulam Zone', lat: '9.9250', lng: '78.1200', status: 'Active', piles: 7, backlog: '0.8 tonnes', risk: 'Low' },
    { name: 'Periyar Bus Stand', lat: '9.9190', lng: '78.1280', status: 'Critical', piles: 22, backlog: '6.2 tonnes', risk: 'High' },
];

const positions = [
    { top: '28%', left: '35%' },
    { top: '38%', left: '68%' },
    { top: '55%', left: '50%' },
    { top: '65%', left: '42%' },
    { top: '42%', left: '58%' },
];

export default function CommandCenter() {
    const { t } = useLanguage();
    const [selectedMarker, setSelectedMarker] = useState(null);

    const cityStats = [
        { label: t('totalActiveSites'), value: '83', icon: Layers, color: 'var(--accent)' },
        { label: t('wasteBacklog'), value: '19.1 T', icon: TrendingUp, color: '#f59e0b' },
        { label: t('avgDegradation'), value: '28 Days', icon: Clock, color: 'var(--accent-acid)' },
        { label: t('alertsActive'), value: '7', icon: AlertTriangle, color: '#ef4444' },
    ];

    return (
        <div className="space-y-6">
            {/* Stat grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'var(--border)' }}>
                {cityStats.map(stat => (
                    <div key={stat.label} className="p-5" style={{ background: 'var(--bg-primary)' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                            <span className="brutal-label">{stat.label}</span>
                        </div>
                        <p className="font-heading font-bold" style={{ fontSize: '2.2rem', lineHeight: 1, color: stat.color }}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Geospatial map */}
                <div
                    className="lg:col-span-8 relative min-h-[420px] overflow-hidden cinema-enter cinema-enter-1"
                    style={{ border: '1px solid var(--border)', borderTop: '3px solid var(--accent)' }}
                >
                    <div
                        className="absolute top-4 left-4 z-10 px-3 py-1.5"
                        style={{ background: 'rgba(6,9,8,0.85)', border: '1px solid var(--border-mid)' }}
                    >
                        <p className="brutal-label">{t('liveGeospatial')}</p>
                    </div>
                    <div
                        className="w-full h-full min-h-[420px] relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #060908 0%, #0a0f0d 50%, #060908 100%)' }}
                    >
                        {/* Emerald grid */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                            backgroundImage: 'linear-gradient(rgba(16,185,129,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.07) 1px, transparent 1px)',
                            backgroundSize: '60px 60px'
                        }} />
                        {/* River */}
                        <div className="absolute top-[45%] left-0 right-0 h-8 opacity-30">
                            <svg width="100%" height="100%" viewBox="0 0 800 30" preserveAspectRatio="none">
                                <path d="M0,15 C100,5 200,25 300,12 C400,2 500,22 600,15 C700,8 750,20 800,15" stroke="var(--accent)" strokeWidth="2" fill="none" strokeDasharray="6,4" />
                            </svg>
                        </div>

                        {hotspots.map((spot, i) => {
                            const pos = positions[i];
                            const dotColor = spot.risk === 'High' ? '#ef4444' : spot.risk === 'Medium' ? '#f59e0b' : 'var(--accent)';
                            const isSelected = selectedMarker === i;

                            return (
                                <div
                                    key={spot.name}
                                    className="absolute cursor-pointer group"
                                    style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
                                    onClick={() => setSelectedMarker(isSelected ? null : i)}
                                >
                                    <div className="absolute -inset-3 rounded-full animate-ping opacity-40" style={{ background: dotColor }} />
                                    <div
                                        className="relative w-4 h-4 z-10 transition-transform duration-200"
                                        style={{
                                            background: dotColor,
                                            border: isSelected ? '2px solid var(--text-primary)' : '2px solid var(--bg-primary)',
                                            transform: isSelected ? 'scale(1.6)' : 'scale(1)',
                                        }}
                                    />

                                    {/* Click tooltip */}
                                    {isSelected && (
                                        <div
                                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-30 min-w-[200px]"
                                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-mid)', borderLeft: `3px solid ${dotColor}`, padding: '12px 14px' }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button onClick={() => setSelectedMarker(null)} className="absolute top-1.5 right-1.5" style={{ color: 'var(--text-muted)' }}>
                                                <X className="w-3 h-3" />
                                            </button>
                                            <p className="font-heading font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{spot.name}</p>
                                            <div className="mt-2 space-y-1.5">
                                                {[
                                                    ['Status', spot.status, spot.status === 'Overloaded' || spot.status === 'Critical' ? '#ef4444' : 'var(--accent)'],
                                                    ['Piles', spot.piles, 'var(--text-primary)'],
                                                    ['Backlog', spot.backlog, 'var(--text-primary)'],
                                                    ['Coords', `${spot.lat}°N, ${spot.lng}°E`, 'var(--text-muted)'],
                                                ].map(([k, v, c]) => (
                                                    <div key={k} className="flex justify-between">
                                                        <span className="brutal-label">{k}</span>
                                                        <span className="font-body text-xs" style={{ color: c }}>{v}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-2">
                                                <span className="brutal-badge" style={{ color: dotColor, borderColor: dotColor, background: 'transparent' }}>{spot.risk} Risk</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Hover tooltip */}
                                    {!isSelected && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-mid)', padding: '6px 10px' }}>
                                            <p className="font-heading font-bold text-xs" style={{ color: 'var(--text-primary)' }}>{spot.name}</p>
                                            <p className="brutal-label mt-0.5">{spot.piles} piles · {spot.backlog}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <div className="absolute bottom-4 right-4 font-body" style={{ fontSize: '0.6rem', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>
                            9.9252° N, 78.1198° E — Madurai
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="overflow-hidden cinema-enter cinema-enter-2" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                        <div className="p-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
                            <MapPin className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                            <h3 className="font-heading font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{t('activeBioSites')}</h3>
                        </div>
                        <div>
                            {hotspots.map((spot, i) => {
                                const isBad = spot.status === 'Overloaded' || spot.status === 'Critical';
                                return (
                                    <div
                                        key={spot.name}
                                        className="flex items-center justify-between px-4 py-3 cursor-pointer"
                                        style={{
                                            borderBottom: '1px solid var(--border)',
                                            background: selectedMarker === i ? 'var(--bg-raised)' : 'transparent',
                                            borderLeft: selectedMarker === i ? '3px solid var(--accent)' : '3px solid transparent',
                                        }}
                                        onClick={() => setSelectedMarker(selectedMarker === i ? null : i)}
                                        onMouseEnter={e => { if (selectedMarker !== i) e.currentTarget.style.background = 'var(--bg-primary)'; }}
                                        onMouseLeave={e => { if (selectedMarker !== i) e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <div>
                                            <p className="font-heading font-bold text-base" style={{ color: 'var(--text-primary)' }}>{spot.name}</p>
                                            <p className="brutal-label mt-1">{spot.piles} piles · {spot.backlog}</p>
                                        </div>
                                        <span
                                            className="brutal-badge"
                                            style={{
                                                color: isBad ? '#ef4444' : 'var(--accent)',
                                                borderColor: isBad ? 'rgba(239,68,68,0.5)' : 'var(--accent)',
                                                background: isBad ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
                                            }}
                                        >{spot.status}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="overflow-hidden cinema-enter cinema-enter-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                        <div className="p-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
                            <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                            <h3 className="font-heading font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{t('cityWasteBacklog')}</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {[
                                { zone: 'Zone A — Central', value: 72, color: '#ef4444' },
                                { zone: 'Zone B — South', value: 45, color: '#f59e0b' },
                                { zone: 'Zone C — North', value: 28, color: 'var(--accent)' },
                                { zone: 'Zone D — East', value: 61, color: '#f59e0b' },
                            ].map(z => (
                                <div key={z.zone}>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="brutal-label">{z.zone}</span>
                                        <span className="font-body text-xs" style={{ color: 'var(--text-primary)' }}>{z.value}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: 3, background: 'var(--border-mid)' }}>
                                        <div style={{ height: '100%', width: `${z.value}%`, background: z.color, transition: 'width 0.7s' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
