import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../hooks/useAuth';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const { fetchSingleEvent, loading: eventLoading } = useEvents();
    const { sendBookingOTP, bookTicket, loading: bookingLoading } = useBookings();

    const [event, setEvent] = useState(null);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [initLoading, setInitLoading] = useState(true);

    useEffect(() => {
        const getEvent = async () => {
            try {
                const data = await fetchSingleEvent(id);
                setEvent(data);
            } catch (err) {
                setError(err || 'Failed to load event details.');
            } finally {
                setInitLoading(false);
            }
        };
        getEvent();
    }, [id, fetchSingleEvent]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setError('');
        setSuccessMsg('');

        try {
            if (!showOTP) {
                await sendBookingOTP();
                setShowOTP(true);
                setSuccessMsg('A security code has been sent to your email. Please submit it below.');
            } else {
                await bookTicket(event._id, otp);
                setSuccessMsg('Ticket requested successfully! Awaiting administrator approval.');
                setShowOTP(false);
                setEvent({ ...event, availableSeats: event.availableSeats - 1 });
            }
        } catch (err) {
            setError(err || 'Booking failed');
        }
    };

    if (initLoading || eventLoading) {
        return <div className="text-center py-20 text-slate-400 text-lg">Loading experience details...</div>;
    }

    if (error && !event) {
        return <div className="text-center py-20 text-red-400 font-semibold">{error || 'Experience not found.'}</div>;
    }

    const isSoldOut = event.availableSeats <= 0;

    return (
        <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-slate-900/40 shadow-2xl backdrop-blur-xl overflow-hidden mt-8">
            {event.image ? (
                <div className="h-80 w-full relative">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                </div>
            ) : (
                <div className="w-full h-64 bg-slate-900 flex items-center justify-center text-slate-500 text-4xl font-black uppercase tracking-widest">
                    {event.category}
                </div>
            )}

            <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                    <div className="flex-grow">
                        <span className="inline-block bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                            {event.category}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">{event.title}</h1>
                        <p className="text-slate-300 text-base leading-relaxed font-normal">{event.description}</p>
                    </div>

                    <div className="border border-white/10 bg-slate-950/40 p-6 rounded-2xl min-w-[320px] w-full md:w-auto shrink-0 shadow-lg relative">
                        <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
                            <FaShieldAlt className="text-indigo-400" /> Ticket Registration
                        </h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shrink-0 text-sm">
                                    <FaMoneyBillWave />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ticket Value</p>
                                    <p className="font-extrabold text-white text-base">
                                        {event.ticketPrice === 0 ? <span className="text-emerald-400">Free Pass</span> : `₹${event.ticketPrice}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shrink-0 text-sm">
                                    <FaChair />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Availability</p>
                                    <p className="font-extrabold text-white text-base">
                                        <span className={event.availableSeats < 10 ? 'text-amber-400' : 'text-white'}>
                                            {event.availableSeats}
                                        </span>
                                        <span className="text-slate-500 font-normal"> / {event.totalSeats} seats</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shrink-0 text-sm">
                                    <FaCalendarAlt />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Event Date</p>
                                    <p className="font-extrabold text-white text-base">
                                        {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shrink-0 text-sm">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location</p>
                                    <p className="font-extrabold text-white text-sm">{event.location}</p>
                                </div>
                            </div>
                        </div>

                        {showOTP && (
                            <div className="mb-5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Secure Verification Code</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="000 000"
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-300 text-center font-bold tracking-widest text-lg"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleBooking}
                            disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                            className={`w-full py-3.5 px-6 rounded-2xl font-bold transition shadow-lg text-sm uppercase tracking-wider border cursor-pointer ${
                                isSoldOut || (successMsg && !showOTP)
                                    ? 'bg-slate-800 text-slate-500 border-white/5 cursor-not-allowed'
                                    : 'bg-white text-slate-950 border-white hover:bg-slate-100 hover:scale-[1.01] active:scale-[0.99]'
                            }`}
                        >
                            {bookingLoading ? 'Processing...' : (showOTP ? 'Submit Code' : (successMsg && !showOTP ? 'Request Submitted' : (isSoldOut ? 'Sold Out' : 'Reserve Pass')))}
                        </button>
                        
                        {error && (
                            <div className="text-red-400 mt-4 text-xs font-semibold bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center">
                                {error}
                            </div>
                        )}
                        {successMsg && (
                            <div className="text-emerald-400 mt-4 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-center">
                                {successMsg}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
