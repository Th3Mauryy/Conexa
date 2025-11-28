import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config({ path: 'server/.env' });

const checkOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const orders = await Order.find({});
        console.log(`Found ${orders.length} orders`);

        let fixedCount = 0;
        const validStatuses = ['Pendiente', 'Procesando', 'En Reparto', 'Entregado', 'Cancelada'];

        for (const order of orders) {
            console.log(`Order #${order._id}: Status='${order.status}', User='${order.user}'`);

            if (order.status === 'Pagado') {
                console.log(`Fixing 'Pagado' status for order #${order._id} to 'Procesando'...`);
                await Order.updateOne({ _id: order._id }, { $set: { status: 'Procesando' } });
                fixedCount++;
            } else if (!validStatuses.includes(order.status)) {
                console.log(`Fixing invalid status '${order.status}' for order #${order._id} to 'Pendiente'...`);
                await Order.updateOne({ _id: order._id }, { $set: { status: 'Pendiente' } });
                fixedCount++;
            }
        }
        console.log(`Fixed ${fixedCount} orders.`);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkOrders();
