const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/eventify';
        const connection = await mongoose.connect(uri);
        console.log(`Database connected successfully: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDatabase;
