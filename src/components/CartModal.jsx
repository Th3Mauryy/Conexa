import React from 'react';
import { FaTrash, FaPlus, FaMinus, FaTimes } from 'react-icons/fa';
import { useCart } from '../hooks/useCart';

const CartModal = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  if (!isOpen) return null;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-morado-600 to-azul-cielo-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">🛒 Tu Carrito</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-300"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-morado-700 mb-2">Tu carrito está vacío</h3>
              <p className="text-morado-600">¡Agrega algunos productos increíbles!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 bg-hueso-50 rounded-2xl p-4">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  
                  <div className="flex-1">
                    <p className="text-sm text-azul-cielo-600 font-medium">{item.marca}</p>
                    <h4 className="font-bold text-morado-700">{item.nombre}</h4>
                    <p className="text-lg font-bold text-azul-cielo-600">
                      ${item.precio.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="bg-morado-100 hover:bg-morado-200 text-morado-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    
                    <span className="w-8 text-center font-bold text-morado-700">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="bg-azul-cielo-100 hover:bg-azul-cielo-200 text-azul-cielo-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full transition-colors duration-300"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t border-hueso-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-morado-700">Total:</span>
              <span className="text-2xl font-bold text-azul-cielo-600">
                ${cart.total.toLocaleString()}
              </span>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={clearCart}
                className="flex-1 bg-hueso-200 hover:bg-hueso-300 text-morado-700 py-3 rounded-2xl font-bold transition-colors duration-300"
              >
                Vaciar Carrito
              </button>
              
              <button className="flex-1 bg-gradient-to-r from-azul-cielo-500 to-azul-cielo-600 hover:from-azul-cielo-600 hover:to-azul-cielo-700 text-white py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Proceder al Pago
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;