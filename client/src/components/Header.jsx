import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaTicketAlt, FaRegUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-4 z-50 mx-auto w-[92%] max-w-7xl">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 py-4 px-6 shadow-2xl backdrop-blur-xl transition duration-300">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 text-white text-2xl font-black tracking-tight group hover:opacity-90">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                            <FaTicketAlt />
                        </div>
                        <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                            Eventify
                        </span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link to="/" className="text-slate-300 hover:text-white font-medium text-sm transition-colors cursor-pointer">
                            Explore
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link 
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                                    className="flex items-center gap-1.5 text-slate-300 hover:text-white font-medium text-sm transition-colors"
                                >
                                    <FaRegUserCircle /> Dashboard
                                </Link>
                                <button 
                                    onClick={handleSignOut} 
                                    className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all cursor-pointer"
                                >
                                    <FaSignOutAlt /> Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link 
                                    to="/login" 
                                    className="text-slate-300 hover:text-white font-medium text-sm transition-colors"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/20 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
