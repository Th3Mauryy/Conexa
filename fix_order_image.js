
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
if (!process.env.MONGO_URI) dotenv.config({ path: './server/.env' });

const USER_ID = '691ff836d361e7e987e03513';
const CORRECT_IMAGE = 'https://res.cloudinary.com/dz6q5evcy/image/upload/v1763738843/conexa_products/ac7bh6eod20qfyvgkhv9.webp';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const fixImage = async () => {
    await connectDB();

    try {
        const Order = mongoose.connection.db.collection('orders');

        // Find ALL orders for this user
        const orders = await Order.find({ user: new mongoose.Types.ObjectId(USER_ID) }).toArray();

        if (orders.length > 0) {
            console.log(`Found ${orders.length} orders for user.`);

            let updatedCount = 0;

            for (const order of orders) {
                let needsUpdate = false;
                // Update the image in orderItems
                const updatedItems = order.orderItems.map(item => {
                    if (item.name.includes('Laptop Gamer MSI Thin') && item.image !== CORRECT_IMAGE) {
                        needsUpdate = true;
                        return { ...item, image: CORRECT_IMAGE };
                    }
                    return item;
                });

                if (needsUpdate) {
                    await Order.updateOne(
                        { _id: order._id },
                        { $set: { orderItems: updatedItems } }
                    );
                    console.log(`✅ Updated Order: ${order._id}`);
                    updatedCount++;
                }
            }

            if (updatedCount === 0) {
                console.log('No orders needed updating.');
            } else {
                console.log(`✅ Successfully updated ${updatedCount} orders.`);
            }

        } else {
            console.log('❌ No orders found for this user.');
        }

    } catch (error) {
        console.error('❌ Error updating images:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

fixImage();
