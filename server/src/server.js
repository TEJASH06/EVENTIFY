const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./config/db');

// Route configurations
const authRoutes = require('./features/auth/auth.routes');
const eventRoutes = require('./features/events/event.routes');
const bookingRoutes = require('./features/bookings/booking.routes');

dotenv.config();

const app = express();

// Initialize DB connection
connectDatabase();

// CORS and parser configuration
app.use(cors());
app.use(express.json());

// API Enpoints registration
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

const serverPort = process.env.PORT || 5000;
app.listen(serverPort, () => {
    console.log(`Application successfully listening on port ${serverPort}`);
});
