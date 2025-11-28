import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../api';
import PayPalButton from '../components/PayPalButton';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Shipping Address State
    const [shippingAddress, setShippingAddress] = useState({
        street: user?.address?.street || '',
        extNumber: user?.address?.extNumber || '',
        intNumber: user?.address?.intNumber || '',
        colony: user?.address?.colony || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
        country: 'México',
        phone: user?.phone || ''
    });

    useEffect(() => {
        if (user && user.address) {
            setShippingAddress({
                street: user.address.street || '',
                extNumber: user.address.extNumber || '',
                intNumber: user.address.intNumber || '',
                colony: user.address.colony || '',
                city: user.address.city || '',
                state: user.address.state || '',
                zipCode: user.address.zipCode || '',
                country: 'México',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [processingPayPal, setProcessingPayPal] = useState(false);

    // Calculate prices
    const itemsPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 1000 ? 0 : 150; // Free shipping over $1000
    const totalPrice = itemsPrice + shippingPrice;

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const placeOrder = async (paypalData = null) => {
        if (!user) {
            toast.error('Debes iniciar sesión para realizar una compra');
            navigate('/login');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                user: user._id,
                userId: user._id,
                orderItems: cart.items.map(item => ({
                    product: item._id || item.id,
                    name: item.name,
                    qty: item.quantity,
                    price: item.price,
                    image: item.image
                })),
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice: parseFloat(totalPrice.toFixed(2))
            };

            // If PayPal payment, mark as paid
            if (paypalData) {
                orderData.isPaid = true;
                orderData.paidAt = Date.now();
                orderData.paymentResult = {
                    id: paypalData.orderID,
                    status: paypalData.status,
                    email_address: paypalData.payerEmail
                };
            }

            const { data } = await api.post('/orders', orderData);

            clearCart();
            toast.success('¡Orden creada exitosamente!');
            navigate('/order-history');
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error(error.response?.data?.message || 'Error al crear la orden');
        } finally {
            setLoading(false);
            setProcessingPayPal(false);
        }
    };

    const handlePayPalSuccess = async (paypalData) => {
        setProcessingPayPal(true);
        await placeOrder(paypalData);
    };

    const handlePayPalError = (error) => {
        console.error('PayPal error:', error);
        setProcessingPayPal(false);
        toast.error('Error con PayPal. Intenta de nuevo.');
    };

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
                    <button
                        onClick={() => navigate('/tienda')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Ir a la tienda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                                1
                            </div>
                            <span className="ml-2 font-medium">Dirección</span>
                        </div>
                        <div className={`w-24 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                                2
                            </div>
                            <span className="ml-2 font-medium">Pago</span>
                        </div>
                        <div className={`w-24 h-1 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                                3
                            </div>
                            <span className="ml-2 font-medium">Confirmar</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            {/* Step 1: Shipping Address */}
                            {step === 1 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Dirección de Envío</h2>
                                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Calle *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={shippingAddress.street}
                                                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">No. Ext *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={shippingAddress.extNumber}
                                                        onChange={(e) => setShippingAddress({ ...shippingAddress, extNumber: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">No. Int</label>
                                                    <input
                                                        type="text"
                                                        value={shippingAddress.intNumber}
                                                        onChange={(e) => setShippingAddress({ ...shippingAddress, intNumber: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Colonia *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={shippingAddress.colony}
                                                    onChange={(e) => setShippingAddress({ ...shippingAddress, colony: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={shippingAddress.city}
                                                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={shippingAddress.state}
                                                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={shippingAddress.zipCode}
                                                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                                                <input
                                                    type="text"
                                                    value="México"
                                                    disabled
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={shippingAddress.phone}
                                                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="10 dígitos"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium mt-6"
                                        >
                                            Continuar a Pago
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Step 2: Payment Method */}
                            {step === 2 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Método de Pago</h2>
                                    <div className="space-y-4 mb-6">
                                        <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${paymentMethod === 'Efectivo' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="Efectivo"
                                                checked={paymentMethod === 'Efectivo'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-5 h-5 text-blue-600"
                                            />
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">💵</span>
                                                    <p className="font-semibold text-gray-800">Pago en Efectivo</p>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">Paga al recibir tu pedido en tu domicilio</p>
                                            </div>
                                        </label>

                                        <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${paymentMethod === 'PayPal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="PayPal"
                                                checked={paymentMethod === 'PayPal'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-5 h-5 text-blue-600"
                                            />
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">💳</span>
                                                    <p className="font-semibold text-gray-800">PayPal</p>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">Pago seguro con tarjeta o cuenta PayPal</p>
                                            </div>
                                        </label>
                                    </div>

                                    {/* PayPal Button */}
                                    {paymentMethod === 'PayPal' ? (
                                        <div className="bg-gray-50 p-6 rounded-lg border-2 border-blue-200 mb-6">
                                            <p className="text-sm text-gray-600 mb-4 text-center">
                                                Haz clic en el botón de PayPal para completar tu pago
                                            </p>
                                            <PayPalButton
                                                amount={totalPrice.toFixed(2)}
                                                currency="MXN"
                                                onSuccess={handlePayPalSuccess}
                                                onError={handlePayPalError}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex gap-4 mt-6">
                                            <button
                                                onClick={() => setStep(1)}
                                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium"
                                                disabled={processingPayPal}
                                            >
                                                Volver
                                            </button>
                                            <button
                                                onClick={() => setStep(3)}
                                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                                                disabled={processingPayPal}
                                            >
                                                Revisar Orden
                                            </button>
                                        </div>
                                    )}

                                    {paymentMethod === 'PayPal' && (
                                        <button
                                            onClick={() => setStep(1)}
                                            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium mt-4"
                                            disabled={processingPayPal}
                                        >
                                            ← Volver a Dirección
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Step 3: Review Order */}
                            {step === 3 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Revisar Orden</h2>

                                    <div className="space-y-6">
                                        {/* Address Summary */}
                                        <div className="border-b pb-4">
                                            <h3 className="font-semibold text-gray-800 mb-2">Dirección de Envío</h3>
                                            <p className="text-gray-600 text-sm">
                                                {shippingAddress.street} #{shippingAddress.extNumber}
                                                {shippingAddress.intNumber && ` Int. ${shippingAddress.intNumber}`}<br />
                                                {shippingAddress.colony}, {shippingAddress.city}<br />
                                                {shippingAddress.state}, CP {shippingAddress.zipCode}<br />
                                                {shippingAddress.country}<br />
                                                Tel: {shippingAddress.phone}
                                            </p>
                                        </div>

                                        {/* Payment Method */}
                                        <div className="border-b pb-4">
                                            <h3 className="font-semibold text-gray-800 mb-2">Método de Pago</h3>
                                            <p className="text-gray-600 text-sm">{paymentMethod}</p>
                                        </div>

                                        {/* Products */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-4">Productos</h3>
                                            <div className="space-y-3">
                                                {cart.items.map((item) => (
                                                    <div key={item._id || item.id} className="flex items-center gap-4 border-b pb-3">
                                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-800">{item.name}</p>
                                                            <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mt-6">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium"
                                        >
                                            Regresar
                                        </button>
                                        <button
                                            onClick={placeOrder}
                                            disabled={loading}
                                            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                                        >
                                            {loading ? 'Procesando...' : 'Confirmar Pedido'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Resumen de Orden</h3>

                            <div className="space-y-3 border-b pb-4 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cart.items.length} productos)</span>
                                    <span>${itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Envío</span>
                                    <span>{shippingPrice === 0 ? 'GRATIS' : `$${shippingPrice.toFixed(2)}`}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-xl font-bold text-gray-800 mb-6">
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>

                            {shippingPrice === 0 && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                                    🎉 ¡Envío gratis en tu pedido!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
