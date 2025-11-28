import express from 'express';
import paypalClient from '../config/paypal.js';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const router = express.Router();

// @desc    Get PayPal Client ID
// @route   GET /api/paypal/config
// @access  Public
router.get('/config', (req, res) => {
    res.json({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// @desc    Create PayPal order
// @route   POST /api/paypal/create-order
// @access  Private
router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency = 'MXN' } = req.body;

        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        // Create order request
        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: currency,
                    value: amount.toString()
                },
                description: 'Compra en Conexa Store'
            }],
            application_context: {
                brand_name: 'Conexa Store',
                landing_page: 'NO_PREFERENCE',
                user_action: 'PAY_NOW',
                return_url: `${process.env.FRONTEND_URL}/checkout/success`,
                cancel_url: `${process.env.FRONTEND_URL}/checkout`
            }
        });

        const order = await paypalClient().execute(request);

        res.json({
            orderID: order.result.id
        });
    } catch (error) {
        console.error('PayPal create order error:', error);
        res.status(500).json({
            message: 'Error creating PayPal order',
            error: error.message
        });
    }
});

// @desc    Capture PayPal order payment
// @route   POST /api/paypal/capture-order/:orderID
// @access  Private
router.post('/capture-order/:orderID', async (req, res) => {
    try {
        const { orderID } = req.params;

        if (!orderID) {
            return res.status(400).json({ message: 'Order ID is required' });
        }

        // Capture order request
        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});

        const capture = await paypalClient().execute(request);

        // Check if payment was successful
        if (capture.result.status === 'COMPLETED') {
            res.json({
                success: true,
                orderID: capture.result.id,
                payerID: capture.result.payer.payer_id,
                payerEmail: capture.result.payer.email_address,
                payerName: capture.result.payer.name.given_name + ' ' + capture.result.payer.name.surname,
                amount: capture.result.purchase_units[0].payments.captures[0].amount.value,
                currency: capture.result.purchase_units[0].payments.captures[0].amount.currency_code,
                captureID: capture.result.purchase_units[0].payments.captures[0].id,
                status: capture.result.status
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment not completed',
                status: capture.result.status
            });
        }
    } catch (error) {
        console.error('PayPal capture order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error capturing PayPal payment',
            error: error.message
        });
    }
});

export default router;
