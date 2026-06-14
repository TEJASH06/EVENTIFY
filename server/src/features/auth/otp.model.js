const mongoose = require('mongoose');

const OneTimePasswordSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: ['account_verification', 'event_booking'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // 5 minutes TTL
    }
});

module.exports = mongoose.model('OTP', OneTimePasswordSchema);
