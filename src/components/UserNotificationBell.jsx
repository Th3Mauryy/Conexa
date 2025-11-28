import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReviewModal from './ReviewModal';

const UserNotificationBell = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Review Modal State
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedProductForReview, setSelectedProductForReview] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        if (user && !user.isAdmin) {
            fetchNotifications();
            // Poll every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/user-notifications');
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/user-notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/user-notifications/read-all');
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            markAsRead(notification._id);
        }

        if (notification.type === 'rate_product') {
            try {
                // Check if already reviewed
                const { data: reviews } = await api.get(`/reviews/${notification.data.productId}`);
                const hasReviewed = reviews.some(review => review.user._id === user._id || review.user === user._id);

                if (hasReviewed) {
                    toast.info('¡Ya has calificado este producto! Gracias por tu opinión.');
                    setIsOpen(false);
                    return;
                }

                setSelectedProductForReview({
                    productId: notification.data.productId,
                    name: notification.data.productName,
                    image: notification.data.image,
                    userId: user._id
                });
                setSelectedOrderId(notification.data.orderId);
                setIsReviewModalOpen(true);
                setIsOpen(false); // Close dropdown
            } catch (error) {
                console.error('Error checking reviews:', error);
                // If error checking, still allow opening modal or show error?
                // Better to fail safe and let them try, or show error.
                // Let's let them try, the backend will block it anyway if duplicate (though backend returns 400)
                setSelectedProductForReview({
                    productId: notification.data.productId,
                    name: notification.data.productName,
                    image: notification.data.image,
                    userId: user._id
                });
                setSelectedOrderId(notification.data.orderId);
                setIsReviewModalOpen(true);
                setIsOpen(false);
            }
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'order_created':
                return '🛒';
            case 'payment_confirmed':
                return '✅';
            case 'payment_reminder':
                return '⏰';
            case 'order_shipped':
                return '🚚';
            case 'order_delivered':
                return '📦';
            case 'order_cancelled':
                return '❌';
            case 'rate_product':
                return '⭐';
            default:
                return '📬';
        }
    };

    if (!user || user.isAdmin) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative bg-white text-gray-600 p-2.5 rounded-full hover:bg-gray-50 hover:text-blue-500 transition-all duration-300 shadow-sm border border-gray-200 group"
                title="Notificaciones"
            >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-900">Notificaciones</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Marcar todas como leídas
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p>No tienes notificaciones</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(notification.createdAt).toLocaleString('es-MX', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            {notification.data?.orderId && notification.type !== 'rate_product' && (
                                                <Link
                                                    to="/order-history"
                                                    className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Ver pedidos →
                                                </Link>
                                            )}
                                            {notification.type === 'rate_product' && (
                                                <span className="text-xs text-yellow-600 font-bold mt-1 inline-block">
                                                    ¡Calificar ahora! →
                                                </span>
                                            )}
                                        </div>
                                        {!notification.read && (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                            <Link
                                to="/order-history"
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium block text-center"
                                onClick={() => setIsOpen(false)}
                            >
                                Ver historial de pedidos →
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                product={selectedProductForReview}
                orderId={selectedOrderId}
            />
        </div>
    );
};

export default UserNotificationBell;
