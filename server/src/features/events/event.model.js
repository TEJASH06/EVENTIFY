const mongoose = require('mongoose');

const EventTemplateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    ticketPrice: {
        type: Number,
        required: true,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', EventTemplateSchema);
