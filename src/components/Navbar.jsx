import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png'; // Importa la imagen

const Navbar = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const servicesMenuRef = useRef(null);

  const toggleServicesMenu = (event) => {
    event.preventDefault();
    setIsServicesOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target)) {
      setIsServicesOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-morado-600 to-azul-cielo-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img
              src={logo}
              alt="Logo de CONEXA"
              className="h-12 w-auto transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-hueso-50 hover:text-azul-cielo-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-white/10"
            >
              Inicio
            </Link>

            {/* Servicios Dropdown */}
            <div className="relative" ref={servicesMenuRef}>
              <button
                onClick={toggleServicesMenu}
                className="text-hueso-50 hover:text-azul-cielo-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-white/10 flex items-center"
              >
                Servicios
                <svg className={`ml-1 h-4 w-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`absolute left-0 mt-2 w-64 bg-hueso-50 rounded-lg shadow-xl border border-hueso-200 transform transition-all duration-300 ${isServicesOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}>
                <div className="py-2">
                  <Link
                    to="/internet"
                    onClick={() => setIsServicesOpen(false)}
                    className="block px-4 py-3 text-sm text-morado-700 hover:bg-azul-cielo-50 hover:text-azul-cielo-700 transition-colors duration-200 border-l-4 border-transparent hover:border-azul-cielo-400"
                  >
                    Internet
                  </Link>
                  <Link
                    to="/mantenimiento"
                    onClick={() => setIsServicesOpen(false)}
                    className="block px-4 py-3 text-sm text-morado-700 hover:bg-azul-cielo-50 hover:text-azul-cielo-700 transition-colors duration-200 border-l-4 border-transparent hover:border-azul-cielo-400"
                  >
                    Mantenimiento de cómputo
                  </Link>
                  <Link
                    to="/armados"
                    onClick={() => setIsServicesOpen(false)}
                    className="block px-4 py-3 text-sm text-morado-700 hover:bg-azul-cielo-50 hover:text-azul-cielo-700 transition-colors duration-200 border-l-4 border-transparent hover:border-azul-cielo-400"
                  >
                    Armado de computadoras
                  </Link>
                  <Link
                    to="/camaras"
                    onClick={() => setIsServicesOpen(false)}
                    className="block px-4 py-3 text-sm text-morado-700 hover:bg-azul-cielo-50 hover:text-azul-cielo-700 transition-colors duration-200 border-l-4 border-transparent hover:border-azul-cielo-400"
                  >
                    Instalación de cámaras de seguridad
                  </Link>
                  <Link
                    to="/paneles"
                    onClick={() => setIsServicesOpen(false)}
                    className="block px-4 py-3 text-sm text-morado-700 hover:bg-azul-cielo-50 hover:text-azul-cielo-700 transition-colors duration-200 border-l-4 border-transparent hover:border-azul-cielo-400"
                  >
                    Instalación de paneles solares
                  </Link>
                </div>
              </div>
            </div>

            <Link
              to="/paquetes"
              className="text-hueso-50 hover:text-azul-cielo-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-white/10"
            >
              Paquetes
            </Link>
            <Link
              to="/tienda"
              className="text-hueso-50 hover:text-azul-cielo-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-white/10"
            >
              Tienda
            </Link>
            <Link
              to="/contacto"
              className="bg-azul-cielo-500 hover:bg-azul-cielo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Contacto
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-hueso-50 hover:text-azul-cielo-200 focus:outline-none focus:text-azul-cielo-200 transition-colors duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/10 rounded-lg mt-2">
            <Link
              to="/"
              className="block text-hueso-50 hover:text-azul-cielo-200 px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>

            {/* Mobile Services Menu */}
            <div className="px-3 py-2">
              <button
                onClick={toggleServicesMenu}
                className="flex items-center justify-between w-full text-hueso-50 hover:text-azul-cielo-200 text-base font-medium transition-colors duration-300"
              >
                Servicios
                <svg className={`h-4 w-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`mt-2 space-y-1 transition-all duration-300 ${isServicesOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                <Link
                  to="/internet"
                  className="block text-hueso-200 hover:text-azul-cielo-200 px-4 py-2 text-sm transition-colors duration-300"
                  onClick={() => { setIsServicesOpen(false); setIsMobileMenuOpen(false); }}
                >
                  Internet
                </Link>
                <Link
                  to="/mantenimiento"
                  className="block text-hueso-200 hover:text-azul-cielo-200 px-4 py-2 text-sm transition-colors duration-300"
                  onClick={() => { setIsServicesOpen(false); setIsMobileMenuOpen(false); }}
                >
                  Mantenimiento de cómputo
                </Link>
                <Link
                  to="/armados"
                  className="block text-hueso-200 hover:text-azul-cielo-200 px-4 py-2 text-sm transition-colors duration-300"
                  onClick={() => { setIsServicesOpen(false); setIsMobileMenuOpen(false); }}
                >
                  Armado de computadoras
                </Link>
                <Link
                  to="/camaras"
                  className="block text-hueso-200 hover:text-azul-cielo-200 px-4 py-2 text-sm transition-colors duration-300"
                  onClick={() => { setIsServicesOpen(false); setIsMobileMenuOpen(false); }}
                >
                  Instalación de cámaras de seguridad
                </Link>
                <Link
                  to="/paneles"
                  className="block text-hueso-200 hover:text-azul-cielo-200 px-4 py-2 text-sm transition-colors duration-300"
                  onClick={() => { setIsServicesOpen(false); setIsMobileMenuOpen(false); }}
                >
                  Instalación de paneles solares
                </Link>
              </div>
            </div>

            <Link
              to="/paquetes"
              className="block text-hueso-50 hover:text-azul-cielo-200 px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Paquetes
            </Link>
            <Link
              to="/tienda"
              className="block text-hueso-50 hover:text-azul-cielo-200 px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tienda
            </Link>
            <Link
              to="/contacto"
              className="block bg-azul-cielo-500 hover:bg-azul-cielo-600 text-white px-3 py-2 rounded-md text-base font-medium transition-all duration-300 mx-3 text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;