import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Servicios from './pages/servicios';
import Paquetes from './pages/paquetes';
import Contacto from './pages/contacto';
import Internet from './pages/internet';
import Armados from './pages/armados';
import Camaras from './pages/camaras';
import Mantenimiento from './pages/mantenimiento';
import Paneles from './pages/paneles';
import Tienda from './pages/tienda';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import { WishlistProvider } from './context/WishlistContext';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import UserProfile from './pages/UserProfile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <PayPalScriptProvider options={{ 'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test', currency: 'MXN', locale: 'es_MX' }}>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen bg-hueso-50">
              <Router>
                <ScrollToTop />
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/paquetes" element={<Paquetes />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/internet" element={<Internet />} />
                    <Route path="/armados" element={<Armados />} />
                    <Route path="/camaras" element={<Camaras />} />
                    <Route path="/mantenimiento" element={<Mantenimiento />} />
                    <Route path="/paneles" element={<Paneles />} />
                    <Route path="/tienda" element={<Tienda />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                  </Routes>
                </main>
                <Footer />
              </Router>
              <ToastContainer position="bottom-right" autoClose={3000} />
            </div>
          </WishlistProvider>
        </CartProvider>
      </PayPalScriptProvider>
    </AuthProvider>
  );
}

export default App;