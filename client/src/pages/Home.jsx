import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
    const [search, setSearch] = useState('');
    const { events, loading, fetchEvents } = useEvents();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents(search);
        }, 400); // 400ms debounce
        return () => clearTimeout(timeoutId);
    }, [search, fetchEvents]);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <div className="relative rounded-3xl border border-white/10 bg-slate-950/40 overflow-hidden mb-12 shadow-2xl backdrop-blur-xl">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
                
                <div className="relative p-10 md:p-20 text-center flex flex-col items-center z-10">
                    <span className="bg-white/5 text-indigo-300 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/10">
                        Explore Eventify
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight text-white">
                        Find Your Next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">
                            Unforgettable
                        </span> Experience
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg mb-10 max-w-2xl mx-auto font-normal leading-relaxed">
                        Discover the best tech conferences, late-night music festivals, and hands-on workshops happening directly in your area. Secure your spot today.
                    </p>

                    <div className="w-full max-w-2xl mx-auto relative flex items-center shadow-2xl group">
                        <FaSearch className="absolute left-6 text-slate-500 text-lg group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search experiences by title..."
                            className="w-full pl-16 pr-6 py-4 rounded-2xl text-white bg-slate-900/60 backdrop-blur-md border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder-slate-500 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Why Choose Us / Features row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-2">
                <div className="border border-white/5 bg-slate-950/20 p-8 rounded-2xl flex flex-col items-center text-center hover:bg-slate-900/10 hover:border-white/10 transition duration-300">
                    <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-xl mb-6 shadow-lg shadow-indigo-500/10">
                        <FaRegClock />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Fast Booking</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Secure your tickets instantly with our fast streamlined booking infrastructure built for speed.</p>
                </div>
                <div className="border border-white/5 bg-slate-950/20 p-8 rounded-2xl flex flex-col items-center text-center hover:bg-slate-900/10 hover:border-white/10 transition duration-300">
                    <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-xl mb-6 shadow-lg shadow-indigo-500/10">
                        <FaTicketAlt />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Seamless Access</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Download tickets instantly or manage them right from your personal dashboard with ease.</p>
                </div>
                <div className="border border-white/5 bg-slate-950/20 p-8 rounded-2xl flex flex-col items-center text-center hover:bg-slate-900/10 hover:border-white/10 transition duration-300">
                    <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-xl mb-6 shadow-lg shadow-indigo-500/10">
                        <FaShieldAlt />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Secure Platform</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">All transactions and registrations are bounded by cutting-edge security and 2FA OTP tech.</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8 px-2 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black text-white">Upcoming Experiences</h2>
                <div className="text-slate-400 text-sm font-medium">{events.length} experiences found</div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-lg font-medium text-slate-400">Loading experiences...</div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 text-lg text-slate-400">No events found matching your search.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <div key={event._id} className="group rounded-3xl border border-white/10 bg-slate-950/30 overflow-hidden shadow-xl hover:-translate-y-1 hover:border-white/20 hover:bg-slate-950/40 transition-all duration-300 flex flex-col">
                            <div className="h-48 bg-slate-900 overflow-hidden relative">
                                {event.image ? (
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400 font-bold text-lg">
                                        {event.category || 'Event'}
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold shadow-sm text-indigo-300">
                                    {event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice}`}
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">
                                    {event.category}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                                    {event.title}
                                </h3>
                                <div className="flex flex-col gap-2 mb-6 text-slate-400 text-xs">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-slate-500" />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-slate-500" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="w-full bg-white/5 rounded-full h-1.5 mb-2">
                                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 rounded-full" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}></div>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mb-4 font-semibold">{event.availableSeats} of {event.totalSeats} seats remaining</p>
                                    
                                    <Link to={`/events/${event._id}`} className="block w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2.5 rounded-xl transition duration-300 text-sm">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Section */}
            <footer className="mt-24 pt-16 pb-8 border-t border-white/10 text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <FaTicketAlt className="text-indigo-400 text-xl" />
                    <span className="text-lg font-bold text-white">Eventify</span>
                </div>
                <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                    The simplest, most dynamic way to manage, discover, and host world-class events in your local city. Let's make memories together.
                </p>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    &copy; {new Date().getFullYear()} Eventify Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
