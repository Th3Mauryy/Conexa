import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';

dotenv.config();

const simulatePayment = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find the most recent unpaid order
        const order = await Order.findOne({ isPaid: false }).sort({ createdAt: -1 });

        if (!order) {
            console.log('No unpaid orders found.');
            process.exit();
        }

        console.log(`Found Order ID: ${order._id}`);
        console.log(`Current Status: Paid=${order.isPaid}, Status=${order.status}`);

        // Simulate Payment
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: 'SIMULATED_PAYMENT_ID',
            status: 'COMPLETED',
            update_time: new Date().toISOString(),
            email_address: 'simulated@example.com'
        };

        // Update status to 'Procesando' if it was 'Pendiente'
        if (order.status === 'Pendiente') {
            order.status = 'Procesando';
        }

        await order.save();

        console.log('-----------------------------------');
        console.log('PAYMENT SIMULATED SUCCESSFULLY');
        console.log('-----------------------------------');
        console.log(`Order ${order._id} is now PAID.`);
        console.log(`New Status: ${order.status}`);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

simulatePayment();
