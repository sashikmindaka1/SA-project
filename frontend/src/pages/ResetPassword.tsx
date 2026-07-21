import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token: string | null = searchParams.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        if (!token) {
            setError('Invalid or missing reset token.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5016/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong.');
            }

            setMessage(data.message || 'Password reset successful!');
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
                
                {/* Header Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 tracking-wider uppercase">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Enter your new password below to secure your account.
                    </p>
                </div>

                {/* Feedback Alerts */}
                {message && (
                    <div className="bg-cyan-950/50 border border-cyan-500/50 text-cyan-300 p-4 rounded-xl text-sm shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-950/50 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">
                                New Password
                            </label>
                            <input 
                                type="password" 
                                required 
                                value={newPassword} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner transition-all duration-200"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">
                                Confirm New Password
                            </label>
                            <input 
                                type="password" 
                                required 
                                value={confirmPassword} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner transition-all duration-200"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Neon Blue Button */}
                    <div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-xl font-bold text-gray-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 focus:outline-none shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-gray-950" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    RESETTING...
                                </span>
                            ) : (
                                'RESET PASSWORD'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;