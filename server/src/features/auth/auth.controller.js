const AuthService = require('./auth.service');

const handleRegistration = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await AuthService.registerUser({ name, email, password });
        res.status(201).json({
            message: 'OTP sent to email. Please verify.',
            email: result.email
        });
    } catch (err) {
        if (err.message === 'User already exists') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error during registration', error: err.message });
    }
};

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await AuthService.authenticateUser({ email, password });
        
        if (result.needsVerification) {
            return res.status(403).json({
                message: 'Account not verified',
                needsVerification: true,
                email: result.email
            });
        }
        
        res.json(result);
    } catch (err) {
        if (err.message === 'Invalid credentials') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error during login', error: err.message });
    }
};

const handleOTPVerification = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const result = await AuthService.verifyOTPCode({ email, otp });
        res.json(result);
    } catch (err) {
        if (err.message === 'Invalid or expired OTP') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server Error during verification', error: err.message });
    }
};

module.exports = {
    handleRegistration,
    handleLogin,
    handleOTPVerification
};
