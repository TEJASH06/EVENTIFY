import { useState, useCallback } from 'react';
import api from '../utils/axios';

export const useBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to retrieve bookings';
            setError(msg);
            throw msg;
        } finally {
            setLoading(false);
        }
    }, []);

    const sendBookingOTP = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/bookings/send-otp');
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to dispatch booking OTP';
            setError(msg);
            throw msg;
        } finally {
            setLoading(false);
        }
    }, []);

    const bookTicket = useCallback(async (eventId, otp) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/bookings', { eventId, otp });
            setBookings((prev) => [data.booking, ...prev]);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to complete booking request';
            setError(msg);
            throw msg;
        } finally {
            setLoading(false);
        }
    }, []);

    const confirmTicket = useCallback(async (bookingId, paymentStatus = 'paid') => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.put(`/bookings/${bookingId}/confirm`, { paymentStatus });
            setBookings((prev) =>
                prev.map((b) => (b._id === bookingId ? { ...b, status: 'confirmed', paymentStatus } : b))
            );
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to confirm booking';
            setError(msg);
            throw msg;
        } finally {
            setLoading(false);
        }
    }, []);

    const cancelTicket = useCallback(async (bookingId) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/bookings/${bookingId}`);
            setBookings((prev) =>
                prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
            );
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to cancel booking';
            setError(msg);
            throw msg;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        bookings,
        loading,
        error,
        fetchBookings,
        sendBookingOTP,
        bookTicket,
        confirmTicket,
        cancelTicket
    };
};
