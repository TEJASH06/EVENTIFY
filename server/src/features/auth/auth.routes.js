const express = require('express');
const router = express.Router();
const { handleRegistration, handleLogin, handleOTPVerification } = require('./auth.controller');

router.post('/register', handleRegistration);
router.post('/login', handleLogin);
router.post('/verify-otp', handleOTPVerification);

module.exports = router;
