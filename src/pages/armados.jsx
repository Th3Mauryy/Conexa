import React, { useState } from 'react';
import api from '../api';

const Armados = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errorTelefono, setErrorTelefono] = useState('');
  const [errorCorreo, setErrorCorreo] = useState('');

  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // URLs de las imágenes
  const imgPersonalizacion = "https://i.blogs.es/d15fd1/2560_3000-2/1366_2000.jpg";
  const imgProceso = "https://img.pccomponentes.com/pcblog/542/configuraciones-pc-gaming.jpg";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (telefono.length !== 10 || !/^\d+$/.test(telefono)) {
      setErrorTelefono('El teléfono debe tener exactamente 10 dígitos.');
      return;
    }

    if (!regexCorreo.test(correo)) {
      setErrorCorreo('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (!nombre || !correo || !telefono || !descripcion) {
      setMensaje('Por favor, completa todos los campos.');
      return;
    }

    try {
      const datosCliente = {
        nombre,
        correo,
        telefono,
        descripcion,
        servicio: 'armado_pc',
        fecha: new Date().toISOString(),
        estado: 'nuevo'
      };

      await api.post('/notifications', {
        type: 'service_request',
        data: datosCliente
      });

      setMensaje('¡Solicitud enviada con éxito! Un asesor se pondrá en contacto contigo.');

      setNombre('');
      setCorreo('');
      setTelefono('');
      setDescripcion('');
      setErrorTelefono('');
      setErrorCorreo('');
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      setMensaje('Hubo un error al enviar tu solicitud. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hueso-50 to-azul-cielo-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-morado-600 to-azul-cielo-500">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Servicio Profesional de Armado de Computadoras
          </h1>
          <p className="text-xl md:text-2xl text-hueso-100 leading-relaxed">
            ¿Necesitas una computadora a la medida de tus necesidades? En <strong className="text-azul-cielo-200">CONEXA</strong> creamos equipos personalizados con componentes de alta calidad, optimizados para tu uso específico ya sea gaming, diseño, oficina o desarrollo.
          </p>
        </div>
      </section>

      {/* Service Description */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-morado-800 text-center mb-12">
            ¿Qué ofrecemos en nuestro servicio de armado?
          </h2>

          {/* Personalización Total */}
          <div className="mb-12 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img src={imgPersonalizacion} alt="Personalización de PC" className="w-full h-64 md:h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-8">
                <h3 className="text-2xl font-bold text-morado-700 mb-4">Personalización Total</h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-azul-cielo-500 mr-2 text-xl">•</span>
                    <div>
                      <strong className="text-morado-600">Tú eliges las piezas:</strong> Selecciona cada componente según tus preferencias y presupuesto.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-azul-cielo-500 mr-2 text-xl">•</span>
                    <div>
                      <strong className="text-morado-600">O nosotros te asesoramos:</strong> Si no estás seguro, nuestros expertos seleccionarán las mejores opciones según tus necesidades.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-azul-cielo-500 mr-2 text-xl">•</span>
                    <div>
                      <strong className="text-morado-600">Equipos balanceados:</strong> Garantizamos que todos los componentes trabajen en armonía sin cuellos de botella.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Proceso de Armado */}
          <div className="mb-12 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex md:flex-row-reverse">
              <div className="md:w-1/2">
                <img src={imgProceso} alt="Proceso de armado de PC" className="w-full h-64 md:h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-8">
                <h3 className="text-2xl font-bold text-morado-700 mb-4">Proceso de Armado</h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-azul-cielo-500 mr-2 text-xl">•</span>
                    <div>
                      <strong className="text-morado-600">Ensamblaje profesional:</strong> Realizado por técnicos certificados con años de experiencia.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-azul-cielo-500 mr-2 text-xl">•</span>
                    <div>
                      <strong className="text-morado-600">Pruebas de estrés:</strong> Testeamos cada componente para garantizar estabilidad y rendimiento.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-azul-cielo-500 mr-2 text-xl">•</span>
                    <div>
                      <strong className="text-morado-600">Cableado perfecto:</strong> Organización impecable para mejor flujo de aire y estética.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-morado-50 to-azul-cielo-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-morado-800 text-center mb-12">
            Ventajas de armar tu PC con nosotros
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-bold text-morado-700 mb-3">Garantía por pieza y mano de obra</h3>
              <p className="text-gray-600">Cobertura completa en todos los componentes y en nuestro trabajo.</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-morado-700 mb-3">Armado rápido</h3>
              <p className="text-gray-600">Entrega en 48-72 horas hábiles una vez confirmados los componentes.</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-morado-700 mb-3">Mejor precio que ensambladoras</h3>
              <p className="text-gray-600">Sin costos ocultos y con componentes de mejor calidad que PCs prearmadas.</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-morado-700 mb-3">Soporte post-venta</h3>
              <p className="text-gray-600">Asesoramiento gratuito por 3 meses después de la compra.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-morado-800 text-center mb-12">
            ¿Cómo funciona nuestro servicio?
          </h2>
          <ol className="space-y-6">
            <li className="flex items-start bg-white rounded-xl p-6 shadow-lg">
              <span className="bg-morado-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">1</span>
              <div>
                <strong className="text-morado-700">Consulta inicial:</strong> Nos cuentas para qué necesitas el equipo (juegos, diseño, oficina, etc.) y tu presupuesto.
              </div>
            </li>
            <li className="flex items-start bg-white rounded-xl p-6 shadow-lg">
              <span className="bg-morado-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">2</span>
              <div>
                <strong className="text-morado-700">Propuesta de configuración:</strong> Te enviamos opciones de componentes con sus características y precios.
              </div>
            </li>
            <li className="flex items-start bg-white rounded-xl p-6 shadow-lg">
              <span className="bg-morado-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">3</span>
              <div>
                <strong className="text-morado-700">Ajustes finales:</strong> Personalizamos la configuración según tus comentarios.
              </div>
            </li>
            <li className="flex items-start bg-white rounded-xl p-6 shadow-lg">
              <span className="bg-morado-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">4</span>
              <div>
                <strong className="text-morado-700">Armado y pruebas:</strong> Ensamblamos el equipo y realizamos pruebas exhaustivas.
              </div>
            </li>
            <li className="flex items-start bg-white rounded-xl p-6 shadow-lg">
              <span className="bg-morado-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">5</span>
              <div>
                <strong className="text-morado-700">Entrega y capacitación:</strong> Te entregamos tu nueva PC con explicación de sus características.
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* CTA and Form Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-morado-600 to-azul-cielo-500">
        <div className="max-w-4xl mx-auto">
          {!mostrarFormulario ? (
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                ¿Listo para tener la computadora perfecta para ti?
              </h2>
              <button
                className="bg-hueso-500 text-morado-800 px-8 py-4 rounded-xl text-xl font-bold hover:bg-hueso-400 transition-colors duration-300 transform hover:scale-105"
                onClick={() => setMostrarFormulario(true)}
              >
                📩 Solicitar cotización ahora
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-morado-800 mb-4 text-center">
                Solicitud de armado de computadora
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Completa tus datos y te contactaremos para asesorarte
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-morado-700 font-semibold mb-2">
                    Nombre completo:
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morado-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-morado-700 font-semibold mb-2">
                    Correo electrónico:
                  </label>
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morado-500 focus:border-transparent"
                  />
                  {errorCorreo && <p className="text-red-500 text-sm mt-2">{errorCorreo}</p>}
                </div>

                <div>
                  <label className="block text-morado-700 font-semibold mb-2">
                    Teléfono (10 dígitos):
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                    maxLength={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morado-500 focus:border-transparent"
                  />
                  {errorTelefono && <p className="text-red-500 text-sm mt-2">{errorTelefono}</p>}
                </div>

                <div>
                  <label className="block text-morado-700 font-semibold mb-2">
                    Describe tus necesidades (ej: "PC para juegos con presupuesto de $20,000", "Equipo para edición de video", etc.):
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morado-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    type="submit"
                    className="bg-morado-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-morado-700 transition-colors duration-300"
                  >
                    Enviar solicitud
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-300"
                    onClick={() => {
                      setMostrarFormulario(false);
                      setMensaje('');
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>

              {mensaje && (
                <p className="text-center mt-6 p-4 bg-azul-cielo-100 border border-azul-cielo-300 rounded-lg text-azul-cielo-800">
                  {mensaje}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Armados;