import React from 'react';
import { useCart } from '../context/CartContext';
import StoreNavbar from '../components/StoreNavbar';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <StoreNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 md:mb-8">Tu Carrito de Compras</h1>

                {cart.items.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
                        <svg className="mx-auto h-20 md:h-24 w-20 md:w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Tu carrito está vacío</h3>
                        <p className="mt-2 text-gray-500">¡Explora nuestra tienda y encuentra los mejores productos!</p>
                        <div className="mt-6">
                            <Link to="/tienda" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                Ir a la Tienda
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                        <div className="lg:col-span-8">
                            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                                <ul className="divide-y divide-gray-200">
                                    {cart.items.map((item, index) => (
                                        <li key={`${item.id}-${index}`} className="p-4 md:p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                {/* Product Image */}
                                                <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 border border-gray-200 rounded-md overflow-hidden bg-gray-50 p-2 mx-auto sm:mx-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 text-center sm:text-left">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                        <h3 className="text-base md:text-lg font-bold text-gray-900">
                                                            <Link to={`/product/${item._id || item.id}`} className="hover:text-blue-600">{item.name}</Link>
                                                        </h3>
                                                        <p className="text-lg md:text-xl font-bold text-gray-900">${item.price.toLocaleString()}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">{item.brand}</p>

                                                    {/* Actions */}
                                                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg active:bg-gray-200 transition-colors"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="px-4 py-2 text-gray-900 font-medium border-l border-r border-gray-300 min-w-[60px] text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg active:bg-gray-200 transition-colors"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center gap-1 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="bg-white shadow-sm rounded-xl p-6 lg:sticky lg:top-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Resumen del Pedido</h2>
                                <div className="flow-root">
                                    <dl className="-my-4 text-sm divide-y divide-gray-200">
                                        <div className="py-4 flex items-center justify-between">
                                            <dt className="text-gray-600">Subtotal</dt>
                                            <dd className="font-medium text-gray-900">${cart.total.toLocaleString()}</dd>
                                        </div>
                                        <div className="py-4 flex items-center justify-between">
                                            <dt className="text-gray-600">Envío</dt>
                                            <dd className="font-medium text-green-600">Gratis</dd>
                                        </div>
                                        <div className="py-4 flex items-center justify-between">
                                            <dt className="text-base font-bold text-gray-900">Total</dt>
                                            <dd className="text-xl font-extrabold text-blue-600">${cart.total.toLocaleString()}</dd>
                                        </div>
                                    </dl>
                                </div>
                                <div className="mt-8 space-y-4">
                                    <Link to="/checkout" className="block w-full">
                                        <button className="w-full bg-blue-600 border border-transparent rounded-xl shadow-sm py-3 px-4 text-base font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform active:scale-95">
                                            Proceder al Pago
                                        </button>
                                    </Link>
                                    <button
                                        onClick={clearCart}
                                        className="w-full bg-white border border-gray-300 rounded-xl shadow-sm py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:scale-95 transition-all"
                                    >
                                        Vaciar Carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
