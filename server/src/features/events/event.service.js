const Event = require('./event.model');

class EventService {
    static async queryEvents({ category, search }) {
        const queryFilters = {};
        if (category) {
            queryFilters.category = category;
        }
        if (search) {
            queryFilters.title = { $regex: search, $options: 'i' };
        }

        return await Event.find(queryFilters).populate('createdBy', 'name email');
    }

    static async fetchEventById(eventId) {
        const event = await Event.findById(eventId).populate('createdBy', 'name email');
        if (!event) {
            throw new Error('Event not found');
        }
        return event;
    }

    static async createNewEvent(eventData, creatorId) {
        const { title, description, date, location, category, totalSeats, ticketPrice, image } = eventData;
        
        return await Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats: totalSeats,
            ticketPrice: ticketPrice || 0,
            image: image || '',
            createdBy: creatorId
        });
    }

    static async updateExistingEvent(eventId, updateData) {
        const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });
        if (!updatedEvent) {
            throw new Error('Event not found');
        }
        return updatedEvent;
    }

    static async deleteExistingEvent(eventId) {
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            throw new Error('Event not found');
        }
        return deletedEvent;
    }
}

module.exports = EventService;
