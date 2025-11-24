import React, { useState } from 'react';
import api from '../api';

const Paneles = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    electrodomesticos: '',
    descripcion: ''
  });
  const [mensajeError, setMensajeError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notifications', {
        type: 'service_request',
        data: {
          ...formData,
          servicio: 'paneles_solares',
          fecha: new Date().toISOString()
        }
      });
      alert('Solicitud enviada con éxito');
      setShowForm(false);
      setFormData({
        nombre: '',
        correo: '',
        telefono: '',
        electrodomesticos: '',
        descripcion: ''
      });
    } catch (error) {
      console.error('Error:', error);
      setMensajeError('Error al enviar la solicitud');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-morado-600 to-azul-cielo-500">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Sistemas de Energía Solar
          </h1>
          <p className="text-xl md:text-2xl text-hueso-100 leading-relaxed">
            Reduce tu factura eléctrica hasta un 95% con nuestros sistemas de paneles solares personalizados.
            Energía limpia, renovable y de bajo mantenimiento para tu hogar o negocio.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-morado-800 text-center mb-12">
            🔆 ¿Qué son los paneles solares y por qué usarlos?
          </h2>

          {/* Energía Renovable */}
          <div className="mb-12 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img src="https://ftp3.syscom.mx/usuarios/ftp/marketing_digital/eco_green_energy/syscomAndColombia/2020/12/28/img_2364.png" alt="Energía limpia" className="w-full h-64 md:h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-8">
                <h3 className="text-2xl font-bold text-morado-700 mb-4">✅ Energía Renovable y Limpia</h3>
                <div className="space-y-4 text-gray-700">
                  <p>Los paneles solares convierten la luz del sol en electricidad sin emisiones contaminantes.</p>
                  <p>Reduces tu huella de carbono y contribuyes al cuidado del medio ambiente.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ahorro Económico */}
          <div className="mb-12 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex md:flex-row-reverse">
              <div className="md:w-1/2">
                <img src="https://ftp3.syscom.mx/usuarios/ftp/marketing_digital/eco_green_energy_group_/syscomAndColombia/2020/04/21/img_613.jpg" alt="Ahorro económico" className="w-full h-64 md:h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-8">
                <h3 className="text-2xl font-bold text-morado-700 mb-4">✅ Ahorro Económico</h3>
                <div className="space-y-4 text-gray-700">
                  <p>Recupera tu inversión en 3-5 años y disfruta de energía casi gratis por más de 25 años.</p>
                  <p>Protección contra los constantes aumentos en las tarifas eléctricas.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Independencia Energética */}
          <div className="mb-12 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img src="https://ftp3.syscom.mx/usuarios/ftp/banners_index/syscom/eco-green-energy.jpg" alt="Independencia energética" className="w-full h-64 md:h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-8">
                <h3 className="text-2xl font-bold text-morado-700 mb-4">✅ Independencia Energética</h3>
                <div className="space-y-4 text-gray-700">
                  <p>Reduce tu dependencia de la red eléctrica convencional.</p>
                  <p>Sistemas con baterías para tener energía incluso durante apagones.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bajo Mantenimiento */}
          <div className="mb-12 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex md:flex-row-reverse">
              <div className="md:w-1/2">
                <img src="https://ftp3.syscom.mx/usuarios/ftp/marketing_digital/eco_green_energy/syscomAndColombia/2020/10/05/img_2171.jpg" alt="Bajo mantenimiento" className="w-full h-64 md:h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-8">
                <h3 className="text-2xl font-bold text-morado-700 mb-4">✅ Bajo Mantenimiento</h3>
                <div className="space-y-4 text-gray-700">
                  <p>Nuestros sistemas requieren solo 1-2 limpiezas anuales.</p>
                  <p>Garantías de 10-25 años en equipos y 80% de eficiencia después de 25 años.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-morado-50 to-azul-cielo-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-morado-800 text-center mb-12">
            💡 Ventajas de Elegirnos
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-bold text-morado-700 mb-3">Instalación Profesional</h3>
              <p className="text-gray-600">Técnicos certificados con años de experiencia en sistemas solares.</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">📐</div>
              <h3 className="text-xl font-bold text-morado-700 mb-3">Diseño Personalizado</h3>
              <p className="text-gray-600">Sistema dimensionado específicamente para tu consumo y espacio disponible.</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-morado-700 mb-3">Componentes Premium</h3>
              <p className="text-gray-600">Solo utilizamos paneles e inversores de marcas reconocidas mundialmente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA and Form Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-morado-600 to-azul-cielo-500">
        <div className="max-w-4xl mx-auto">
          {!showForm ? (
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                ¿Listo para generar tu propia energía?
              </h2>
              <p className="text-xl text-hueso-100 mb-8">
                Obtén una cotización personalizada sin compromiso
              </p>
              <button
                className="bg-hueso-500 text-morado-800 px-8 py-4 rounded-xl text-xl font-bold hover:bg-hueso-400 transition-colors duration-300 transform hover:scale-105"
                onClick={() => setShowForm(true)}
              >
                🔆 Solicitar cotización gratuita
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-morado-800 mb-4 text-center">
                Cotización de Sistema Solar
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Completa tus datos y te contactaremos para diseñar tu sistema personalizado
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-morado-700 font-semibold mb-2">
                    Nombre completo:
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
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
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morado-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-morado-700 font-semibold mb-2">
                    Teléfono:
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morado-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-morado-700 font-semibold mb-2">
                    Electrodomésticos principales que usas:
                  </label>
                  <input
                    type="text"
                    name="electrodomesticos"
                    value={formData.electrodomesticos}
                    onChange={handleChange}
                    placeholder="Ej: 2 refrigeradores, aires acondicionados, calentador, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morado-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-morado-700 font-semibold mb-2">
                    Descripción adicional:
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Cuéntanos sobre tu consumo eléctrico, espacio disponible, etc."
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
                      setShowForm(false);
                      setMensajeError('');
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>

              {mensajeError && (
                <p className="text-center mt-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
                  {mensajeError}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div >
  );
};

export default Paneles;