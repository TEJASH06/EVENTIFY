const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./features/auth/user.model');
const Event = require('./features/events/event.model');
const Booking = require('./features/bookings/booking.model');

dotenv.config();

const users = [
    { name: 'Admin User', email: 'admin@eventify.com', password: 'password123', role: 'admin' },
    { name: 'Demo User', email: 'user@eventify.com', password: 'password123', role: 'user' },
    { name: 'Alice Smith', email: 'alice@eventify.com', password: 'password123', role: 'user' },
    { name: 'Bob Johnson', email: 'bob@eventify.com', password: 'password123', role: 'user' },
    { name: 'Charlie Dave', email: 'charlie@eventify.com', password: 'password123', role: 'user' },
    { name: 'Diana Prince', email: 'diana@eventify.com', password: 'password123', role: 'user' },
    { name: 'Ethan Hunt', email: 'ethan@eventify.com', password: 'password123', role: 'user' },
    { name: 'Fiona Gallagher', email: 'fiona@eventify.com', password: 'password123', role: 'user' },
    { name: 'George Miller', email: 'george@eventify.com', password: 'password123', role: 'user' },
    { name: 'Hannah Montana', email: 'hannah@eventify.com', password: 'password123', role: 'user' }
];

const events = [
    {
        title: 'React & Node.js Developer Retreat',
        description: 'Join us for a 3-day deep dive into modern full-stack web development. Perfect for developers looking to take their skills to the next level.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        location: 'Silicon Valley Innovation Center, CA',
        category: 'Technology',
        totalSeats: 200,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Neon Nights EDM Festival',
        description: 'Experience an unforgettable night of EDM, techno, and dazzling light shows with top DJs from around the globe.',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        location: 'Grand Arena, New York',
        category: 'Music',
        totalSeats: 500,
        ticketPrice: 1500,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Global Leaders Business Summit',
        description: 'A premium gathering of CEOs, founders, and investors discussing the future of global commerce and AI integration.',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        location: 'The Ritz-Carlton, London',
        category: 'Business',
        totalSeats: 150,
        ticketPrice: 5000,
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Modern Art Expo 2024',
        description: 'Discover breathtaking contemporary and modern arts from underground and trending artists this season.',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        location: 'Downtown Art Museum',
        category: 'Art',
        totalSeats: 300,
        ticketPrice: 200,
        image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Startup Pitch Competition',
        description: 'Watch 25 startups pitch for 1 million dollars in seed funding. Great networking for entrepreneurs and angel investors.',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        location: 'Convention Center, Miami',
        category: 'Business',
        totalSeats: 250,
        ticketPrice: 100,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Cloud Computing Architecture Seminar',
        description: 'A purely technical breakdown of scalable cloud solutions, multi-region routing, and serverless compute processing.',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        location: 'Tech Hub, Seattle',
        category: 'Technology',
        totalSeats: 100,
        ticketPrice: 600,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
    }
];

const runSeeder = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/eventify';
        await mongoose.connect(mongoUri);
        console.log('🔗 Connected to database for seeding...');

        await User.deleteMany();
        await Event.deleteMany();
        await Booking.deleteMany();
        console.log('🧹 Existing database records cleared.');

        const salt = await bcrypt.genSalt(10);
        const processedUsers = users.map(user => ({
            ...user,
            password: bcrypt.hashSync(user.password, salt),
            isVerified: true
        }));

        const insertedUsers = await User.insertMany(processedUsers);
        const adminUser = insertedUsers.find(user => user.role === 'admin');
        const normalUsers = insertedUsers.filter(user => user.role === 'user');
        console.log(`👤 Seeded ${insertedUsers.length} user profiles.`);

        const eventsWithAdmin = events.map(ev => ({
            ...ev,
            availableSeats: ev.totalSeats,
            createdBy: adminUser._id
        }));

        const insertedEvents = await Event.insertMany(eventsWithAdmin);
        console.log(`📅 Seeded ${insertedEvents.length} events.`);

        const bookingsPayload = [];

        for (const ev of insertedEvents) {
            const count = Math.floor(Math.random() * 4) + 3;
            const shuffled = [...normalUsers].sort(() => 0.5 - Math.random());
            const sampleUsers = shuffled.slice(0, count);

            for (const user of sampleUsers) {
                const statuses = ['pending', 'confirmed', 'cancelled'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];

                let paymentStatus = 'not_paid';
                if (status === 'confirmed' && ev.ticketPrice > 0) {
                    paymentStatus = Math.random() > 0.1 ? 'paid' : 'not_paid';
                } else if (ev.ticketPrice === 0) {
                    paymentStatus = 'paid';
                }

                bookingsPayload.push({
                    userId: user._id,
                    eventId: ev._id,
                    status,
                    paymentStatus,
                    amount: ev.ticketPrice
                });

                if (status === 'confirmed') {
                    ev.availableSeats -= 1;
                    await ev.save();
                }
            }
        }

        await Booking.insertMany(bookingsPayload);
        console.log(`🎫 Seeded ${bookingsPayload.length} randomized reservations.`);

        console.log('\n🌟 Database seeding completed!');
        console.log('Admin Email: admin@eventify.com');
        console.log('User Email:  user@eventify.com');
        console.log('Password for all users: password123\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

runSeeder();
