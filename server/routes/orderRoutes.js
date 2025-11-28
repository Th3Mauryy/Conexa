import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import UserNotification from '../models/UserNotification.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import sendEmail from '../utils/sendEmail.js';
import generateTicket from '../utils/generateTicket.js';
import sendWhatsApp from '../utils/sendWhatsApp.js';

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

            // 4. Generar PDF ticket
            let pdfBuffer = null;
            try {
                pdfBuffer = await generateTicket(createdOrder, req.user);
            } catch (pdfError) {
                console.error('Error generando PDF:', pdfError);
            }

            // 5. Enviar email de confirmación al cliente con PDF
            try {
                const message = `
                    <h1>¡Gracias por tu compra, ${req.user.name}!</h1>
                    <p>Hemos recibido tu orden #${createdOrder._id.toString().slice(-6).toUpperCase()}.</p>
                    <h2>Detalles del pedido:</h2>
                    <ul>
                        ${orderItems.map(item => `<li>${item.name} x ${item.qty} - $${item.price}</li>`).join('')}
                    </ul>
                    <p><strong>Total: $${totalPrice}</strong></p>
                    <p>Método de pago: ${paymentMethod}</p>
                    <p>Te notificaremos cuando tu pedido esté en camino.</p>
                    <p style="margin-top: 20px; color: #666;"><small>Adjunto encontrarás tu ticket de compra en formato PDF.</small></p>
                `;

                const emailOptions = {
                    email: req.user.email,
                    subject: `✅ Orden Confirmada #${createdOrder._id.toString().slice(-6).toUpperCase()} - Conexa Store`,
                    html: message
                };

                // Attach PDF if generated successfully
                if (pdfBuffer) {
                    emailOptions.attachments = [{
                        filename: `ticket_${createdOrder._id}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }];
                }

                await sendEmail(emailOptions);
            } catch (emailError) {
                console.error('Error enviando email de confirmación:', emailError);
            }

            // 6. Enviar email al admin con datos de entrega
            try {
                const adminMessage = `
                    <h1>🛒 Nueva Orden Recibida</h1>
                    <h2>Orden #${createdOrder._id.toString().slice(-6).toUpperCase()}</h2>
                    
                    <h3>👤 Datos del Cliente:</h3>
                    <ul>
                        <li><strong>Nombre:</strong> ${req.user.name}</li>
                        <li><strong>Email:</strong> ${req.user.email}</li>
                        <li><strong>Teléfono:</strong> ${req.user.phone || 'No proporcionado'}</li>
                    </ul>
                    
                    <h3>📍 Dirección de Entrega:</h3>
                    <p>
                        ${shippingAddress.street} ${shippingAddress.extNumber}${shippingAddress.intNumber ? ', Int. ' + shippingAddress.intNumber : ''}<br/>
                        ${shippingAddress.colony}, ${shippingAddress.city}<br/>
                        ${shippingAddress.state}, C.P. ${shippingAddress.zipCode}<br/>
                        ${shippingAddress.country || 'México'}
                    </p>
                    
                    <h3>📦 Productos (${orderItems.length}):</h3>
                    <ul>
                        ${orderItems.map(item => `<li>${item.name} x ${item.qty} - $${item.price}</li>`).join('')}
                    </ul>
                    
                    <h3>💰 Resumen de Pago:</h3>
                    <ul>
                        <li>Subtotal: $${itemsPrice}</li>
                        <li>Envío: $${shippingPrice}</li>
                        <li>IVA: $${taxPrice}</li>
                        <li><strong>Total: $${totalPrice}</strong></li>
                        <li>Método: ${paymentMethod === 'PayPal' ? '💳 PayPal' : '💵 Efectivo'}</li>
                    </ul>
                    
                    <p style="margin-top: 20px; padding: 10px; background: #f0f9ff; border-left: 4px solid #2563eb;">
                        Inicia sesión en el dashboard de admin para gestionar esta orden.
                    </p>
                `;

                await sendEmail({
                    email: process.env.ADMIN_EMAIL || 'mongdongo@gmail.com',
                    subject: `🛒 Nueva Orden #${createdOrder._id.toString().slice(-6).toUpperCase()} - ${req.user.name}`,
                    html: adminMessage
                });
            } catch (adminEmailError) {
                console.error('Error enviando email al admin:', adminEmailError);
            }

            // 7. Crear notificación para el usuario
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
        const order = await Order.findById(req.params.id).populate('user', 'name email phone');

        if (order) {
            const previousStatus = order.status;
            order.status = status;

            if (trackingNumber) {
                order.trackingNumber = trackingNumber;
            }

            if (status === 'Entregado') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();

            // Send notifications when status changes to "En Reparto"
            if (status === 'En Reparto' && previousStatus !== 'En Reparto' && order.user) {
                try {
                    // Email notification
                    const emailMessage = `
                        <h1>🚚 Tu pedido va en camino!</h1>
                        <p>Hola ${order.user.name},</p>
                        <p>Tu pedido #${order._id.toString().slice(-6).toUpperCase()} está en camino a tu domicilio.</p>
                        
                        <h3>📍 Dirección de entrega:</h3>
                        <p>
                            ${order.shippingAddress.street} ${order.shippingAddress.extNumber}${order.shippingAddress.intNumber ? ', Int. ' + order.shippingAddress.intNumber : ''}<br/>
                            ${order.shippingAddress.colony}, ${order.shippingAddress.city}<br/>
                            ${order.shippingAddress.state}, C.P. ${order.shippingAddress.zipCode}
                        </p>
                        
                        ${trackingNumber ? `<p><strong>Número de seguimiento:</strong> ${trackingNumber}</p>` : ''}
                        
                        <p style="margin-top: 20px; padding: 10px; background: #f0f9ff; border-left: 4px solid #2563eb;">
                            ${order.paymentMethod === 'Efectivo' ? '💵 Recuerda tener el efectivo listo al recibir tu pedido.' : '✅ Tu pago ya fue confirmado.'}
                        </p>
                        
                        <p>¡Gracias por tu compra!</p>
                    `;

                    await sendEmail({
                        email: order.user.email,
                        subject: `🚚 Tu pedido #${order._id.toString().slice(-6).toUpperCase()} va en camino - Conexa Store`,
                        html: emailMessage
                    });

                    // WhatsApp notification
                    if (order.user.phone) {
                        const whatsappMessage = `🚚 *Tu pedido va en camino!*\n\n` +
                            `Hola ${order.user.name}, tu pedido #${order._id.toString().slice(-6).toUpperCase()} está en camino.\n\n` +
                            `📍 *Dirección:* ${order.shippingAddress.street} ${order.shippingAddress.extNumber}, ${order.shippingAddress.city}\n\n` +
                            `${order.paymentMethod === 'Efectivo' ? '💵 Recuerda tener el efectivo listo ($' + order.totalPrice + ')' : '✅ Pago confirmado'}\n\n` +
                            `¡Gracias por tu compra en Conexa Store!`;

                        await sendWhatsApp(order.user.phone, whatsappMessage);
                    }

                    // Create user notification
                    await UserNotification.create({
                        user: order.user._id,
                        type: 'order_shipping',
                        message: `Tu pedido #${order._id.toString().slice(-6)} está en camino`,
                        data: {
                            orderId: order._id,
                            status: 'En Reparto'
                        }
                    });
                } catch (notifError) {
                    console.error('Error sending shipping notifications:', notifError);
                }
            }

            // Send notification when delivered
            if (status === 'Entregado' && previousStatus !== 'Entregado' && order.user) {
                try {
                    // 1. Notify order delivery
                    await UserNotification.create({
                        user: order.user._id,
                        type: 'order_delivered',
                        message: `Tu pedido #${order._id.toString().slice(-6)} ha sido entregado`,
                        data: {
                            orderId: order._id,
                            status: 'Entregado',
                            deliveredAt: order.deliveredAt
                        }
                    });

                    // 2. Create "Rate Product" notifications for EACH item
                    for (const item of order.orderItems) {
                        await UserNotification.create({
                            user: order.user._id,
                            type: 'rate_product',
                            message: `¡Tu producto ${item.name} ha sido entregado! Califícalo ahora.`,
                            data: {
                                productId: item.product,
                                productName: item.name,
                                image: item.image,
                                orderId: order._id
                            }
                        });
                    }

                } catch (notifError) {
                    console.error('Error creating delivery/review notifications:', notifError);
                }
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Orden no encontrada' });
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error al actualizar estado' });
    }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error al obtener órdenes' });
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
