import React, { useState } from 'react';
import api from '../api';

const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Paquetes = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errorTelefono, setErrorTelefono] = useState('');
  const [errorCorreo, setErrorCorreo] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const paquetes = [
    {
      velocidad: '5',
      precio: '350',
      ideal: 'Navegación básica',
      dispositivos: '3',
      caracteristicas: ['Redes sociales', 'Correo electrónico', 'Videos ligeros'],
      popular: false,
      color: 'azul-cielo'
    },
    {
      velocidad: '10',
      precio: '580',
      ideal: 'Familias pequeñas',
      dispositivos: '6',
      caracteristicas: ['Streaming HD', 'Videollamadas', 'Trabajo desde casa'],
      popular: false,
      color: 'morado'
    },
    {
      velocidad: '15',
      precio: '730',
      ideal: 'Hogares conectados',
      dispositivos: '10',
      caracteristicas: ['Streaming 4K', 'Gaming online', 'Múltiples usuarios'],
      popular: true,
      color: 'azul-cielo'
    },
    {
      velocidad: '20',
      precio: '1044',
      ideal: 'Negocios y poder',
      dispositivos: '15',
      caracteristicas: ['Ultra velocidad', 'Streaming 4K múltiple', 'Trabajo profesional'],
      popular: false,
      color: 'morado'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (telefono.length !== 10 || !/^\d+$/.test(telefono)) {
      setErrorTelefono('El teléfono debe tener exactamente 10 dígitos.');
      return;
    } else {
      setErrorTelefono('');
    }

    if (!regexCorreo.test(correo)) {
      setErrorCorreo('Por favor, ingresa un correo electrónico válido.');
      return;
    } else {
      setErrorCorreo('');
    }

    if (!nombre || !correo || !telefono || !paqueteSeleccionado) {
      setMensaje('Por favor, completa todos los campos.');
      return;
    }

    const datosCliente = {
      nombre,
      correo,
      telefono,
      paquete: paqueteSeleccionado,
      fecha: new Date().toLocaleString(),
    };

    try {
      await api.post('/notifications', {
        type: 'service_request',
        data: datosCliente
      });

      alert('¡Solicitud enviada con éxito! Estaremos en contacto contigo lo más pronto posible.');
      setNombre('');
      setCorreo('');
      setTelefono('');
      setPaqueteSeleccionado('');
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      setMensaje('Hubo un error al enviar tu solicitud. Inténtalo de nuevo.');
    }
  };

  const handleContratarClick = (paquete) => {
    setPaqueteSeleccionado(paquete);
    setMostrarFormulario(true);
  };

  return (
    <div className="min-h-screen bg-hueso-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-morado-600 via-azul-cielo-500 to-morado-700"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-hueso-50 mb-6">
            ¡Conéctate a la velocidad que necesitas!
          </h1>
          <p className="text-xl text-hueso-100 max-w-4xl mx-auto leading-relaxed">
            En un mundo donde la conexión lo es todo, ofrecemos paquetes de Internet diseñados para
            adaptarse a tu estilo de vida. Ya sea para trabajar, estudiar, jugar o disfrutar de tu
            entretenimiento favorito, tenemos el plan perfecto para ti.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-hueso-50 to-transparent"></div>
      </section>

      {/* Consejos Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-morado-700 mb-4">
              Consejos para elegir el mejor paquete
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-azul-cielo-50 to-white p-6 rounded-3xl shadow-lg border-l-4 border-azul-cielo-400">
              <div className="text-center mb-4">
                <div className="bg-azul-cielo-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold">5</span>
                </div>
                <p className="font-semibold text-morado-700">Solo navegas por internet</p>
              </div>
              <p className="text-sm text-morado-600 text-center">
                Redes sociales y videos ocasionales
              </p>
            </div>

            <div className="bg-gradient-to-br from-morado-50 to-white p-6 rounded-3xl shadow-lg border-l-4 border-morado-400">
              <div className="text-center mb-4">
                <div className="bg-morado-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold">10</span>
                </div>
                <p className="font-semibold text-morado-700">Videollamadas y Netflix</p>
              </div>
              <p className="text-sm text-morado-600 text-center">
                HD y un par de dispositivos
              </p>
            </div>

            <div className="bg-gradient-to-br from-azul-cielo-50 to-white p-6 rounded-3xl shadow-lg border-l-4 border-azul-cielo-600">
              <div className="text-center mb-4">
                <div className="bg-azul-cielo-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold">15</span>
                </div>
                <p className="font-semibold text-morado-700">Gaming y Full HD</p>
              </div>
              <p className="text-sm text-morado-600 text-center">
                Descargas frecuentes y juegos online
              </p>
            </div>

            <div className="bg-gradient-to-br from-morado-50 to-white p-6 rounded-3xl shadow-lg border-l-4 border-morado-600">
              <div className="text-center mb-4">
                <div className="bg-morado-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold">20</span>
                </div>
                <p className="font-semibold text-morado-700">Teletrabajo y 4K</p>
              </div>
              <p className="text-sm text-morado-600 text-center">
                Múltiples dispositivos simultáneos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Paquetes Section */}
      <section className="py-20 bg-hueso-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-morado-700 mb-4">
              Paquetes Disponibles
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full mb-6"></div>
            <p className="text-sm text-morado-600 max-w-4xl mx-auto bg-white/70 p-4 rounded-2xl shadow-md">
              <strong>*** Precios sugeridos por el proveedor, exclusivo para usuarios y clientes domésticos.
                El precio puede variar dependiendo de la instalación y el material utilizado. ***</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {paquetes.map((paquete, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${paquete.popular ? 'ring-4 ring-azul-cielo-400 ring-opacity-50' : ''
                  }`}
                style={paquete.popular ? { marginTop: '1rem' } : {}}
              >
                {paquete.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-azul-cielo-500 to-azul-cielo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg border-2 border-white">
                      MÁS POPULAR
                    </div>
                  </div>
                )}

                <div className={`text-center ${paquete.popular ? 'mt-4' : ''} mb-8`}>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${paquete.color === 'azul-cielo'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      : 'bg-gradient-to-r from-purple-500 to-violet-600'
                    }`}>
                    <span className="text-2xl font-bold text-white">{paquete.velocidad}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-morado-700 mb-2">{paquete.velocidad} Mbps</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-azul-cielo-600">${paquete.precio}</span>
                    <span className="text-morado-600">/mes</span>
                  </div>
                  <p className="text-sm text-morado-600 font-medium">{paquete.ideal}</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-sm text-morado-600">
                    <svg className="w-5 h-5 text-azul-cielo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Hasta {paquete.dispositivos} dispositivos
                  </div>
                  {paquete.caracteristicas.map((caracteristica, idx) => (
                    <div key={idx} className="flex items-center text-sm text-morado-600">
                      <svg className="w-5 h-5 text-azul-cielo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {caracteristica}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleContratarClick(`${paquete.velocidad} Mbps - $${paquete.precio}/mes`)}
                  className={`w-full text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${paquete.color === 'azul-cielo'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                      : 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700'
                    }`}
                >
                  Contratar Ahora
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario Modal */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-morado-700 mb-2">
                Contratar Paquete
              </h2>
              <p className="text-azul-cielo-600 font-semibold">{paqueteSeleccionado}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-morado-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-3 border border-hueso-300 rounded-2xl focus:ring-2 focus:ring-azul-cielo-500 focus:border-transparent transition-all duration-300"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-morado-700 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full px-4 py-3 border border-hueso-300 rounded-2xl focus:ring-2 focus:ring-azul-cielo-500 focus:border-transparent transition-all duration-300"
                  placeholder="tu@correo.com"
                  required
                />
                {errorCorreo && <p className="text-red-500 text-sm mt-1">{errorCorreo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-morado-700 mb-2">
                  Número telefónico
                </label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full px-4 py-3 border border-hueso-300 rounded-2xl focus:ring-2 focus:ring-azul-cielo-500 focus:border-transparent transition-all duration-300"
                  placeholder="3121234567"
                  maxLength={10}
                  required
                />
                {errorTelefono && <p className="text-red-500 text-sm mt-1">{errorTelefono}</p>}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="flex-1 bg-hueso-200 hover:bg-hueso-300 text-morado-700 font-semibold py-3 px-6 rounded-2xl transition-all duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-azul-cielo-500 to-azul-cielo-600 hover:from-azul-cielo-600 hover:to-azul-cielo-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Enviar Solicitud
                </button>
              </div>
            </form>

            {mensaje && (
              <div className="mt-4 p-4 bg-azul-cielo-50 border border-azul-cielo-200 rounded-2xl">
                <p className="text-azul-cielo-700 text-sm text-center">{mensaje}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Paquetes;