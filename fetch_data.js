
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars from server/.env because that's where the backend config usually is, 
// OR assume they are in root .env if that's how the project is set up.
// Given the file structure, let's try root first, but usually backend has its own.
// Wait, the user is in root. Let's check where .env is.
// Assuming root .env for now based on previous context.

dotenv.config();

const connectDB = async () => {
    try {
        // Hardcoding URI if .env fails to load in this context, or just rely on it.
        // Better to try to find the URI.
        if (!process.env.MONGO_URI) {
            // Fallback or try to load from server/.env
            dotenv.config({ path: './server/.env' });
        }

        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not found in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const fetchData = async () => {
    await connectDB();

    try {
        const user = await mongoose.connection.db.collection('users').findOne({ email: 'mendoza.mauriciogbueno@gmail.com' });
        const product = await mongoose.connection.db.collection('products').findOne({ name: { $regex: 'Laptop Gamer MSI Thin', $options: 'i' } });
        const fs = await import('fs');
        const output = `USER_ID=${user ? user._id.toString() : ''}\nPRODUCT_ID=${product ? product._id.toString() : ''}\nPRODUCT_PRICE=${product ? product.price : 0}`;
        fs.writeFileSync('ids.txt', output);
        console.log('IDs written to ids.txt');

    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

fetchData();
