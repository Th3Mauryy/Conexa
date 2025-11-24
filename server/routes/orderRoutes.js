import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import UserNotification from '../models/UserNotification.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No hay items en la orden' });
        return;
    } else {
        try {
            // 1. Verificar stock y restar cantidad
            for (const item of orderItems) {
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error(`Producto no encontrado: ${item.name}`);
                }
                if (product.countInStock < item.qty) {
                    throw new Error(`Stock insuficiente para: ${item.name}`);
                }
                product.countInStock = product.countInStock - item.qty;
                await product.save();
            }

            // 2. Crear la orden
            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const createdOrder = await order.save();

            // 3. Crear notificación para el admin
            try {
                await Notification.create({
                    type: 'order',
                    message: `Nueva orden #${createdOrder._id.toString().slice(-6)} - ${req.user.name}`,
                    data: {
                        orderId: createdOrder._id,
                        nombre: req.user.name,
                        telefono: req.user.phone || 'No proporcionado',
                        correo: req.user.email,
                        total: totalPrice,
                        paymentMethod: paymentMethod,
                        items: orderItems.length,
                        direccion: `${shippingAddress.street} ${shippingAddress.extNumber}, ${shippingAddress.city}, ${shippingAddress.state}`
                    }
                });
            } catch (notifError) {
                console.error('Error creando notificación:', notifError);
            }

            // 4. Enviar email de confirmación
            try {
                const message = `
                    <h1>¡Gracias por tu compra, ${req.user.name}!</h1>
                    <p>Hemos recibido tu orden #${createdOrder._id}.</p>
                    <h2>Detalles del pedido:</h2>
                    <ul>
                        ${orderItems.map(item => `<li>${item.name} x ${item.qty} - $${item.price}</li>`).join('')}
                    </ul>
                    <p><strong>Total: $${totalPrice}</strong></p>
                    <p>Te notificaremos cuando tu pedido sea enviado.</p>
                `;

                await sendEmail({
                    email: req.user.email,
                    subject: 'Confirmación de Orden - Conexa Store',
                    html: message
                });
            } catch (emailError) {
                console.error('Error enviando email de confirmación:', emailError);
                // No fallamos la orden si el email falla, solo logueamos
            }

            // 5. Crear notificación para el usuario
            try {
                await UserNotification.create({
                    user: req.user._id,
                    type: 'order_created',
                    message: `Tu orden #${createdOrder._id.toString().slice(-6)} ha sido creada exitosamente`,
                    data: {
                        orderId: createdOrder._id,
                        total: totalPrice,
                        items: orderItems.length
                    }
                });
            } catch (userNotifError) {
                console.error('Error creando notificación de usuario:', userNotifError);
            }

            res.status(201).json(createdOrder);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
});

// @route   GET /api/orders/user/:userId
// @desc    Get orders by user
// @access  Public (should be Private)
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener órdenes' });
    }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener órdenes' });
    }
});

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put('/:id/pay', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.status = 'Procesando';
            order.paymentResult = {
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address
            };

            const updatedOrder = await order.save();

            // Send email to customer
            if (order.user && order.user.email) {
                try {
                    const message = `
                        <h1>✅ ¡Pago Confirmado!</h1>
                        <p>Hola ${order.user.name},</p>
                        <p>Tu pago para la orden #${order._id.toString().slice(-6)} ha sido confirmado.</p>
                        <h3>Estado: Procesando</h3>
                        <p>Estamos preparando tu pedido. Te notificaremos cuando sea enviado.</p>
                        <ul>
                            ${order.orderItems.map(item => `<li>${item.name} x ${item.qty} - $${item.price}</li>`).join('')}
                        </ul>
                        <p><strong>Total pagado: $${order.totalPrice}</strong></p>
                    `;

                    await sendEmail({
                        email: order.user.email,
                        subject: '✅ Pago Confirmado - Conexa Store',
                        html: message
                    });
                } catch (emailError) {
                    console.error('Error sending payment email:', emailError);
                }
            }

            // Create admin notification
            try {
                await Notification.create({
                    type: 'payment',
                    message: `Pago confirmado - Orden #${order._id.toString().slice(-6)}`,
                    data: {
                        orderId: order._id,
                        nombre: order.user?.name,
                        total: order.totalPrice
                    }
                });
            } catch (notifError) {
                console.error('Error creating payment notification:', notifError);
            }

            // Create user notification
            try {
                await UserNotification.create({
                    user: order.user._id,
                    type: 'payment_confirmed',
                    message: `Tu pago ha sido confirmado. Orden #${order._id.toString().slice(-6)} en proceso`,
                    data: {
                        orderId: order._id,
                        total: order.totalPrice,
                        status: 'Procesando'
                    }
                });
            } catch (userNotifError) {
                console.error('Error creating user notification:', userNotifError);
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Orden no encontrada' });
        }
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ message: 'Error al actualizar el pago' });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', async (req, res) => {
    try {
        const { status, trackingNumber } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;

            if (trackingNumber) {
                order.trackingNumber = trackingNumber;
            }

            if (status === 'Entregado') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Orden no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar estado' });
    }
});

// @route   DELETE /api/orders/:id
// @desc    Delete order
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            await order.deleteOne();
            res.json({ message: 'Orden eliminada' });
        } else {
            res.status(404).json({ message: 'Orden no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar orden' });
    }
});

export default router;
