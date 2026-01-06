import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Activity } from 'lucide-react';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

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

    if (!currentUser) {
        // Redirect to login page but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
