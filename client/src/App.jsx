import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
                {/* Decorative mesh gradients */}
                <div className="absolute top-0 left-1/4 -z-50 h-[400px] w-[600px] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none"></div>
                <div className="absolute top-1/3 right-1/4 -z-50 h-[300px] w-[500px] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none"></div>
                
                <Header />
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/events/:id" element={<EventDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/payment-success" element={<PaymentSuccess />} />
                        <Route path="/payment-failed" element={<PaymentFailed />} />
                        <Route path="*" element={<h1 className="text-3xl font-extrabold text-center mt-20 bg-gradient-to-r from-red-400 to-amber-500 bg-clip-text text-transparent">404 - Page Not Found</h1>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
