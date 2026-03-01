import React, { useState } from 'react';
import { Activity, AlertCircle, Droplets, Thermometer, Wind, Leaf, Cpu, Loader } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../context/LanguageContext';

export default function TelemetryView() {
    const { t } = useLanguage();
    const [params, setParams] = useState({
        temperature_celsius: 45,
        moisture_percent: 50,
        ph_level: 7.0,
        carbon_nitrogen_ratio: 28,
        waste_type: 'Mixed_Household'
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const submitPrediction = async (currentParams) => {
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const response = await fetch('https://monkpirate-mei-arivu-api.hf.space/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentParams)
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || `API request failed (${response.status})`);
            }
            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.warn('Backend unavailable, using mock prediction:', err.message);
            setError('Backend offline — showing simulated result.');
            setResult({
                days_to_degrade: Math.round(20 + Math.random() * 25),
                required_action: 'Optimal_No_Action',
                explanation: 'Biochemical parameters are within optimal ranges. The microbial consortium is actively degrading organic matter at maximum efficiency.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSliderChange = (e) => {
        setParams({
            ...params,
            [e.target.name]: e.target.type === 'number' || e.target.type === 'range' ? parseFloat(e.target.value) : e.target.value
        });
    };

    const renderGauge = (days) => {
        let health = Math.max(0, Math.min(100, 100 - ((days - 15) / (50 - 15) * 100)));
        const gaugeColor = health > 80 ? 'var(--accent)' : health > 50 ? '#f59e0b' : '#ef4444';
        const data = [{ name: 'Health', value: health, fill: gaugeColor }];
        return (
            <div className="h-48 w-full mt-4 flex justify-center items-center relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="100%" innerRadius="80%" outerRadius="100%" barSize={15} data={data} startAngle={180} endAngle={0}>
                        <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={0} />
                    </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center mt-8">
                    <span className="font-heading font-bold" style={{ fontSize: '2.2rem', lineHeight: 1, color: gaugeColor }}>{Math.round(health)}</span>
                    <span className="brutal-label mt-1">{t('health')}</span>
                </div>
            </div>
        );
    };

    const fieldLabels = {
        temperature_celsius: 'temperature',
        moisture_percent: 'moisture',
        ph_level: 'phLevel',
        carbon_nitrogen_ratio: 'cnRatio',
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input panel */}
            <section
                className="lg:col-span-5 flex flex-col cinema-enter cinema-enter-1"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderTop: '3px solid var(--accent)', padding: '2rem' }}
            >
                <h2 className="font-heading font-bold text-2xl mb-6" style={{ color: 'var(--text-primary)' }}>
                    <Cpu className="w-5 h-5 inline mr-2" style={{ color: 'var(--accent)' }} />
                    {t('telemetryInput')}
                </h2>
                <div className="space-y-6 flex-grow">
                    {[
                        { id: 'temperature_celsius', icon: Thermometer, min: 30, max: 75, step: 0.1 },
                        { id: 'moisture_percent', icon: Droplets, min: 20, max: 80, step: 0.1 },
                        { id: 'ph_level', icon: Activity, min: 4.5, max: 8.5, step: 0.1 },
                        { id: 'carbon_nitrogen_ratio', icon: Leaf, min: 15, max: 45, step: 0.1 },
                    ].map(field => (
                        <div key={field.id}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="flex items-center gap-2 brutal-label">
                                    <field.icon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                                    {t(fieldLabels[field.id])}
                                </span>
                                <span
                                    className="font-body text-sm px-2 py-0.5"
                                    style={{ color: 'var(--accent)', background: 'rgba(16,185,129,0.08)', border: '1px solid var(--accent-deep)' }}
                                >{params[field.id]}</span>
                            </div>
                            <input
                                type="range"
                                name={field.id}
                                min={field.min} max={field.max} step={field.step}
                                value={params[field.id]}
                                onChange={handleSliderChange}
                                className="w-full h-1 appearance-none cursor-pointer"
                                style={{ accentColor: 'var(--accent)', background: 'var(--border-mid)' }}
                            />
                        </div>
                    ))}
                    <div className="mt-4">
                        <label className="brutal-label flex items-center gap-2 mb-2">
                            <Wind className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                            {t('wasteType')}
                        </label>
                        <select
                            name="waste_type"
                            value={params.waste_type}
                            onChange={handleSliderChange}
                            className="w-full p-3 outline-none font-body text-sm"
                            style={{
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-mid)',
                                color: 'var(--text-primary)',
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-mid)'}
                        >
                            <option value="Market_Vegetable">Market Vegetable</option>
                            <option value="Mixed_Household">Mixed Household</option>
                            <option value="Yard_Waste">Yard Waste</option>
                        </select>
                    </div>
                </div>
                <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                    <button
                        onClick={() => submitPrediction(params)}
                        disabled={loading}
                        className="w-full py-3 font-body font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300"
                        style={{
                            background: 'var(--accent)',
                            color: 'var(--bg-primary)',
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--accent-acid)'; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--accent)'; }}
                    >
                        {loading ? (<><Loader className="w-4 h-4 animate-spin" />{t('analyzing')}</>) : t('analyzeStack')}
                    </button>
                </div>
                {error && (
                    <div className="mt-4 p-3 flex items-start gap-3" style={{ background: 'rgba(239,68,68,0.06)', borderLeft: '3px solid #ef4444' }}>
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                        <span className="font-body text-xs" style={{ color: 'var(--text-primary)' }}>{error}</span>
                    </div>
                )}
            </section>

            {/* Results panel */}
            <section className="lg:col-span-7 flex flex-col gap-6">
                <div
                    className="flex-grow flex flex-col items-center justify-center p-8 cinema-enter cinema-enter-2"
                    style={{ border: '1px solid var(--border)', minHeight: '420px' }}
                >
                    {!loading && !result && (
                        <div className="flex flex-col items-center py-12 text-center">
                            <Activity className="w-16 h-16 mb-6" style={{ color: 'var(--text-faint)' }} />
                            <p className="font-heading font-bold text-2xl uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{t('awaitingTelemetry')}</p>
                            <p className="font-body text-xs leading-loose mt-4 max-w-sm" style={{ color: 'var(--text-muted)' }}>{t('awaitingDesc')}</p>
                        </div>
                    )}
                    {loading && (
                        <div className="flex flex-col items-center">
                            <div className="biotech-loader"></div>
                        </div>
                    )}
                    {result && !loading && (
                        <div className="w-full h-full flex flex-col">
                            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                                <h2 className="font-heading font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>{t('diagnosticOverview')}</h2>
                                <span className="brutal-badge" style={{ color: 'var(--accent)', borderColor: 'var(--accent)', background: 'rgba(16,185,129,0.08)' }}>{t('analysisComplete')}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="p-6 flex flex-col" style={{ border: '1px solid var(--border)' }}>
                                    <p className="brutal-label mb-auto">{t('estBioremediation')}</p>
                                    <div className="mt-4">
                                        <span className="font-heading font-bold" style={{ fontSize: '4rem', lineHeight: 1, color: 'var(--accent)' }}>{result.days_to_degrade}</span>
                                        <span className="font-body text-xs ml-2" style={{ color: 'var(--text-muted)' }}>{t('days')}</span>
                                    </div>
                                </div>
                                <div className="pt-6 pb-2 px-6 relative overflow-hidden flex flex-col items-center justify-center" style={{ border: '1px solid var(--border)' }}>
                                    {renderGauge(result.days_to_degrade)}
                                </div>
                            </div>
                            <div className="p-6 mt-auto" style={{ borderLeft: '4px solid var(--accent)', background: 'var(--bg-surface)' }}>
                                <h3 className="brutal-label mb-3 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                                    <AlertCircle className="w-4 h-4" /> {t('requiredAction')}
                                </h3>
                                <p className="font-heading font-bold text-2xl mb-4" style={{ color: 'var(--text-primary)' }}>
                                    {result.required_action.replace(/_/g, ' ')}
                                </p>
                                <p className="font-body text-xs leading-loose" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                    {result.explanation}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
