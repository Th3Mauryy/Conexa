import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import StoreNavbar from '../components/StoreNavbar';
import ProductCard from '../components/ProductCard';

const Tienda = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);

        // Extract unique categories
        const uniqueCategories = ['Todas', ...new Set(data.map(p => p.category))];
        setCategories(uniqueCategories);

        // Check for category query param
        const searchParams = new URLSearchParams(location.search);
        const categoryParam = searchParams.get('category');

        if (categoryParam) {
          setSelectedCategory(categoryParam);
          const filtered = data.filter(p => p.category === categoryParam);
          setFilteredProducts(filtered);
        } else {
          setSelectedCategory('Todas');
          setFilteredProducts(data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [location.search]);

  const handleSearch = (term) => {
    const filtered = products.filter(product =>
      (selectedCategory === 'Todas' || product.category === selectedCategory) &&
      (product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.brand.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase()))
    );
    applySort(filtered, sortOption);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const filtered = category === 'Todas'
      ? products
      : products.filter(p => p.category === category);

    setFilteredProducts(filtered);
    // Update URL without reloading
    const newUrl = category === 'Todas' ? '/tienda' : `/tienda?category=${encodeURIComponent(category)}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    applySort(filteredProducts, option);
  };

  const applySort = (list, option) => {
    let sorted = [...list];
    if (option === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (option === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (option === 'stock-asc') {
      sorted.sort((a, b) => a.countInStock - b.countInStock);
    }
    setFilteredProducts(sorted);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-cyan-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <StoreNavbar onSearch={handleSearch} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-8 md:py-16 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight">Tecnología que Impulsa tu Mundo</h2>
          <p className="text-base md:text-xl text-blue-100 max-w-2xl mx-auto font-light">Encuentra los mejores equipos de cómputo, seguridad y energía con la garantía de calidad Conexa.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          {/* Category Chips */}
          <div className="flex overflow-x-auto pb-2 w-full md:w-auto gap-2 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Ordenar por:</label>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
              >
                <option value="">Relevancia</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="stock-asc">Stock: Menor a Mayor</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tienda;