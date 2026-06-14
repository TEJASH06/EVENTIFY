import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-10 shadow-2xl backdrop-blur-xl max-w-md w-full text-center">
                <FaCheckCircle className="text-emerald-400 text-7xl mx-auto mb-6 drop-shadow-lg" />
                <h1 className="text-3xl font-black text-white mb-4">Registration Locked!</h1>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                    Your reservation is recorded. A confirmation message and booking summary have been dispatched to your email address.
                </p>
                <div className="space-y-4">
                    <Link to="/dashboard" className="block w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-lg shadow-emerald-500/10 hover:opacity-95">
                        Go to My Dashboard
                    </Link>
                    <Link to="/" className="block w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3.5 px-6 rounded-2xl transition">
                        Explore Other Experiences
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
