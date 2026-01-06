
import React, { useState, useEffect } from 'react';
import { AlertCircle, Activity, Info, BarChart3, Sun, Moon, LogOut } from 'lucide-react';
import { AccidentDetection } from './AccidentDetection';
import { EmergencyDispatch } from './EmergencyDispatch';
import { EmergencyMap } from './EmergencyMap';
import { AccidentHistory } from './AccidentHistory';
import { StatsOverview } from './StatsOverview';
import { LiveDashboard } from './LiveDashboard';
import { ServiceDirectory } from './ServiceDirectory';
import { NotificationPanel } from './NotificationPanel';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { Toaster, toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AccidentData {
    id: string;
    timestamp: Date;
    location: { lat: number; lng: number; address: string };
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    status: 'detecting' | 'confirmed' | 'dispatched' | 'responding';
}

interface Notification {
    id: string;
    type: 'accident' | 'dispatch' | 'arrival' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    severity?: 'low' | 'medium' | 'high' | 'critical';
}

export function Dashboard() {
    const { currentUser, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [accidents, setAccidents] = useState<AccidentData[]>([]);
    const [selectedAccident, setSelectedAccident] = useState<AccidentData | null>(null);
    const [isMonitoring, setIsMonitoring] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Update selected accident when accidents list changes
        if (selectedAccident) {
            const updated = accidents.find(a => a.id === selectedAccident.id);
            if (updated && JSON.stringify(updated) !== JSON.stringify(selectedAccident)) {
                setSelectedAccident(updated);
            }
        }
    }, [accidents, selectedAccident]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white p-4 rounded-2xl shadow-xl animate-bounce">
                            <Activity className="w-8 h-8" strokeWidth={2.5} />
                        </div>
                    </div>
                    <p className="text-gray-600 font-medium animate-pulse">Loading AI System...</p>
                </div>
            </div>
        );
    }

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...notification,
            id: `notif-${Date.now()}`,
            timestamp: new Date(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const handleDismissNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const handleAccidentDetected = (accident: AccidentData) => {
        // Add to accident list
        setAccidents(prev => [...prev, accident]);

        // Add notification
        addNotification({
            type: 'accident',
            title: 'Accident Detected',
            message: `${accident.severity.toUpperCase()} severity accident at ${accident.location.address}`,
            severity: accident.severity,
        });

        // Show toast notification
        toast.error('🚨 ACCIDENT DETECTED!', {
            description: `${accident.severity.toUpperCase()} severity at ${accident.location.address}`,
            duration: 5000,
        });

        // Auto-confirm after 2 seconds
        setTimeout(() => {
            setAccidents(prev =>
                prev.map(acc =>
                    acc.id === accident.id
                        ? { ...acc, status: 'confirmed' as const }
                        : acc
                )
            );
            setSelectedAccident({ ...accident, status: 'confirmed' });

            addNotification({
                type: 'info',
                title: 'Incident Confirmed',
                message: `Accident ${accident.id} has been confirmed. Notifying emergency services...`,
            });

            toast.success('Incident Confirmed', {
                description: 'Emergency services are being notified',
            });
        }, 2000);

        // Auto-dispatch after 4 seconds for critical/high severity
        if (accident.severity === 'critical' || accident.severity === 'high') {
            setTimeout(() => {
                setAccidents(prev =>
                    prev.map(acc =>
                        acc.id === accident.id
                            ? { ...acc, status: 'dispatched' as const }
                            : acc
                    )
                );

                addNotification({
                    type: 'dispatch',
                    title: 'Emergency Units Dispatched',
                    message: `Ambulance, police, and medical teams are en route to ${accident.location.address}`,
                });

                toast.info('Emergency Units Dispatched', {
                    description: 'Ambulance and police are en route',
                });
            }, 4000);

            // Simulate arrival notification
            setTimeout(() => {
                addNotification({
                    type: 'arrival',
                    title: 'First Responders Arrived',
                    message: `Emergency services have arrived at the scene of ${accident.id}`,
                });
            }, 15000);
        }
    };

    const handleSelectAccident = (accident: AccidentData) => {
        setSelectedAccident(accident);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/95">
                <div className="max-w-[1800px] mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white p-3.5 rounded-2xl shadow-xl">
                                    <Activity className="w-7 h-7" strokeWidth={2.5} />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">
                                    <span className="text-gradient-emergency display-text">AI-VISION</span>{' '}
                                    <span className="text-gray-900 display-text">Emergency Response</span>
                                </h1>
                                <p className="text-sm text-gray-600 font-medium mt-0.5">Real-Time Accident Detection & Emergency Dispatch System</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <NotificationPanel
                                notifications={notifications}
                                onDismiss={handleDismissNotification}
                                onMarkAllRead={handleMarkAllRead}
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setDarkMode(!darkMode)}
                                className="h-11 w-11 rounded-xl border-2 hover:bg-gray-100 transition-all"
                                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            >
                                {darkMode ? (
                                    <Sun className="w-5 h-5 text-yellow-600" strokeWidth={2.5} />
                                ) : (
                                    <Moon className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
                                )}
                            </Button>
                            <div className="px-4 py-2.5 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 text-purple-700 rounded-xl flex items-center gap-2.5 shadow-sm">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-xs">{currentUser?.displayName || 'User'}</span>
                                    <span className="text-xs opacity-75">{currentUser?.email}</span>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="h-11 px-4 rounded-xl border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all flex items-center gap-2"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                                <span className="font-bold text-red-700 hidden sm:inline">Sign Out</span>
                            </Button>
                            <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-green-200 text-green-700 rounded-xl flex items-center gap-2.5 shadow-sm">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                                <span className="font-bold text-sm tracking-wide">SYSTEM ACTIVE</span>
                            </div>
                            <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-blue-200 text-blue-700 rounded-xl flex items-center gap-2.5 shadow-sm">
                                <Info className="w-4 h-4" strokeWidth={2.5} />
                                <span className="text-sm font-bold">{accidents.length}</span>
                                <span className="text-sm font-medium">Incidents</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1800px] mx-auto px-6 py-8">
                {/* Live Dashboard */}
                <div className="mb-8">
                    <LiveDashboard accidents={accidents} isMonitoring={isMonitoring} />
                </div>

                {/* Stats Overview */}
                <div className="mb-8">
                    <StatsOverview accidents={accidents} />
                </div>

                {/* Main Tabs */}
                <Tabs defaultValue="monitoring" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3 max-w-2xl h-12 bg-white border-2 shadow-sm p-1 gap-1">
                        <TabsTrigger value="monitoring" className="font-semibold text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                            <Activity className="w-4 h-4 mr-1" />
                            Monitoring
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="font-semibold text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                            <BarChart3 className="w-4 h-4 mr-1" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="directory" className="font-semibold text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-sky-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                            <Info className="w-4 h-4 mr-1" />
                            Directory
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="monitoring" className="space-y-8">
                        {/* Main Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - AI Detection */}
                            <div className="lg:col-span-1">
                                <AccidentDetection
                                    onAccidentDetected={handleAccidentDetected}
                                    isMonitoring={isMonitoring}
                                    onToggleMonitoring={setIsMonitoring}
                                />
                            </div>

                            {/* Middle Column - History */}
                            <div className="lg:col-span-1">
                                <AccidentHistory
                                    accidents={accidents}
                                    onSelectAccident={handleSelectAccident}
                                    selectedAccidentId={selectedAccident?.id}
                                />
                            </div>

                            {/* Right Column - Dispatch */}
                            <div className="lg:col-span-1">
                                <EmergencyDispatch accident={selectedAccident} />
                            </div>
                        </div>

                        {/* Full Width Map - Spans entire width for better visibility */}
                        <div className="w-full">
                            <EmergencyMap accident={selectedAccident} />
                        </div>

                        {/* Info Banner */}
                        {accidents.length === 0 && (
                            <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 border-2 border-blue-200 p-8 shadow-lg">
                                <div className="flex items-start gap-5">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-20"></div>
                                        <div className="relative bg-gradient-to-br from-blue-600 to-sky-600 text-white p-4 rounded-2xl shadow-xl">
                                            <AlertCircle className="w-7 h-7" strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-blue-900 mb-3 text-xl display-text">System Ready</h3>
                                        <p className="text-sm text-blue-800 leading-relaxed mb-4">
                                            AI-powered cameras are actively monitoring traffic intersections in real-time.
                                            When an accident is detected, emergency services will be automatically notified and dispatched
                                            to the nearest hospital and police station. The system uses advanced neural networks with{' '}
                                            <span className="font-bold text-blue-900">98.5% accuracy</span> to identify collision events.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <div className="bg-white px-4 py-2 rounded-xl text-xs font-bold text-blue-700 shadow-sm border border-blue-200">
                                                🎯 Real-time Detection
                                            </div>
                                            <div className="bg-white px-4 py-2 rounded-xl text-xs font-bold text-blue-700 shadow-sm border border-blue-200">
                                                🚨 Auto-Dispatch
                                            </div>
                                            <div className="bg-white px-4 py-2 rounded-xl text-xs font-bold text-blue-700 shadow-sm border border-blue-200">
                                                📍 Location Tracking
                                            </div>
                                            <div className="bg-white px-4 py-2 rounded-xl text-xs font-bold text-blue-700 shadow-sm border border-blue-200">
                                                ⚡ Neural Network AI
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="analytics">
                        <AnalyticsDashboard accidents={accidents} />
                    </TabsContent>

                    <TabsContent value="directory">
                        <ServiceDirectory />
                    </TabsContent>
                </Tabs>
            </main>

            {/* Footer */}
            <footer className="mt-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t-4 border-red-600 py-10">
                <div className="max-w-[1800px] mx-auto px-6">
                    <div className="text-center">
                        <h3 className="text-white font-bold text-xl mb-2 display-text tracking-tight">
                            AI-VISION Emergency Response System
                        </h3>
                        <p className="text-gray-300 font-medium text-sm mb-3">
                            Real-time accident detection using computer vision and deep learning
                        </p>
                        <p className="text-gray-400 text-xs">
                            Demo system • Coordinates with nearest hospitals, police stations, and ambulance services
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-3 text-xs text-gray-500">
                            <span>Powered by Neural Networks</span>
                            <span>•</span>
                            <span>98.5% Detection Accuracy</span>
                            <span>•</span>
                            <span>24/7 Monitoring</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
