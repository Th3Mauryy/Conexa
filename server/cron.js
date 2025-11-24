import cron from 'node-cron';
import Order from './models/Order.js';
import Product from './models/Product.js';
import Notification from './models/Notification.js';
import UserNotification from './models/UserNotification.js';
import sendEmail from './utils/sendEmail.js';

const startCronJobs = () => {
    // Run every hour: Check for expired orders (24h+)
    cron.schedule('0 * * * *', async () => {
        console.log('Running Order Cleanup Job...');
        try {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            const expiredOrders = await Order.find({
                status: 'Pendiente',
                isPaid: false,
                createdAt: { $lt: twentyFourHoursAgo }
            }).populate('user', 'email name');

            if (expiredOrders.length === 0) {
                console.log('No expired orders found.');
                return;
            }

            console.log(`Found ${expiredOrders.length} expired orders. Processing...`);

            for (const order of expiredOrders) {
                // 1. Restore stock
                for (const item of order.orderItems) {
                    const product = await Product.findById(item.product);
                    if (product) {
                        product.countInStock += item.qty;
                        await product.save();
                    }
                }

                // 2. Mark order as Cancelled
                order.status = 'Cancelada';
                await order.save();

                // 3. Notify user via email
                if (order.user && order.user.email) {
                    const message = `
                        <h1>Orden Cancelada por Expiración</h1>
                        <p>Hola ${order.user.name},</p>
                        <p>Tu orden #${order._id} ha sido cancelada automáticamente porque no se recibió el pago en 24 horas.</p>
                        <p>Si aún deseas los productos, por favor realiza una nueva compra.</p>
                    `;

                    try {
                        await sendEmail({
                            email: order.user.email,
                            subject: 'Orden Cancelada - Conexa Store',
                            html: message
                        });
                    } catch (emailError) {
                        console.error(`Failed to send email for order ${order._id}:`, emailError);
                    }

                    // Create user notification
                    try {
                        await UserNotification.create({
                            user: order.user._id,
                            type: 'order_cancelled',
                            message: `Tu orden #${order._id.toString().slice(-6)} ha sido cancelada por falta de pago`,
                            data: {
                                orderId: order._id,
                                reason: 'Pago no recibido en 24 horas'
                            }
                        });
                    } catch (userNotifError) {
                        console.error('Error creating user notification:', userNotifError);
                    }
                }
            }
            console.log('Order Cleanup Job Completed.');

        } catch (error) {
            console.error('Error in Order Cleanup Job:', error);
        }
    });

    // Run every hour: Send payment reminders (14h old, 10h before cancellation)
    cron.schedule('0 * * * *', async () => {
        console.log('Running Payment Reminder Job...');
        try {
            const fourteenHoursAgo = new Date(Date.now() - 14 * 60 * 60 * 1000);
            const thirteenHoursAgo = new Date(Date.now() - 13 * 60 * 60 * 1000);

            // Find orders between 13-14 hours old (reminder window)
            const ordersNeedingReminder = await Order.find({
                status: 'Pendiente',
                isPaid: false,
                createdAt: {
                    $gte: thirteenHoursAgo,
                    $lt: fourteenHoursAgo
                },
                reminderSent: { $ne: true } // Only if reminder not sent yet
            }).populate('user', 'email name phone');

            if (ordersNeedingReminder.length === 0) {
                console.log('No orders need payment reminder.');
                return;
            }

            console.log(`Sending payment reminder for ${ordersNeedingReminder.length} order(s)...`);

            for (const order of ordersNeedingReminder) {
                if (order.user) {
                    // Send email reminder
                    const message = `
                        <h1>⏰ Recordatorio de Pago</h1>
                        <p>Hola ${order.user.name},</p>
                        <p>Tu orden #${order._id.toString().slice(-6)} está pendiente de pago.</p>
                        <p><strong>⚠️ Faltan aproximadamente 10 horas</strong> para que tu orden sea cancelada automáticamente.</p>
                        <h3>Detalles de tu pedido:</h3>
                        <ul>
                            ${order.orderItems.map(item => `<li>${item.name} x ${item.qty} - $${item.price}</li>`).join('')}
                        </ul>
                        <p><strong>Total: $${order.totalPrice}</strong></p>
                        <p>Por favor, realiza tu pago lo antes posible para procesar tu pedido.</p>
                    `;

                    try {
                        await sendEmail({
                            email: order.user.email,
                            subject: '⏰ Recordatorio: Tu pedido está pendiente de pago - Conexa',
                            html: message
                        });

                        // Mark reminder as sent
                        order.reminderSent = true;
                        await order.save();

                        // Create user notification
                        await UserNotification.create({
                            user: order.user._id,
                            type: 'payment_reminder',
                            message: `⏰ Tu orden #${order._id.toString().slice(-6)} está pendiente de pago. Faltan 10 horas para su cancelación`,
                            data: {
                                orderId: order._id,
                                total: order.totalPrice,
                                hoursRemaining: 10
                            }
                        });

                        console.log(`Reminder sent to ${order.user.email} for order ${order._id}`);
                    } catch (emailError) {
                        console.error(`Failed to send reminder for order ${order._id}:`, emailError);
                    }
                }
            }
            console.log('Payment Reminder Job Completed.');

        } catch (error) {
            console.error('Error in Payment Reminder Job:', error);
        }
    });
};

export default startCronJobs;
