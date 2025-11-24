import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { type, data } = req.body;

        const notification = new Notification({
            type: type || 'service_request',
            data
        });

        const createdNotification = await notification.save();
        res.status(201).json(createdNotification);
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Error al crear la notificación' });
    }
});

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private/Admin (TODO: Add auth middleware if needed)
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find({}).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error al obtener notificaciones' });
    }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
router.put('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (notification) {
            notification.read = true;
            const updatedNotification = await notification.save();
            res.json(updatedNotification);
        } else {
            res.status(404).json({ message: 'Notificación no encontrada' });
        }
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ message: 'Error al actualizar notificación' });
    }
});

export default router;
