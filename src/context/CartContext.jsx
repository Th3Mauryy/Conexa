import React, { useReducer, useEffect, createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return action.payload;

    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
          total: state.total + action.payload.price
        };
      }
    }

    case 'REMOVE_FROM_CART': {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove.price * itemToRemove.quantity)
      };
    }

    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload.id);
      const oldQuantity = item.quantity;
      const newQuantity = action.payload.quantity;

      if (newQuantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id),
          total: state.total - (item.price * oldQuantity)
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: newQuantity }
            : item
        ),
        total: state.total + (item.price * (newQuantity - oldQuantity))
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      try {
        const savedCart = localStorage.getItem(`conexa-cart-${user._id}`);
        if (savedCart) {
          dispatch({ type: 'SET_CART', payload: JSON.parse(savedCart) });
        } else {
          dispatch({ type: 'CLEAR_CART' });
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        dispatch({ type: 'CLEAR_CART' });
      }
    } else {
      // Clear cart on logout
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user]);

  // Save cart when it changes
  useEffect(() => {
    if (user && cart.items.length >= 0) {
      localStorage.setItem(`conexa-cart-${user._id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product) => {
    if (!user) {
      alert('Por favor inicia sesión para añadir productos al carrito');
      return;
    }
    if (user.isAdmin) {
      alert('Los administradores no pueden realizar compras.');
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
