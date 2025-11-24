import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const { data } = await api.get(`/wishlist/${user._id}`);
            // Ensure data.products is an array, default to empty if null/undefined
            setWishlist(data.products || []);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const addToWishlist = async (product) => {
        if (!user) {
            toast.info('Inicia sesión para guardar favoritos');
            return;
        }
        try {
            // Optimistic update
            const isAlreadyInWishlist = wishlist.some(p => p._id === product._id);
            if (isAlreadyInWishlist) {
                toast.info('Ya está en tu lista de deseos');
                return;
            }

            setWishlist([...wishlist, product]);
            await api.post(`/wishlist/${user._id}/${product._id}`);
            toast.success('Añadido a favoritos ❤️');
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            toast.error('Error al añadir a favoritos');
            fetchWishlist(); // Revert on error
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!user) return;
        try {
            // Optimistic update
            setWishlist(wishlist.filter(p => p._id !== productId));
            await api.delete(`/wishlist/${user._id}/${productId}`);
            toast.success('Eliminado de favoritos');
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('Error al eliminar de favoritos');
            fetchWishlist(); // Revert on error
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(p => p._id === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            loading
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
