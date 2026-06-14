import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle, FaCompass } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { bookings, loading, fetchBookings, cancelTicket } = useBookings();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate, fetchBookings]);

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking request?')) {
            try {
                await cancelTicket(id);
            } catch (err) {
                alert(err || 'Error cancelling booking');
            }
        }
    };

    if (loading && bookings.length === 0) {
        return <div className="text-center py-20 text-slate-400 text-lg">Loading dashboard data...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* User Profile Header Card */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 mb-8 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black uppercase tracking-wide shrink-0 shadow-lg shadow-indigo-500/20">
                    {user?.name?.charAt(0)}
                </div>
                <div className="flex flex-col items-center sm:items-start">
                    <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5 tracking-tight">Welcome, {user?.name}!</h1>
                    <p className="text-slate-400 flex items-center justify-center sm:justify-start gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span> User Dashboard
                    </p>
                </div>
            </div>

            {/* Title Section */}
            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                    <FaTicketAlt className="text-indigo-400" /> My Booking Requests
                </h2>
            </div>

            {bookings.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-16 text-center shadow-2xl backdrop-blur-xl">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FaTicketAlt className="text-slate-500 text-2xl" />
                    </div>
                    <p className="text-lg text-slate-400 mb-6 font-medium">You haven't reserved any experiences yet.</p>
                    <Link to="/" className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-bold py-3 px-8 rounded-2xl transition duration-300 shadow-md">
                        <FaCompass className="text-sm" /> Browse Experiences
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="group rounded-3xl border border-white/10 bg-slate-950/20 shadow-xl overflow-hidden hover:bg-slate-950/40 hover:border-white/20 transition-all duration-300 flex flex-col">
                            <div className="p-6 flex-grow">
                                {booking.eventId ? (
                                    <>
                                        <div className="flex justify-between items-start mb-4 gap-3">
                                            <h3 className="text-base font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors">
                                                {booking.eventId.title}
                                            </h3>
                                            <div className="flex flex-col gap-1.5 items-end shrink-0">
                                                <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase tracking-wider ${
                                                    booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
                                                    booking.status === 'cancelled' ? 'bg-red-500/10 text-red-300 border border-red-500/20' :
                                                    'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                                {booking.status !== 'cancelled' && (
                                                    <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase tracking-wider ${
                                                        booking.paymentStatus === 'paid' 
                                                            ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' 
                                                            : 'bg-slate-800 text-slate-400 border border-white/5'
                                                    }`}>
                                                        {booking.paymentStatus.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-400 space-y-2 mt-4">
                                            <p className="flex justify-between border-b border-white/5 pb-1">
                                                <span className="text-slate-500">Date:</span> 
                                                <span className="font-semibold text-white">
                                                    {new Date(booking.eventId.date).toLocaleDateString()}
                                                </span>
                                            </p>
                                            <p className="flex justify-between border-b border-white/5 pb-1">
                                                <span className="text-slate-500">Price:</span> 
                                                <span className="font-semibold text-white">
                                                    {booking.amount === 0 ? <span className="text-emerald-400">Free</span> : `₹${booking.amount}`}
                                                </span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span className="text-slate-500">Requested:</span> 
                                                <span className="font-semibold text-white">
                                                    {new Date(booking.bookedAt).toLocaleDateString()}
                                                </span>
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-red-400 text-xs italic">Experience details unavailable (event deleted)</p>
                                )}
                            </div>
                            
                            <div className="px-6 py-4 bg-slate-950/40 border-t border-white/5 flex justify-between items-center shrink-0">
                                {booking.eventId && booking.status !== 'cancelled' ? (
                                    <>
                                        <Link to={`/events/${booking.eventId._id}`} className="text-indigo-400 font-bold text-xs hover:text-indigo-300 transition-colors uppercase tracking-wider">
                                            Details
                                        </Link>
                                        <button
                                            onClick={() => handleCancel(booking._id)}
                                            className="text-red-400 font-bold text-xs hover:text-red-300 transition-colors flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                                        >
                                            <FaTimesCircle className="text-sm" /> Cancel Pass
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full text-center text-xs text-slate-500 font-bold uppercase tracking-wider">
                                        Reservation Cancelled
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
