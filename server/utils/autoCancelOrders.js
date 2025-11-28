import Order from '../models/Order.js';

/**
 * Auto-cancel orders that are pending for more than 48 hours
 */
export const autoCancelPendingOrders = async () => {
    try {
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

        const result = await Order.updateMany(
            {
                status: { $in: ['Pendiente', 'Procesando'] },
                createdAt: { $lt: fortyEightHoursAgo },
                isPaid: false
            },
            {
                $set: { status: 'Cancelada' }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`✅ Auto-canceled ${result.modifiedCount} orders older than 48 hours`);
        }

        return result.modifiedCount;
    } catch (error) {
        console.error('Error auto-canceling orders:', error);
        return 0;
    }
};

/**
 * Schedule to run every hour
 */
export const startAutoCancelJob = () => {
    // Run immediately on start
    autoCancelPendingOrders();

    // Then run every hour
    setInterval(() => {
        autoCancelPendingOrders();
    }, 60 * 60 * 1000); // Every hour

    console.log('📅 Auto-cancel job started (runs every hour)');
};
