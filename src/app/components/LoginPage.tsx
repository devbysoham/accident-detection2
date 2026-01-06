import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, Mail, Lock, User, AlertCircle, Eye, EyeOff, Chrome } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resetMode, setResetMode] = useState(false);

    const { login, signup, loginWithGoogle, resetPassword, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // @ts-ignore
    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (currentUser) {
            navigate(from, { replace: true });
        }
    }, [currentUser, navigate, from]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
                toast.success('Welcome back!', {
                    description: 'Successfully logged in to your account',
                });
            } else {
                if (!displayName) {
                    toast.error('Please enter your name');
                    setLoading(false);
                    return;
                }
                await signup(email, password, displayName);
                toast.success('Account created!', {
                    description: 'Welcome to AI-VISION Emergency Response',
                });
            }
            navigate(from, { replace: true });
        } catch (error: any) {
            console.error('Auth error:', error);
            let errorMessage = 'An error occurred';

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email already in use';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password';
            }

            toast.error('Authentication Failed', {
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
            toast.success('Welcome!', {
                description: 'Successfully logged in with Google',
            });
            navigate(from, { replace: true });
        } catch (error: any) {
            console.error('Google login error:', error);
            toast.error('Google Login Failed', {
                description: error.message || 'Could not sign in with Google',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            await resetPassword(email);
            toast.success('Password Reset Email Sent', {
                description: 'Check your inbox for reset instructions',
            });
            setResetMode(false);
        } catch (error: any) {
            console.error('Reset password error:', error);
            toast.error('Reset Failed', {
                description: error.message || 'Could not send reset email',
            });
        } finally {
            setLoading(false);
        }
    };

    if (resetMode) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <Card className="w-full max-w-md relative z-10 shadow-2xl border-2 border-white/50 backdrop-blur-sm bg-white/95">
                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl blur-xl opacity-40 animate-pulse"></div>
                                    <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white p-5 rounded-3xl shadow-2xl">
                                        <Activity className="w-12 h-12" strokeWidth={2.5} />
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">
                                <span className="text-gradient-emergency display-text">Reset Password</span>
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Enter your email to receive reset instructions
                            </p>
                        </div>

                        {/* Reset Form */}
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all text-sm font-medium"
                                    disabled={loading}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </Button>

                            <button
                                type="button"
                                onClick={() => setResetMode(false)}
                                className="w-full text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                            >
                                Back to Login
                            </button>
                        </form>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <Card className="w-full max-w-md relative z-10 shadow-2xl border-2 border-white/50 backdrop-blur-sm bg-white/95">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl blur-xl opacity-40 animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white p-5 rounded-3xl shadow-2xl">
                                    <Activity className="w-12 h-12" strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">
                            <span className="text-gradient-emergency display-text">AI-VISION</span>{' '}
                            <span className="text-gray-900 display-text">Emergency</span>
                        </h1>
                        <p className="text-gray-600 text-sm">
                            {isLogin ? 'Sign in to access the dashboard' : 'Create your account to get started'}
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${isLogin
                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${!isLogin
                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all text-sm font-medium"
                                    disabled={loading}
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all text-sm font-medium"
                                disabled={loading}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all text-sm font-medium"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {isLogin && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setResetMode(true)}
                                    className="text-sm text-red-600 hover:text-red-700 font-semibold transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
                        >
                            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500 font-semibold">OR</span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <Button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        variant="outline"
                        className="w-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3"
                    >
                        <Chrome className="w-5 h-5 text-red-600" />
                        Continue with Google
                    </Button>

                    {/* Info Banner */}
                    <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-blue-800 font-medium leading-relaxed">
                                    Access the AI-powered emergency response system with real-time accident detection and automatic dispatch capabilities.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Footer */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-sm text-gray-600 font-medium">
                    © 2026 AI-VISION Emergency Response System
                </p>
            </div>
        </div>
    );
};
