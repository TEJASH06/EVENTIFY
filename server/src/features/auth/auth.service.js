const User = require('./user.model');
const OTP = require('./otp.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dispatchOTPMail } = require('../../utils/mailer');

const generateRandomOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateAuthToken = (userId, userRole) => {
    return jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

class AuthService {
    static async registerUser({ name, email, password }) {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user', // secure default
            isVerified: false
        });

        const verificationCode = generateRandomOTP();
        await OTP.create({
            email,
            otp: verificationCode,
            action: 'account_verification'
        });

        await dispatchOTPMail(email, verificationCode, 'account_verification');

        return {
            email: newUser.email
        };
    }

    static async authenticateUser({ email, password }) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new Error('Invalid credentials');
        }

        if (!user.isVerified && user.role !== 'admin') {
            const verificationCode = generateRandomOTP();
            await OTP.findOneAndDelete({ email: user.email, action: 'account_verification' });
            await OTP.create({
                email: user.email,
                otp: verificationCode,
                action: 'account_verification'
            });
            await dispatchOTPMail(user.email, verificationCode, 'account_verification');
            
            return {
                needsVerification: true,
                email: user.email
            };
        }

        const token = generateAuthToken(user._id, user.role);

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        };
    }

    static async verifyOTPCode({ email, otp }) {
        const match = await OTP.findOne({ email, otp, action: 'account_verification' });
        if (!match) {
            throw new Error('Invalid or expired OTP');
        }

        const verifiedUser = await User.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true }
        );

        await OTP.deleteOne({ _id: match._id });

        const token = generateAuthToken(verifiedUser._id, verifiedUser.role);

        return {
            _id: verifiedUser._id,
            name: verifiedUser.name,
            email: verifiedUser.email,
            role: verifiedUser.role,
            token
        };
    }
}

module.exports = AuthService;
