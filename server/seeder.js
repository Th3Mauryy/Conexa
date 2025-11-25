import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './db.js';

dotenv.config();

connectDB();

const createAdmin = async () => {
    try {
        // Check if admin already exists
        const userExists = await User.findOne({ email: 'admin@conexa.com' });

        if (userExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const user = await User.create({
            name: 'ConexaAdmin',
            email: process.env.ADMIN_EMAIL || 'admin@conexa.com',
            password: process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!',
            isAdmin: true,
        });

        console.log('Admin User Created Successfully!');
        console.log(`Email: ${user.email}`);

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

createAdmin();
