import React, { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

/**
 * PayPal Button Component
 * @param {number} amount - Total amount to charge
 * @param {string} currency - Currency code (default: MXN)
 * @param {function} onSuccess - Callback when payment is successful
 * @param {function} onError - Callback when payment fails
 */
const PayPalButton = ({ amount, currency = 'MXN', onSuccess, onError }) => {
    const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();
    const [processing, setProcessing] = useState(false);

    // Create order on PayPal
    const createOrder = async () => {
        try {
            const response = await fetch('/api/paypal/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, currency }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error creating PayPal order');
            }

            return data.orderID;
        } catch (error) {
            console.error('Error creating PayPal order:', error);
            toast.error('Error al crear la orden de pago');
            throw error;
        }
    };

    // Capture payment after approval
    const onApprove = async (data) => {
        setProcessing(true);
        try {
            const response = await fetch(`/api/paypal/capture-order/${data.orderID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const captureData = await response.json();

            if (!response.ok || !captureData.success) {
                throw new Error(captureData.message || 'Error capturing payment');
            }

            // Call success callback with payment details
            if (onSuccess) {
                onSuccess(captureData);
            }

            setProcessing(false);
        } catch (error) {
            console.error('Error capturing PayPal payment:', error);
            toast.error('Error al procesar el pago');
            setProcessing(false);
            if (onError) {
                onError(error);
            }
        }
    };

    const onPayPalError = (err) => {
        console.error('PayPal error:', err);
        toast.error('Error con PayPal. Intenta de nuevo.');
        if (onError) {
            onError(err);
        }
    };

    if (isPending) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando PayPal...</span>
            </div>
        );
    }

    if (isRejected) {
        return (
            <div className="text-center py-4 text-red-600">
                Error al cargar PayPal. Por favor recarga la página.
            </div>
        );
    }

    if (processing) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Procesando pago...</span>
            </div>
        );
    }

    return (
        <div className="paypal-button-container">
            <PayPalButtons
                style={{
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'pay',
                }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onPayPalError}
                disabled={processing || isPending}
            />
        </div>
    );
};

export default PayPalButton;
