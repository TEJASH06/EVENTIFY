const BookingService = require('./booking.service');

const sendOTPForBooking = async (req, res) => {
    try {
        await BookingService.requestBookingOTP(req.user.email);
        res.json({ message: 'OTP sent successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error sending OTP', error: err.message });
    }
};

const createBookingRecord = async (req, res) => {
    try {
        const { eventId, otp } = req.body;
        const booking = await BookingService.executeBooking(req.user.id, req.user.email, eventId, otp);
        res.status(201).json({ message: 'Booking request submitted', booking });
    } catch (err) {
        if (
            err.message === 'Invalid or expired OTP for booking' ||
            err.message === 'No seats available' ||
            err.message === 'Already booked or pending'
        ) {
            return res.status(400).json({ message: err.message });
        }
        if (err.message === 'Event not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error during booking', error: err.message });
    }
};

const confirmBookingRecord = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const booking = await BookingService.confirmBooking(req.params.id, paymentStatus);
        res.json({ message: 'Booking confirmed successfully', booking });
    } catch (err) {
        if (
            err.message === 'Booking is already confirmed' ||
            err.message === 'No seats available to confirm this booking'
        ) {
            return res.status(400).json({ message: err.message });
        }
        if (err.message === 'Booking not found') {
            return res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error during confirmation', error: err.message });
    }
};

const getMyBookingsRecord = async (req, res) => {
    try {
        const bookings = await BookingService.queryUserBookings(req.user.id, req.user.role);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server Error retrieving bookings', error: err.message });
    }
};

const cancelBookingRecord = async (req, res) => {
    try {
        await BookingService.cancelBooking(req.params.id, req.user.id, req.user.role);
        res.json({ message: 'Booking cancelled successfully' });
    } catch (err) {
        if (err.message === 'Already cancelled') {
            return res.status(400).json({ message: err.message });
        }
        if (err.message === 'Booking not found') {
            return res.status(404).json({ message: err.message });
        }
        if (err.message === 'Not authorized') {
            return res.status(403).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error cancelling booking', error: err.message });
    }
};

module.exports = {
    sendOTPForBooking,
    createBookingRecord,
    confirmBookingRecord,
    getMyBookingsRecord,
    cancelBookingRecord
};
