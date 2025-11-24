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
            email: 'admin@conexa.com',
            password: 'SuperUsuariodelColimote80472!*',
            isAdmin: true,
        });

        console.log('Admin User Created Successfully!');
        console.log('Email: admin@conexa.com');
        console.log('Password: SuperUsuariodelColimote80472!*');

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

createAdmin();
