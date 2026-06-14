const express = require('express');
const router = express.Router();
const { sendOTPForBooking, createBookingRecord, confirmBookingRecord, getMyBookingsRecord, cancelBookingRecord } = require('./booking.controller');
const { authenticateUser, verifyAdminStatus } = require('../../middleware/auth.middleware');

router.post('/send-otp', authenticateUser, sendOTPForBooking);
router.post('/', authenticateUser, createBookingRecord);
router.put('/:id/confirm', authenticateUser, verifyAdminStatus, confirmBookingRecord);
router.get('/my', authenticateUser, getMyBookingsRecord);
router.delete('/:id', authenticateUser, cancelBookingRecord);

module.exports = router;
