import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserPlus, FaUser, FaKey, FaChevronRight } from 'react-icons/fa';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, verifyOTP } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            if (!showOTP) {
                await register(name, email, password);
                setShowOTP(true);
                setError('');
            } else {
                await verifyOTP(email, otp);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 rounded-3xl border border-white/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-8">
                <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/20 mb-4">
                    <FaUserPlus />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-white mb-2">Create Account</h2>
                <p className="text-slate-400 text-sm">Join Eventify and reserve experiences today</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-4 rounded-2xl mb-6 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {!showOTP ? (
                    <>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
                            <div className="relative flex items-center">
                                <FaUser className="absolute left-4 text-slate-500 text-sm" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-300 shadow-inner"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-slate-500 text-sm">@</span>
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-300 shadow-inner"
                                    placeholder="name@domain.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Password</label>
                            <div className="relative flex items-center">
                                <FaKey className="absolute left-4 text-slate-500 text-sm" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-300 shadow-inner"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs p-4 rounded-2xl mb-4">
                            An activation code (OTP) has been dispatched to your email. Please input it below to verify your account.
                        </div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Verification Code</label>
                        <input
                            type="text"
                            required
                            placeholder="000 000"
                            className="w-full px-4 py-4 bg-slate-950/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-300 shadow-inner text-center font-bold tracking-widest text-xl"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3.5 rounded-2xl hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition duration-300 shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
                >
                    {isSubmitting ? 'Registering...' : (showOTP ? 'Verify & Activate' : 'Create Account')}
                    {!isSubmitting && <FaChevronRight className="text-xs" />}
                </button>
            </form>

            {!showOTP && (
                <p className="text-center mt-6 text-sm text-slate-400">
                    Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Sign in</Link>
                </p>
            )}
        </div>
    );
};

export default Register;
