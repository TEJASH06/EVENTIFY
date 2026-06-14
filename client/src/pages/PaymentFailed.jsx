import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentFailed = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-10 shadow-2xl backdrop-blur-xl max-w-md w-full text-center">
                <FaTimesCircle className="text-red-400 text-7xl mx-auto mb-6 drop-shadow-lg" />
                <h1 className="text-3xl font-black text-white mb-4">Reservation Failed</h1>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                    We were unable to verify your reservation payment. Please double-check your payment options or balance and submit the request again.
                </p>
                <div className="space-y-4">
                    <Link to="/" className="block w-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-lg shadow-red-500/10 hover:opacity-95">
                        Return to Experiences
                    </Link>
                    <Link to="/dashboard" className="block w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3.5 px-6 rounded-2xl transition">
                        View Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
