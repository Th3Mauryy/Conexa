import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const OrderHistory = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [user, authLoading, navigate]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get(`/orders/user/${user._id}`);
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Procesando': 'bg-blue-100 text-blue-800 border-blue-200',
            'Enviado': 'bg-purple-100 text-purple-800 border-purple-200',
            'Entregado': 'bg-green-100 text-green-800 border-green-200',
            'Cancelada': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'Pendiente': '⏳',
            'Procesando': '📦',
            'Enviado': '🚚',
            'Entregado': '✅',
            'Cancelada': '❌'
        };
        return icons[status] || '📋';
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando órdenes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Historial de Pedidos</h1>
                    <p className="text-gray-600 mt-2">Revisa el estado de tus pedidos</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No tienes órdenes aún</h2>
                        <p className="text-gray-600 mb-6">Comienza a comprar para ver tu historial</p>
                        <button
                            onClick={() => navigate('/tienda')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Ir a la tienda
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Orden #{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(order.createdAt).toLocaleDateString('es-MX', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)} {order.status}
                                            </span>
                                            <button
                                                onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                            >
                                                {selectedOrder === order._id ? 'Ocultar detalles' : 'Ver detalles'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex -space-x-2">
                                            {order.orderItems.slice(0, 3).map((item, idx) => (
                                                <img
                                                    key={idx}
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded-full border-2 border-white object-cover"
                                                />
                                            ))}
                                            {order.orderItems.length > 3 && (
                                                <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                                    +{order.orderItems.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-800 font-medium">
                                                {order.orderItems.length} producto{order.orderItems.length !== 1 ? 's' : ''}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {order.orderItems[0].name}
                                                {order.orderItems.length > 1 && ` y ${order.orderItems.length - 1} más`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">${order.totalPrice.toFixed(2)}</p>
                                            <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                                        </div>
                                    </div>

                                    {/* Tracking Number */}
                                    {order.trackingNumber && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                            <p className="text-sm text-blue-800">
                                                <strong>Número de rastreo:</strong> {order.trackingNumber}
                                            </p>
                                        </div>
                                    )}

                                    {/* Expanded Details */}
                                    {selectedOrder === order._id && (
                                        <div className="border-t pt-4 mt-4 space-y-4">
                                            {/* Products */}
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-3">Productos</h4>
                                                <div className="space-y-2">
                                                    {order.orderItems.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-800">{item.name}</p>
                                                                <p className="text-sm text-gray-600">Cantidad: {item.qty}</p>
                                                            </div>
                                                            <p className="font-semibold text-gray-800">${(item.price * item.qty).toFixed(2)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Shipping Address */}
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-2">Dirección de Envío</h4>
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-gray-700 text-sm">
                                                        {order.shippingAddress.street} #{order.shippingAddress.extNumber}
                                                        {order.shippingAddress.intNumber && ` Int. ${order.shippingAddress.intNumber}`}<br />
                                                        {order.shippingAddress.colony}, {order.shippingAddress.city}<br />
                                                        {order.shippingAddress.state}, CP {order.shippingAddress.zipCode}<br />
                                                        {order.shippingAddress.country}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Price Breakdown */}
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-2">Desglose de Precio</h4>
                                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                                    <div className="flex justify-between text-gray-700">
                                                        <span>Subtotal</span>
                                                        <span>${order.itemsPrice.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-gray-700">
                                                        <span>Envío</span>
                                                        <span>{order.shippingPrice === 0 ? 'GRATIS' : `$${order.shippingPrice.toFixed(2)}`}</span>
                                                    </div>
                                                    <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
                                                        <span>Total</span>
                                                        <span>${order.totalPrice.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
