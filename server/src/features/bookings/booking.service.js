const Booking = require('./booking.model');
const Event = require('../events/event.model');
const OTP = require('../auth/otp.model');
const { dispatchBookingConfirmation, dispatchOTPMail } = require('../../utils/mailer');

const generateRandomOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

class BookingService {
    static async requestBookingOTP(userEmail) {
        const generatedCode = generateRandomOTP();
        await OTP.findOneAndDelete({ email: userEmail, action: 'event_booking' });
        await OTP.create({
            email: userEmail,
            otp: generatedCode,
            action: 'event_booking'
        });
        await dispatchOTPMail(userEmail, generatedCode, 'event_booking');
        return { success: true };
    }

    static async executeBooking(userId, userEmail, eventId, otpCode) {
        const otpRecord = await OTP.findOne({ email: userEmail, otp: otpCode, action: 'event_booking' });
        if (!otpRecord) {
            throw new Error('Invalid or expired OTP for booking');
        }

        const targetEvent = await Event.findById(eventId);
        if (!targetEvent) {
            throw new Error('Event not found');
        }
        if (targetEvent.availableSeats <= 0) {
            throw new Error('No seats available');
        }

        const activeBooking = await Booking.findOne({ userId, eventId });
        if (activeBooking && activeBooking.status !== 'cancelled') {
            throw new Error('Already booked or pending');
        }

        const bookingDetails = await Booking.create({
            userId,
            eventId,
            status: 'pending',
            paymentStatus: 'not_paid',
            amount: targetEvent.ticketPrice
        });

        await OTP.deleteOne({ _id: otpRecord._id });

        return bookingDetails;
    }

    static async confirmBooking(bookingId, paymentStatus) {
        const activeBooking = await Booking.findById(bookingId).populate('userId').populate('eventId');
        if (!activeBooking) {
            throw new Error('Booking not found');
        }

        if (activeBooking.status === 'confirmed') {
            throw new Error('Booking is already confirmed');
        }

        const targetEvent = await Event.findById(activeBooking.eventId._id);
        if (targetEvent.availableSeats <= 0) {
            throw new Error('No seats available to confirm this booking');
        }

        activeBooking.status = 'confirmed';
        if (paymentStatus) {
            activeBooking.paymentStatus = paymentStatus;
        }
        await activeBooking.save();

        targetEvent.availableSeats -= 1;
        await targetEvent.save();

        await dispatchBookingConfirmation(activeBooking.userId.email, activeBooking.userId.name, activeBooking.eventId.title);

        return activeBooking;
    }

    static async queryUserBookings(userId, userRole) {
        if (userRole === 'admin') {
            return await Booking.find()
                .populate('eventId')
                .populate('userId', 'name email')
                .sort({ createdAt: -1 });
        } else {
            return await Booking.find({ userId })
                .populate('eventId')
                .sort({ createdAt: -1 });
        }
    }

    static async cancelBooking(bookingId, userId, userRole) {
        const targetBooking = await Booking.findById(bookingId);
        if (!targetBooking) {
            throw new Error('Booking not found');
        }

        if (targetBooking.userId.toString() !== userId.toString() && userRole !== 'admin') {
            throw new Error('Not authorized');
        }

        if (targetBooking.status === 'cancelled') {
            throw new Error('Already cancelled');
        }

        const wasConfirmed = targetBooking.status === 'confirmed';

        targetBooking.status = 'cancelled';
        await targetBooking.save();

        if (wasConfirmed) {
            const targetEvent = await Event.findById(targetBooking.eventId);
            if (targetEvent) {
                targetEvent.availableSeats += 1;
                await targetEvent.save();
            }
        }

        return { success: true };
    }
}

module.exports = BookingService;
