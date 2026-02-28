import React, { useState } from 'react';
import { AlertTriangle, Shield, Bug, Thermometer, Droplets, Bell, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const riskZones = [
    { zone: 'Mattuthavani Market', moisture: 78, temp: 36, days: 7, risk: 'SEVERE', disease: 'Dengue / Aedes Breeding', lat: '9.93N' },
    { zone: 'Periyar Bus Stand', moisture: 74, temp: 34, days: 6, risk: 'HIGH', disease: 'Malaria / Anopheles Risk', lat: '9.92N' },
    { zone: 'Vaigai Riverbanks', moisture: 65, temp: 38, days: 3, risk: 'MODERATE', disease: 'Leptospirosis Risk', lat: '9.92N' },
    { zone: 'Thirupparankundram Plant', moisture: 52, temp: 55, days: 2, risk: 'LOW', disease: 'No Vector Threat', lat: '9.88N' },
    { zone: 'Tallakulam Zone', moisture: 48, temp: 42, days: 1, risk: 'LOW', disease: 'No Vector Threat', lat: '9.93N' },
];

const weeklyTrend = [
    { day: 'Mon', cases: 3 }, { day: 'Tue', cases: 5 }, { day: 'Wed', cases: 8 },
    { day: 'Thu', cases: 12 }, { day: 'Fri', cases: 9 }, { day: 'Sat', cases: 14 }, { day: 'Sun', cases: 11 },
];

export default function PathogenRadar() {
    const { t } = useLanguage();
    const [alertSent, setAlertSent] = useState(false);

    const getRiskColor = (r) => {
        if (r === 'SEVERE') return { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.4)' };
        if (r === 'HIGH') return { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)' };
        if (r === 'MODERATE') return { color: '#eab308', bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.4)' };
        return { color: 'var(--accent)', bg: 'rgba(16,185,129,0.12)', border: 'var(--accent-deep)' };
    };

    const severeCount = riskZones.filter(z => z.risk === 'SEVERE' || z.risk === 'HIGH').length;

    const handleAlert = () => {
        setAlertSent(true);
        toast.success('Alert dispatched to Madurai Municipal Health Dept.', { duration: 4000 });
    };

    return (
        <div className="space-y-6">
            {/* Alert banner */}
            <div
                className="p-5 flex items-start gap-4 cinema-enter cinema-enter-1"
                style={{ border: '1px solid rgba(239,68,68,0.4)', borderLeft: '4px solid #ef4444', background: 'rgba(239,68,68,0.06)' }}
            >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
                <div className="flex-1">
                    <h3 className="font-heading font-bold text-xl" style={{ color: '#ef4444' }}>{t('vectorAlert')} — {severeCount} {t('highRiskZones')}</h3>
                    <p className="font-body text-xs leading-loose mt-1" style={{ color: 'var(--text-muted)' }}>{t('vectorAlertDesc')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Risk Registry Table */}
                <div className="lg:col-span-8 overflow-hidden cinema-enter cinema-enter-2" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderTop: '3px solid #ef4444' }}>
                    <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
                        <h3 className="font-heading font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                            <Bug className="w-4 h-4 inline mr-2" style={{ color: 'var(--accent)' }} />
                            {t('highRiskRegistry')}
                        </h3>
                        <span className="brutal-badge" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.1)' }}>Live</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    {[t('zone'), t('moisture'), t('temp'), t('days'), t('risk'), t('threat')].map(h => (
                                        <th key={h} className="brutal-label text-left px-4 py-3" style={{ color: 'var(--text-muted)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {riskZones.map(zone => {
                                    const isCrit = zone.moisture > 70 && zone.temp >= 30 && zone.temp <= 40 && zone.days > 5;
                                    const rc = getRiskColor(zone.risk);
                                    return (
                                        <tr
                                            key={zone.zone}
                                            style={{
                                                borderBottom: '1px solid var(--border)',
                                                borderLeft: isCrit ? '3px solid #ef4444' : '3px solid transparent',
                                                background: isCrit ? 'rgba(239,68,68,0.03)' : 'transparent',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-raised)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = isCrit ? 'rgba(239,68,68,0.03)' : 'transparent'; }}
                                        >
                                            <td className="px-4 py-3">
                                                <p className="font-heading font-bold text-base" style={{ color: 'var(--text-primary)' }}>{zone.zone}</p>
                                                <p className="brutal-label mt-1">{zone.lat}</p>
                                            </td>
                                            <td className="px-3 py-3 text-center">
                                                <span className="flex items-center justify-center gap-1 font-body text-sm">
                                                    <Droplets className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                                                    <span style={{ color: zone.moisture > 70 ? '#ef4444' : 'var(--text-primary)' }}>{zone.moisture}%</span>
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-center">
                                                <span className="flex items-center justify-center gap-1 font-body text-sm">
                                                    <Thermometer className="w-3 h-3" style={{ color: '#f59e0b' }} />
                                                    <span style={{ color: 'var(--text-primary)' }}>{zone.temp}°C</span>
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-center font-body text-sm" style={{ color: 'var(--text-primary)' }}>{zone.days}d</td>
                                            <td className="px-3 py-3 text-center">
                                                <span className="brutal-badge" style={{ color: rc.color, background: rc.bg, borderColor: rc.border }}>{zone.risk}</span>
                                            </td>
                                            <td className="px-4 py-3 font-body text-xs" style={{ color: 'var(--text-muted)' }}>{zone.disease}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar panels */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="p-5 cinema-enter cinema-enter-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                        <h3 className="font-heading font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                            <Shield className="w-4 h-4 inline mr-2" style={{ color: 'var(--accent)' }} />
                            {t('weeklyTrend')}
                        </h3>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyTrend} barCategoryGap="30%">
                                    <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Bar dataKey="cases" radius={[0, 0, 0, 0]}>
                                        {weeklyTrend.map((e, i) => (
                                            <Cell key={i} fill={e.cases > 10 ? '#ef4444' : e.cases > 6 ? '#f59e0b' : 'var(--accent)'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="p-5 cinema-enter cinema-enter-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                        <h3 className="font-heading font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                            <Bell className="w-4 h-4 inline mr-2" style={{ color: '#ef4444' }} />
                            {t('emergencyActions')}
                        </h3>
                        <p className="font-body text-xs leading-loose mb-4" style={{ color: 'var(--text-muted)' }}>{t('emergencyDesc')}</p>
                        <button
                            onClick={handleAlert}
                            disabled={alertSent}
                            className="w-full py-3 font-body font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                            style={{
                                background: alertSent ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                color: alertSent ? 'var(--accent)' : '#ef4444',
                                border: alertSent ? '1px solid var(--accent)' : '1px solid #ef4444',
                                cursor: alertSent ? 'default' : 'pointer',
                            }}
                        >
                            {alertSent ? (<><CheckCircle className="w-4 h-4" /> {t('alertDispatched')}</>) : (<><AlertTriangle className="w-4 h-4" /> {t('alertHealth')}</>)}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-px cinema-enter cinema-enter-5" style={{ background: 'var(--border)' }}>
                        <div className="p-4 text-center" style={{ background: 'var(--bg-primary)' }}>
                            <p className="font-heading font-bold" style={{ fontSize: '2rem', color: '#ef4444' }}>2</p>
                            <p className="brutal-label mt-1">{t('dengueZones')}</p>
                        </div>
                        <div className="p-4 text-center" style={{ background: 'var(--bg-primary)' }}>
                            <p className="font-heading font-bold" style={{ fontSize: '2rem', color: '#f59e0b' }}>1</p>
                            <p className="brutal-label mt-1">{t('malariaZone')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
