import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product, addToCart }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const isLiked = isInWishlist(product._id);

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLiked) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    // Get all unique images for the product (avoiding duplicates)
    const allImages = product.images && product.images.length > 0
        ? [...new Set(product.images)] // Remove duplicates using Set
        : [product.image];

    const hasMultipleImages = allImages.length > 1;

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isTransitioning) return;

        setIsTransitioning(true);
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isTransitioning) return;

        setIsTransitioning(true);
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
        setTimeout(() => setIsTransitioning(false), 300);
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden transform hover:-translate-y-1 relative">
            <Link to={`/product/${product._id}`} className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center overflow-hidden cursor-pointer">
                {/* Wishlist Button */}
                <button
                    onClick={toggleWishlist}
                    className={`absolute top-3 right-3 z-20 p-2 rounded-full shadow-sm transition-all duration-300 ${isLiked ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'}`}
                    title={isLiked ? "Eliminar de favoritos" : "Añadir a favoritos"}
                >
                    <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                {/* Image with smooth transition */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <img
                        key={currentImageIndex}
                        src={allImages[currentImageIndex]}
                        alt={product.name}
                        className={`max-h-full max-w-full object-contain mix-blend-multiply transform transition-all duration-500 group-hover:scale-110 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                            }`}
                    />
                </div>

                {/* Carousel Navigation Arrows */}
                {hasMultipleImages && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 rounded-full p-2.5 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110 active:scale-95"
                            aria-label="Previous image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 rounded-full p-2.5 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110 active:scale-95"
                            aria-label="Next image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Modern Image Indicators */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {allImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (!isTransitioning) {
                                            setIsTransitioning(true);
                                            setCurrentImageIndex(index);
                                            setTimeout(() => setIsTransitioning(false), 300);
                                        }
                                    }}
                                    className={`transition-all duration-300 rounded-full ${index === currentImageIndex
                                        ? 'bg-blue-600 w-8 h-2'
                                        : 'bg-white/60 hover:bg-white/80 w-2 h-2'
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {product.countInStock === 0 && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-full font-bold text-sm shadow-2xl transform -rotate-12 border-2 border-white">AGOTADO</span>
                    </div>
                )}
            </Link>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg">
                        {product.category}
                    </span>
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">{product.brand}</span>
                </div>

                <Link to={`/product/${product._id}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 h-[3.5rem]">
                        {product.name}
                    </h3>
                </Link>

                <p
                    className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1 h-[4.5rem] overflow-hidden"
                    title={product.description}
                >
                    {product.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            ${product.price.toLocaleString()}
                        </span>
                    </div>
                    {product.countInStock > 0 ? (
                        <button
                            onClick={() => addToCart(product)}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl shadow-lg hover:shadow-blue-200/50 transition-all duration-200 transform hover:scale-110 active:scale-95"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    ) : (
                        <span className="text-sm font-bold text-red-500 bg-red-50 px-4 py-2 rounded-full">Sin Stock</span>
                    )}
                </div>
                {product.countInStock > 0 && product.countInStock <= 5 && (
                    <p className="text-xs text-orange-500 font-medium mt-3 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        ¡Solo quedan {product.countInStock} unidades!
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
