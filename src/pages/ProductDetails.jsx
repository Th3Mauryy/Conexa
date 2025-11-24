import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StoreNavbar from '../components/StoreNavbar';
import { toast } from 'react-toastify';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');

    // Review form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchProductAndReviews = async () => {
            try {
                setLoading(true);
                // Fetch product
                const { data: productData } = await api.get(`/products/${id}`);
                setProduct(productData);
                setMainImage(productData.image);

                // Fetch reviews
                const { data: reviewsData } = await api.get(`/reviews/${id}`);
                setReviews(reviewsData);

                // Fetch related products
                const { data: allProducts } = await api.get('/products');
                const related = allProducts
                    .filter(p => p.category === productData.category && p._id !== productData._id)
                    .slice(0, 4);
                setRelatedProducts(related);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching details:', error);
                setLoading(false);
            }
        };

        fetchProductAndReviews();
        window.scrollTo(0, 0);
    }, [id]);

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Debes iniciar sesión para escribir una reseña');
            return;
        }
        try {
            setSubmittingReview(true);
            await api.post(`/reviews/${id}`, {
                userId: user._id,
                rating,
                comment
            });
            toast.success('Reseña enviada exitosamente');
            setComment('');
            setRating(5);

            // Refetch reviews
            const { data: newReviews } = await api.get(`/reviews/${id}`);
            setReviews(newReviews);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al enviar reseña');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600"></div>
        </div>
    );

    if (!product) return <div className="text-center py-20">Producto no encontrado</div>;

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <StoreNavbar onSearch={(term) => navigate('/tienda')} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <nav className="flex mb-8 text-sm text-gray-500">
                    <Link to="/tienda" className="hover:text-blue-600">Tienda</Link>
                    <span className="mx-2">/</span>
                    <Link to={`/tienda?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600">{product.category}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </nav>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center h-64 md:h-96">
                                <img src={mainImage} alt={product.name} className="object-contain h-full w-full p-4" />
                            </div>
                            <div className="grid grid-cols-4 gap-2 md:gap-4">
                                {(product.images || [product.image]).slice(0, 4).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMainImage(img)}
                                        className={`border-2 rounded-lg overflow-hidden h-16 md:h-20 ${mainImage === img ? 'border-blue-600' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <div className="mb-2">
                                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">{product.brand}</span>
                            </div>
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{product.name}</h1>

                            <div className="flex items-center mb-6">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-5 h-5 ${i < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="ml-2 text-gray-500 text-sm">({reviews.length} reseñas)</span>
                            </div>

                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                {product.description}
                            </p>

                            <div className="mt-auto">
                                <div className="flex items-baseline mb-6">
                                    <span className="text-4xl font-extrabold text-gray-900">${product.price.toLocaleString()}</span>
                                    <span className="ml-2 text-gray-500 text-sm">MXN</span>
                                </div>

                                <div className="flex items-center space-x-4 mb-8">
                                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.countInStock > 0 ? 'En Stock' : 'Agotado'}
                                    </div>
                                    {product.countInStock > 0 && product.countInStock <= 5 && (
                                        <span className="text-orange-600 text-sm font-medium">¡Solo quedan {product.countInStock}!</span>
                                    )}
                                </div>

                                <button
                                    onClick={() => addToCart(product)}
                                    disabled={product.countInStock === 0}
                                    className={`w-full py-4 px-8 rounded-xl shadow-lg text-lg font-bold text-white transition-all transform hover:-translate-y-1 ${product.countInStock > 0
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-blue-500/30'
                                        : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {product.countInStock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Reviews List */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reseñas de Clientes</h2>
                        {reviews.length === 0 ? (
                            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                <p className="text-gray-500">No hay reseñas aún. ¡Sé el primero en opinar!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reviews.map((review) => (
                                    <div key={review._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                                    {review.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{review.name}</p>
                                                    <div className="flex text-yellow-400 text-sm">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-400">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Write Review Form */}
                    <div>
                        <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Escribe una reseña</h3>
                            {user ? (
                                <form onSubmit={submitReviewHandler}>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className={`text-2xl focus:outline-none transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Comentario</label>
                                        <textarea
                                            rows="4"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="¿Qué te pareció el producto?"
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                                    >
                                        {submittingReview ? 'Enviando...' : 'Publicar Reseña'}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <p className="text-gray-600 mb-4">Inicia sesión para escribir una reseña</p>
                                    <Link to="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                        Ir al Login
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16 border-t pt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Productos Relacionados</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((related) => (
                                <Link to={`/product/${related._id}`} key={related._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                                    <div className="h-48 bg-gray-50 p-4 flex items-center justify-center">
                                        <img src={related.image} alt={related.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 truncate">{related.name}</h3>
                                        <p className="text-blue-600 font-bold mt-2">${related.price.toLocaleString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
