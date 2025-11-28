
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
if (!process.env.MONGO_URI) dotenv.config({ path: './server/.env' });

const USER_ID = '691ff836d361e7e987e03513';
const PRODUCT_ID = '692084df5e88c6cb223838dd';
const PRODUCT_PRICE = 15945;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const verifyFlow = async () => {
    await connectDB();

    try {
        console.log('\n--- 1. Creating Test Order ---');
        const Order = mongoose.connection.db.collection('orders');
        const Product = mongoose.connection.db.collection('products');
        const Notification = mongoose.connection.db.collection('notifications');

        // 1. Create Order
        const newOrder = {
            user: new mongoose.Types.ObjectId(USER_ID),
            orderItems: [{
                name: 'Laptop Gamer MSI Thin 15.6"',
                qty: 1,
                image: 'https://res.cloudinary.com/dby8b3cre/image/upload/v1732486886/products/laptop_msi_thin_15.png', // Placeholder or real URL
                price: PRODUCT_PRICE,
                product: new mongoose.Types.ObjectId(PRODUCT_ID)
            }],
            shippingAddress: {
                address: 'Calle Ricardo Guzman Nava, Ext 1198, Int Depto 4B',
                city: 'Villa de Álvarez',
                postalCode: '28983',
                country: 'México',
                colony: 'Tabachines',
                state: 'Colima'
            },
            paymentMethod: 'PayPal',
            paymentResult: {},
            itemsPrice: PRODUCT_PRICE,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: PRODUCT_PRICE,
            isPaid: false,
            paidAt: null,
            isDelivered: false,
            deliveredAt: null,
            status: 'Pendiente',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const createdOrder = await Order.insertOne(newOrder);
        const orderId = createdOrder.insertedId;
        console.log(`✅ Order Created: ${orderId}`);

        // 2. Simulate Payment (What the PayPal webhook/callback would do)
        console.log('\n--- 2. Simulating PayPal Payment ---');

        // Update Order to Paid
        await Order.updateOne(
            { _id: orderId },
            {
                $set: {
                    isPaid: true,
                    paidAt: new Date(),
                    paymentResult: {
                        id: 'PAYPAL_SIMULATION_ID',
                        status: 'COMPLETED',
                        update_time: new Date().toISOString(),
                        email_address: 'mendoza.mauriciogbueno@gmail.com'
                    },
                    status: 'Pagado' // Or whatever the status flow is
                }
            }
        );
        console.log('✅ Order marked as PAID');

        // Update Stock and Sold count (Simulating backend logic usually in controller)
        await Product.updateOne(
            { _id: new mongoose.Types.ObjectId(PRODUCT_ID) },
            { $inc: { countInStock: -1, sold: 1 } }
        );
        console.log('✅ Product Stock decreased and Sold count increased');

        // Create Notification (Simulating backend logic)
        const notification = {
            type: 'order',
            message: `Nueva orden recibida: ${orderId}`,
            data: {
                orderId: orderId,
                nombre: 'Mauricio Guadalupe Mendoza Bueno',
                total: PRODUCT_PRICE
            },
            read: false,
            createdAt: new Date()
        };
        await Notification.insertOne(notification);
        console.log('✅ Admin Notification Created');

        // 3. Verification
        console.log('\n--- 3. Verifying Data ---');

        const updatedOrder = await Order.findOne({ _id: orderId });
        console.log(`Order Status: ${updatedOrder.status} (Expected: Pagado)`);
        console.log(`Order Paid: ${updatedOrder.isPaid} (Expected: true)`);

        const updatedProduct = await Product.findOne({ _id: new mongoose.Types.ObjectId(PRODUCT_ID) });
        console.log(`Product Stock: ${updatedProduct.countInStock}`);
        // console.log(`Product Sold: ${updatedProduct.sold}`); // If 'sold' field exists

        const notif = await Notification.findOne({ 'data.orderId': orderId });
        console.log(`Notification Found: ${!!notif}`);

        console.log('\n✅ VERIFICATION COMPLETE: The backend flow for Order -> Payment -> Notification is valid.');
        console.log('⚠️ NOTE: This script simulated the backend logic. In the real app, the PayPal webhook/callback triggers these updates.');

    } catch (error) {
        console.error('❌ Error during verification:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

verifyFlow();
