import React from 'react';
import { FaWhatsapp, FaEnvelope, FaFacebook, FaPhone, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const Contacto = () => {
  return (
    <div className="min-h-screen bg-hueso-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-morado-600 via-azul-cielo-500 to-morado-700"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-hueso-50 mb-6">
              ¿En qué podemos ayudarte?
            </h1>
            <p className="text-xl text-hueso-100 max-w-3xl mx-auto leading-relaxed">
              Estamos aquí para brindarte el mejor soporte y atención personalizada
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-hueso-50 to-transparent"></div>
      </section>

      {/* Contenido Principal */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Atención a Clientes */}
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-azul-cielo-500 to-azul-cielo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-morado-700 mb-4">Atención a Clientes</h2>
                <p className="text-lg text-morado-600 leading-relaxed">
                  Te ayudamos con dudas sobre tus estados de cuenta, formas de pago, ayuda técnica y más.
                </p>
              </div>

              <div className="flex justify-center space-x-8">
                <a 
                  href="https://wa.me/5213122427856?text=Quisiera%20información%20para%20la%20contratación%20de%20internet." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="bg-green-500 hover:bg-green-600 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-lg group-hover:shadow-xl">
                    <FaWhatsapp className="text-white text-2xl" />
                  </div>
                  <p className="text-center text-sm text-morado-600 mt-2 font-medium">WhatsApp</p>
                </a>

                <a 
                  href="mailto:conexacolima@gmail.com?subject=Soporte Conexa&body=Hola, necesito ayuda con..." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group"
                  onClick={(e) => {
                    if (!window.confirm("Se abrirá tu cliente de correo predeterminado. ¿Deseas continuar?")) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="bg-azul-cielo-500 hover:bg-azul-cielo-600 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-lg group-hover:shadow-xl">
                    <FaEnvelope className="text-white text-2xl" />
                  </div>
                  <p className="text-center text-sm text-morado-600 mt-2 font-medium">Email</p>
                </a>

                <a
                  href="https://www.facebook.com/www.conexa.com.mx?locale=es_LA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="bg-blue-600 hover:bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-lg group-hover:shadow-xl">
                    <FaFacebook className="text-white text-2xl" />
                  </div>
                  <p className="text-center text-sm text-morado-600 mt-2 font-medium">Facebook</p>
                </a>
              </div>
            </div>

            {/* Para Contratar Servicios */}
            <div className="bg-gradient-to-br from-morado-100 to-azul-cielo-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-morado-500 to-morado-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-morado-700 mb-4">Para contratar algún servicio</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4 bg-white/50 rounded-2xl p-4">
                  <div className="bg-morado-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <FaPhone className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="font-bold text-morado-700">Llamar al:</p>
                    <p className="text-azul-cielo-600 font-semibold text-lg">312-688-2709</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-white/50 rounded-2xl p-4">
                  <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <FaWhatsapp className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="font-bold text-morado-700">WhatsApp:</p>
                    <p className="text-azul-cielo-600 font-semibold text-lg">312-242-7856</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-white/50 rounded-2xl p-4">
                  <div className="bg-azul-cielo-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="font-bold text-morado-700">Correo:</p>
                    <p className="text-azul-cielo-600 font-semibold">conexacolima@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-white/50 rounded-2xl p-4">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
                    <FaFacebook className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="font-bold text-morado-700">Facebook:</p>
                    <a
                      href="https://www.facebook.com/www.conexa.com.mx?locale=es_LA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-azul-cielo-600 hover:text-azul-cielo-700 transition-colors duration-300 underline"
                    >
                      www.conexa.com.mx
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asesoría y Horarios */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-morado-700 mb-4">
              Asesoría y Cargos Recurrentes
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-hueso-100 to-white rounded-3xl p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-azul-cielo-500 to-azul-cielo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPhone className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-morado-700 mb-2">Asesoría de tu cuenta</h3>
                <p className="text-3xl font-bold text-azul-cielo-600">312 688 2709</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-hueso-100 to-white rounded-3xl p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-morado-500 to-morado-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaClock className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-morado-700 mb-4">Horario de Atención</h3>
                <div className="space-y-2 text-azul-cielo-600">
                  <p className="font-semibold">Lunes a Viernes</p>
                  <p className="text-lg">9:00 AM - 2:00 PM</p>
                  <p className="text-lg">5:00 PM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Contacto;