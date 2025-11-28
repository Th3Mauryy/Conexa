
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
if (!process.env.MONGO_URI) dotenv.config({ path: './server/.env' });

const PRODUCT_ID = '692084df5e88c6cb223838dd';
const USER_ID = '691ff836d361e7e987e03513';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const checkImages = async () => {
    await connectDB();

    try {
        const Product = mongoose.connection.db.collection('products');
        const Order = mongoose.connection.db.collection('orders');

        const product = await Product.findOne({ _id: new mongoose.Types.ObjectId(PRODUCT_ID) });
        console.log('--- REAL PRODUCT ---');
        console.log('Name:', product ? product.name : 'Not Found');
        console.log('Image:', product ? product.image : 'Not Found');

        const order = await Order.findOne({ user: new mongoose.Types.ObjectId(USER_ID) }, { sort: { createdAt: -1 } });
        console.log('\n--- LATEST ORDER ---');
        console.log('ID:', order ? order._id : 'Not Found');
        if (order && order.orderItems && order.orderItems.length > 0) {
            console.log('Order Item Name:', order.orderItems[0].name);
            console.log('Order Item Image:', order.orderItems[0].image);
        } else {
            console.log('No items in order');
        }

    } catch (error) {
        console.error('❌ Error checking images:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

checkImages();
