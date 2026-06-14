const EventService = require('./event.service');

const getEventsList = async (req, res) => {
    try {
        const { category, search } = req.query;
        const events = await EventService.queryEvents({ category, search });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Server Error listing events', error: err.message });
    }
};

const getSingleEvent = async (req, res) => {
    try {
        const event = await EventService.fetchEventById(req.params.id);
        res.json(event);
    } catch (err) {
        if (err.message === 'Event not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error getting event details', error: err.message });
    }
};

const createEventRecord = async (req, res) => {
    try {
        const newEvent = await EventService.createNewEvent(req.body, req.user._id);
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ message: 'Server Error creating event', error: err.message });
    }
};

const updateEventRecord = async (req, res) => {
    try {
        const updated = await EventService.updateExistingEvent(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        if (err.message === 'Event not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error updating event', error: err.message });
    }
};

const removeEventRecord = async (req, res) => {
    try {
        await EventService.deleteExistingEvent(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        if (err.message === 'Event not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error deleting event', error: err.message });
    }
};

module.exports = {
    getEventsList,
    getSingleEvent,
    createEventRecord,
    updateEventRecord,
    removeEventRecord
};
