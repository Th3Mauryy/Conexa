import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['service_request', 'order', 'contact'],
        default: 'service_request'
    },
    data: {
        type: Object,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
