import express from 'express';
import UserNotification from '../models/UserNotification.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get user notifications
// @route   GET /api/user-notifications
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const notifications = await UserNotification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener notificaciones' });
    }
});

// @desc    Mark notification as read
// @route   PUT /api/user-notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
    try {
        const notification = await UserNotification.findById(req.params.id);

        if (notification && notification.user.toString() === req.user._id.toString()) {
            notification.read = true;
            await notification.save();
            res.json(notification);
        } else {
            res.status(404).json({ message: 'Notificación no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al marcar notificación' });
    }
});

// @desc    Mark all notifications as read
// @route   PUT /api/user-notifications/read-all
// @access  Private
router.put('/read-all', protect, async (req, res) => {
    try {
        await UserNotification.updateMany(
            { user: req.user._id, read: false },
            { read: true }
        );
        res.json({ message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error) {
        res.status(500).json({ message: 'Error al marcar notificaciones' });
    }
});

// @desc    Delete notification
// @route   DELETE /api/user-notifications/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const notification = await UserNotification.findById(req.params.id);

        if (notification && notification.user.toString() === req.user._id.toString()) {
            await notification.deleteOne();
            res.json({ message: 'Notificación eliminada' });
        } else {
            res.status(404).json({ message: 'Notificación no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar notificación' });
    }
});

export default router;
