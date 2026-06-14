import { useState, useCallback } from 'react';
import api from '../utils/axios';

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = useCallback(async (search = '', category = '') => {
        setLoading(true);
        setError(null);
        try {
            let url = '/events';
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category) params.append('category', category);
            
            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }

            const { data } = await api.get(url);
            setEvents(data);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to fetch events';
            setError(msg);
            throw msg;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSingleEvent = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get(`/events/${id}`);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to fetch event details';
            setError(msg);
            throw msg;
        } finally {
            setLoading(false);
        }
    }, []);

    const createEvent = useCallback(async (eventPayload) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/events', eventPayload);
            setEvents((prev) => [data, ...prev]);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to create event';
            setError(msg);
            throw msg;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateEvent = useCallback(async (id, eventPayload) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.put(`/events/${id}`, eventPayload);
            setEvents((prev) => prev.map((e) => (e._id === id ? data : e)));
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update event';
            setError(msg);
            throw msg;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteEvent = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/events/${id}`);
            setEvents((prev) => prev.filter((e) => e._id !== id));
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to delete event';
            setError(msg);
            throw msg;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        events,
        loading,
        error,
        fetchEvents,
        fetchSingleEvent,
        createEvent,
        updateEvent,
        deleteEvent
    };
};
