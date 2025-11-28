import mongoose from 'mongoose';

const userNotificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['order_created', 'payment_reminder', 'payment_confirmed', 'order_shipped', 'order_delivered', 'order_cancelled', 'rate_product', 'order_shipping'],
        default: 'order_created'
    },
    message: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        default: {}
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const UserNotification = mongoose.model('UserNotification', userNotificationSchema);

export default UserNotification;
