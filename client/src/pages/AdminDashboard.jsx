import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { useBookings } from '../hooks/useBookings';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaPlus, FaMinus, FaTrash, FaCheck, FaTimes, FaCoins, FaUserFriends, FaHourglassHalf } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { events, fetchEvents, createEvent, deleteEvent } = useEvents();
    const { bookings, fetchBookings, confirmTicket, cancelTicket } = useBookings();

    const [loading, setLoading] = useState(true);
    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        const loadDashboardData = async () => {
            try {
                await Promise.all([fetchEvents(), fetchBookings()]);
            } catch (err) {
                console.error('Error fetching dashboard records:', err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, [user, navigate, fetchEvents, fetchBookings]);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await createEvent(formData);
            setShowEventForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: '' });
        } catch (err) {
            alert(err || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvent(id);
            } catch (err) {
                alert(err || 'Error deleting event');
            }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await confirmTicket(id, paymentStatus);
        } catch (err) {
            alert(err || 'Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm("Cancel this user's booking request?")) {
            try {
                await cancelTicket(id);
            } catch (err) {
                alert(err || 'Error cancelling booking');
            }
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-slate-400 text-lg">Loading admin configuration panel...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header Block */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 mb-8 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight flex items-center gap-3 justify-center md:justify-start">
                        <FaShieldAlt className="text-indigo-400 text-2xl" /> Administrative Dashboard
                    </h1>
                    <p className="text-slate-400 text-sm">Manage live experiences and approve user reservations.</p>
                </div>
                <button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-2xl hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition shadow-lg shadow-indigo-500/10 cursor-pointer text-sm uppercase tracking-wider"
                >
                    {showEventForm ? <><FaMinus /> Hide Creator</> : <><FaPlus /> New Experience</>}
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="rounded-3xl border border-white/10 bg-slate-900/20 p-6 flex items-center justify-between shadow-xl backdrop-blur-sm">
                    <div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">Accumulated Revenue</p>
                        <h3 className="text-2xl sm:text-3xl font-black text-emerald-400">
                            ₹{bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0)}
                        </h3>
                    </div>
                    <div className="w-11 h-11 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center text-lg shadow-inner">
                        <FaCoins />
                    </div>
                </div>
                
                <div className="rounded-3xl border border-white/10 bg-slate-900/20 p-6 flex items-center justify-between shadow-xl backdrop-blur-sm">
                    <div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">Verified Participants</p>
                        <h3 className="text-2xl sm:text-3xl font-black text-indigo-400">
                            {new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size}
                        </h3>
                    </div>
                    <div className="w-11 h-11 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center text-lg shadow-inner">
                        <FaUserFriends />
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900/20 p-6 flex items-center justify-between shadow-xl backdrop-blur-sm">
                    <div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">Awaiting Verification</p>
                        <h3 className="text-2xl sm:text-3xl font-black text-amber-400">
                            {bookings.filter(b => b.status === 'pending').length}
                        </h3>
                    </div>
                    <div className="w-11 h-11 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center text-lg shadow-inner">
                        <FaHourglassHalf />
                    </div>
                </div>
            </div>

            {/* Event Form Creator */}
            {showEventForm && (
                <div className="rounded-3xl border border-white/10 bg-slate-900/30 p-8 mb-8 shadow-2xl backdrop-blur-xl transition duration-500">
                    <h2 className="text-xl font-bold mb-6 text-white tracking-tight">Create New Experience</h2>
                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input required type="text" placeholder="Experience Title" className="bg-slate-950/50 border border-white/10 px-4 py-3 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <input required type="text" placeholder="Category (e.g., Technology, Music)" className="bg-slate-950/50 border border-white/10 px-4 py-3 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        <input required type="date" className="bg-slate-950/50 border border-white/10 px-4 py-3 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        <input required type="text" placeholder="Location" className="bg-slate-950/50 border border-white/10 px-4 py-3 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        <input required type="number" placeholder="Total Available Seats" className="bg-slate-950/50 border border-white/10 px-4 py-3 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                        <input required type="number" placeholder="Ticket Price (0 for free pass)" className="bg-slate-950/50 border border-white/10 px-4 py-3 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />

                        <div className="md:col-span-2">
                            <input type="text" placeholder="Image URL (Unsplash or direct asset address)" className="w-full bg-slate-950/50 border border-white/10 px-4 py-3 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                        </div>

                        <textarea required placeholder="Detailed Experience Description" className="bg-slate-950/50 border border-white/10 px-4 py-3 rounded-2xl md:col-span-2 h-28 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        <button type="submit" className="md:col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3.5 mt-2 rounded-2xl hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition shadow-lg shadow-indigo-500/20 cursor-pointer text-sm uppercase tracking-wider">
                            Publish Experience
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Events Column */}
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3 px-2">
                        <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">{events.length}</span>
                        All Experiences
                    </h2>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/20 overflow-hidden shadow-2xl">
                        <ul className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                            {events.length === 0 ? (
                                <li className="p-8 text-slate-500 text-center text-sm font-medium">No experiences published.</li>
                            ) : (
                                events.map(event => (
                                    <li key={event._id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/[0.02] transition">
                                        <div>
                                            <h4 className="font-bold text-white text-sm mb-1">{event.title}</h4>
                                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> {new Date(event.date).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${event.availableSeats > 0 ? 'bg-emerald-400' : 'bg-red-500'}`}></span> {event.availableSeats} / {event.totalSeats} seats remaining
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteEvent(event._id)} 
                                            className="w-full sm:w-auto text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bookings Column */}
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3 px-2">
                        <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">{bookings.length}</span>
                        Pending Reservations
                    </h2>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/20 overflow-hidden shadow-2xl">
                        <ul className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                            {bookings.length === 0 ? (
                                <li className="p-8 text-slate-500 text-center text-sm font-medium">No active reservation requests.</li>
                            ) : (
                                bookings.map(booking => (
                                    <li key={booking._id} className={`p-6 hover:bg-white/[0.01] transition border-l-4 ${booking.status === 'pending' ? 'border-l-amber-500' : booking.status === 'confirmed' ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
                                        <div className="flex justify-between items-start mb-3 gap-3">
                                            <h4 className="font-bold text-white text-sm leading-snug">{booking.eventId?.title || 'Deleted Experience'}</h4>
                                            <div className="flex flex-col gap-1 items-end shrink-0">
                                                <span className={`px-2 py-0.5 text-[8px] font-black rounded-md uppercase tracking-wider ${
                                                    booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 
                                                    booking.status === 'cancelled' ? 'bg-red-500/10 text-red-300 border border-red-500/20' : 
                                                    'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                                {booking.status !== 'cancelled' && (
                                                    <span className={`px-2 py-0.5 text-[8px] font-black rounded-md uppercase tracking-wider ${
                                                        booking.paymentStatus === 'paid' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'bg-slate-800 text-slate-400 border border-white/5'
                                                    }`}>
                                                        {booking.paymentStatus.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 mb-4 text-xs space-y-1.5">
                                            <p className="flex justify-between border-b border-white/5 pb-1">
                                                <span className="text-slate-500">Client:</span>
                                                <span className="font-semibold text-white">
                                                    {booking.userId?.name} <span className="text-slate-400 font-normal">({booking.userId?.email})</span>
                                                </span>
                                            </p>
                                            <p className="flex justify-between border-b border-white/5 pb-1">
                                                <span className="text-slate-500">Amount:</span>
                                                <span className={`font-semibold ${booking.amount === 0 ? 'text-emerald-400' : 'text-white'}`}>
                                                    {booking.amount === 0 ? 'Free' : `₹${booking.amount}`}
                                                </span>
                                            </p>
                                            <p className="flex justify-between border-b border-white/5 pb-1">
                                                <span className="text-slate-500">Requested At:</span>
                                                <span className="text-slate-300">{new Date(booking.bookedAt).toLocaleString()}</span>
                                            </p>
                                            {booking.eventId && (
                                                <p className="flex justify-between">
                                                    <span className="text-slate-500">Event Seat capacity:</span>
                                                    <span className="text-slate-300 font-semibold">
                                                        <span className="text-emerald-400 font-bold">{booking.eventId.availableSeats}</span> remaining of {booking.eventId.totalSeats}
                                                    </span>
                                                </p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        {booking.status === 'pending' && (
                                            <div className="flex flex-wrap gap-2.5 mt-2">
                                                <button 
                                                    onClick={() => handleConfirmBooking(booking._id, 'paid')} 
                                                    className="flex-grow flex items-center justify-center gap-1.5 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 text-xs font-bold py-2.5 px-3 rounded-xl shadow-sm transition cursor-pointer"
                                                >
                                                    <FaCheck /> Confirm (Paid)
                                                </button>
                                                <button 
                                                    onClick={() => handleConfirmBooking(booking._id, 'not_paid')} 
                                                    className="flex-grow flex items-center justify-center gap-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5 text-xs font-bold py-2.5 px-3 rounded-xl shadow-sm transition cursor-pointer"
                                                >
                                                    <FaCheck /> Confirm (Unpaid)
                                                </button>
                                                <button 
                                                    onClick={() => handleCancelBooking(booking._id)} 
                                                    className="flex-grow flex items-center justify-center gap-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 text-xs font-bold py-2.5 px-3 rounded-xl transition cursor-pointer"
                                                >
                                                    <FaTimes /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
