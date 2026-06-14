const jwtToken = require('jsonwebtoken');
const UserProfile = require('../features/auth/user.model'); // will be created here

const authenticateUser = async (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            const tokenValue = authHeader.split(' ')[1];
            const tokenPayload = jwtToken.verify(tokenValue, process.env.JWT_SECRET);
            
            const fetchedUser = await UserProfile.findById(tokenPayload.id).select('-password');
            if (!fetchedUser) {
                return res.status(401).json({ message: 'User reference not found, authorization failed.' });
            }
            req.user = fetchedUser;
            next();
        } catch (err) {
            res.status(401).json({ message: 'Authorization token verification failed.', reason: err.message });
        }
    } else {
        res.status(401).json({ message: 'Authorization token missing.' });
    }
};

const verifyAdminStatus = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Action requires administrative access privileges.' });
    }
};

module.exports = { authenticateUser, verifyAdminStatus };
