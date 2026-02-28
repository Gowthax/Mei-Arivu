import React, { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import TelemetryView from './components/TelemetryView';
import CommandCenter from './components/CommandCenter';
import PathogenRadar from './components/PathogenRadar';
import BioSupplyInventory from './components/BioSupplyInventory';
import SettingsView from './components/SettingsView';
import AboutView from './components/AboutView';

function DashboardContent({ onGoLanding }) {
    const [activeTab, setActiveTab] = useState('telemetry');
    const { t } = useLanguage();

    const tabTitleKeys = {
        telemetry: 'telemetryTitle', command: 'commandTitle', pathogen: 'pathogenTitle',
        inventory: 'inventoryTitle', settings: 'settingsTitle', about: 'aboutTitle',
    };
    const tabSubKeys = {
        telemetry: 'telemetrySub', command: 'commandSub', pathogen: 'pathogenSub',
        inventory: 'inventorySub', settings: 'settingsSub', about: 'aboutSub',
    };

    const renderTab = () => {
        switch (activeTab) {
            case 'telemetry': return <TelemetryView />;
            case 'command': return <CommandCenter />;
            case 'pathogen': return <PathogenRadar />;
            case 'inventory': return <BioSupplyInventory />;
            case 'settings': return <SettingsView />;
            case 'about': return <AboutView />;
            default: return <TelemetryView />;
        }
    };

    return (
        <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onGoLanding={onGoLanding} />
            <div className="ml-64 flex-1 min-h-screen relative overflow-hidden">
                {/* Ambient emerald glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(16,185,129,0.04) 0%, transparent 70%)' }} />
                <header
                    className="sticky top-0 z-30 px-8 py-5"
                    style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}
                >
                    <h1 className="font-heading font-bold" style={{ fontSize: '2rem', color: 'var(--text-primary)', lineHeight: 1 }}>
                        {t(tabTitleKeys[activeTab])}
                    </h1>
                    <p className="font-body text-xs mt-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                        {t(tabSubKeys[activeTab])}
                    </p>
                </header>
                <main className="p-8 relative z-10">
                    {renderTab()}
                </main>
            </div>
        </div>
    );
}

export default function App() {
    const [appState, setAppState] = useState('splash'); // splash -> landing -> dashboard

    const handleSplashDone = useCallback(() => setAppState('landing'), []);
    const handleEnterDashboard = useCallback(() => setAppState('dashboard'), []);
    const handleGoLanding = useCallback(() => setAppState('landing'), []);

    return (
        <LanguageProvider>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-mid)',
                        borderLeft: '3px solid var(--accent)',
                        fontFamily: '"Space Mono", monospace',
                        fontSize: '12px',
                        borderRadius: 0,
                    },
                    success: { iconTheme: { primary: 'var(--accent)', secondary: 'var(--bg-primary)' } },
                }}
            />
            {appState === 'splash' && <SplashScreen onFinish={handleSplashDone} />}
            {appState === 'landing' && <LandingPage onEnterDashboard={handleEnterDashboard} />}
            {appState === 'dashboard' && <DashboardContent onGoLanding={handleGoLanding} />}
        </LanguageProvider>
    );
}
