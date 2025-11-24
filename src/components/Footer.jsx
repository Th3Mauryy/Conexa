import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <footer className="bg-gradient-to-r from-morado-800 to-morado-900 text-hueso-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`grid gap-8 ${!isHomePage ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
          {/* Información de la empresa */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-azul-cielo-300">CONEXA Telecomunicaciones</h3>
            <p className="text-hueso-200 leading-relaxed">
              Tu mejor opción en servicios de internet y telecomunicaciones en Colima.
            </p>
          </div>
          
          {/* Información de contacto */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-azul-cielo-300">Contacto</h3>
            <div className="space-y-2 text-hueso-200">
              <p className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-azul-cielo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>312-206-15-87</span>
              </p>
              <p className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-azul-cielo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>conexacolima@gmail.com</span>
              </p>
            </div>
          </div>
          
          {/* Horarios de atención */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-azul-cielo-300">Horarios de Atención</h3>
            <div className="text-hueso-200 space-y-1">
              <p>Lunes a Viernes</p>
              <p className="text-azul-cielo-300 font-medium">9:00 AM - 2:00 PM</p>
              <p className="text-azul-cielo-300 font-medium">5:00 PM - 7:00 PM</p>
            </div>
          </div>

          {/* Mapa de ubicación - Solo en páginas que no son inicio */}
          {!isHomePage && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-azul-cielo-300">📍 Nuestra Ubicación</h3>
              <div className="space-y-3">
                <div className="text-hueso-200 space-y-1">
                  <p className="font-medium">Av. San Fernando 533-30</p>
                  <p className="text-sm">Camino Real, 28014 Colima, Col.</p>
                </div>
                
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3757.8957582089!2d-103.72449842401168!3d19.24140794697484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84255a7e0a8b91a7%3A0x4c0e7bc0f8a5f6c8!2sAv.%20San%20Fernando%20533-30%2C%20Camino%20Real%2C%2028014%20Colima%2C%20Col.!5e0!3m2!1ses!2smx!4v1703635200000!5m2!1ses!2smx"
                    width="100%"
                    height="180"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación CONEXA Telecomunicaciones"
                  ></iframe>
                </div>
                
                <a 
                  href="https://www.google.com/maps/dir//Av.+San+Fernando+533-30,+Camino+Real,+28014+Colima,+Col./@19.24140794697484,-103.72449842401168,16z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-azul-cielo-500 hover:bg-azul-cielo-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 w-full justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span>Cómo llegar</span>
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* Línea divisoria */}
        <div className="border-t border-morado-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-hueso-300 text-sm">
              © {new Date().getFullYear()} CONEXA Telecomunicaciones. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-hueso-300 hover:text-azul-cielo-300 transition-colors duration-300">
                Términos de Servicio
              </a>
              <a href="#" className="text-hueso-300 hover:text-azul-cielo-300 transition-colors duration-300">
                Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  