import React, { useState } from 'react';
import api from '../api';

const Camaras = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    tipoPropiedad: '',
    areas: [],
    numCamaras: 1,
    caracteristicas: [],
    almacenamiento: '',
    presupuesto: '',
    descripcion: ''
  });

  const [errors, setErrors] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => {
        const updatedArray = checked
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value);
        return { ...prev, [name]: updatedArray };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNumCamaras = (increment) => {
    setFormData(prev => ({
      ...prev,
      numCamaras: Math.max(1, prev.numCamaras + (increment ? 1 : -1))
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.correo) newErrors.correo = 'El correo es obligatorio';
    if (!formData.telefono) newErrors.telefono = 'El teléfono es obligatorio';
    if (!formData.tipoPropiedad) newErrors.tipoPropiedad = 'Selecciona un tipo de propiedad';
    if (formData.areas.length === 0) newErrors.areas = 'Selecciona al menos un área';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeExito('');
    setMensajeError('');

    if (validateForm()) {
      try {
        await api.post('/notifications', {
          type: 'service_request',
          data: {
            ...formData,
            tipo: 'instalacion_camaras',
            fecha: new Date().toISOString(),
          }
        });

        setMensajeExito('Cotización solicitada. Nos pondremos en contacto contigo pronto.');
        setShowForm(false);
        setFormData({
          nombre: '',
          correo: '',
          telefono: '',
          tipoPropiedad: '',
          areas: [],
          numCamaras: 1,
          caracteristicas: [],
          almacenamiento: '',
          presupuesto: '',
          descripcion: ''
        });

      } catch (error) {
        console.error('Error al guardar:', error);
        setMensajeError('Hubo un error al enviar tu solicitud. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-morado-600 to-azul-cielo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">📷 Instalación de Cámaras de Seguridad</h1>
            <p className="text-xl text-hueso-100 max-w-4xl mx-auto leading-relaxed">
              Si estás considerando instalar cámaras de seguridad, estás en el lugar correcto. Aquí te explicamos por qué son esenciales, los tipos disponibles y todo lo que necesitas saber para proteger tu hogar o negocio.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-morado-700 mb-4">¿Por qué Instalar Cámaras de Seguridad?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-hueso-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-t-4 border-azul-cielo-400">
              <div className="text-5xl mb-4 text-center">👁️</div>
              <h3 className="text-xl font-bold text-morado-700 mb-4 text-center">Disuasión de Robos</h3>
              <p className="text-morado-600 mb-3">Reduce hasta un 60% los intentos de robo con cámaras visibles.</p>
              <p className="text-azul-cielo-600 font-medium">Los delincuentes evitan propiedades vigiladas.</p>
            </div>

            <div className="bg-hueso-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-t-4 border-azul-cielo-400">
              <div className="text-5xl mb-4 text-center">📱</div>
              <h3 className="text-xl font-bold text-morado-700 mb-4 text-center">Monitoreo Remoto</h3>
              <p className="text-morado-600 mb-3">Vigila tu propiedad desde tu celular las 24/7.</p>
              <p className="text-azul-cielo-600 font-medium">Recibe alertas ante movimientos sospechosos.</p>
            </div>

            <div className="bg-hueso-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-t-4 border-azul-cielo-400">
              <div className="text-5xl mb-4 text-center">🔍</div>
              <h3 className="text-xl font-bold text-morado-700 mb-4 text-center">Evidencia Digital</h3>
              <p className="text-morado-600 mb-3">Grabaciones útiles para identificar intrusos.</p>
              <p className="text-azul-cielo-600 font-medium">Respaldan denuncias y reclamaciones de seguros.</p>
            </div>

            <div className="bg-hueso-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-t-4 border-azul-cielo-400">
              <div className="text-5xl mb-4 text-center">👪</div>
              <h3 className="text-xl font-bold text-morado-700 mb-4 text-center">Protección Familiar</h3>
              <p className="text-morado-600 mb-3">Supervisa a niños, mascotas o ancianos.</p>
              <p className="text-azul-cielo-600 font-medium">Mayor seguridad para empleados en negocios.</p>
            </div>

            <div className="bg-hueso-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-t-4 border-azul-cielo-400">
              <div className="text-5xl mb-4 text-center">🎙️</div>
              <h3 className="text-xl font-bold text-morado-700 mb-4 text-center">Control de Accesos</h3>
              <p className="text-morado-600 mb-3">Algunas cámaras permiten hablar con visitantes.</p>
              <p className="text-azul-cielo-600 font-medium">Ideal para recibir paquetes o verificar visitas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Types section */}
      <section className="py-20 bg-hueso-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-morado-700 mb-4">📷 Tipos de Cámaras de Seguridad</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full"></div>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-morado-600 to-azul-cielo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-lg">Tipo de Cámara</th>
                    <th className="px-6 py-4 text-left font-semibold text-lg">Mejor Para</th>
                    <th className="px-6 py-4 text-left font-semibold text-lg">Ventajas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hueso-200">
                  <tr className="hover:bg-hueso-50 transition-colors duration-200">
                    <td className="px-6 py-4 font-semibold text-morado-700">Cámaras IP (Wi-Fi)</td>
                    <td className="px-6 py-4 text-morado-600">Hogares y negocios pequeños</td>
                    <td className="px-6 py-4 text-morado-600">Fácil instalación, acceso remoto, alta calidad</td>
                  </tr>
                  <tr className="hover:bg-hueso-50 transition-colors duration-200">
                    <td className="px-6 py-4 font-semibold text-morado-700">Cámaras con Cable (CCTV)</td>
                    <td className="px-6 py-4 text-morado-600">Negocios grandes, exteriores</td>
                    <td className="px-6 py-4 text-morado-600">Mayor estabilidad, resistentes a interferencias</td>
                  </tr>
                  <tr className="hover:bg-hueso-50 transition-colors duration-200">
                    <td className="px-6 py-4 font-semibold text-morado-700">Cámaras Inalámbricas</td>
                    <td className="px-6 py-4 text-morado-600">Lugares sin cableado</td>
                    <td className="px-6 py-4 text-morado-600">Instalación flexible, sin obras</td>
                  </tr>
                  <tr className="hover:bg-hueso-50 transition-colors duration-200">
                    <td className="px-6 py-4 font-semibold text-morado-700">Cámaras con Visión Nocturna</td>
                    <td className="px-6 py-4 text-morado-600">Vigilancia nocturna</td>
                    <td className="px-6 py-4 text-morado-600">Grabación en oscuridad con infrarrojos</td>
                  </tr>
                  <tr className="hover:bg-hueso-50 transition-colors duration-200">
                    <td className="px-6 py-4 font-semibold text-morado-700">Cámaras con Reconocimiento Facial</td>
                    <td className="px-6 py-4 text-morado-600">Seguridad avanzada</td>
                    <td className="px-6 py-4 text-morado-600">Detecta rostros conocidos y envía alertas</td>
                  </tr>
                  <tr className="hover:bg-hueso-50 transition-colors duration-200">
                    <td className="px-6 py-4 font-semibold text-morado-700">Cámaras Ocultas (Domo/Bala)</td>
                    <td className="px-6 py-4 text-morado-600">Vigilancia discreta</td>
                    <td className="px-6 py-4 text-morado-600">Diseño pequeño, difícil de detectar</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Selection section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-morado-700 mb-4">🛠 ¿Cómo Elegir la Mejor Cámara para Ti?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full"></div>
          </div>
          <div className="bg-hueso-50 rounded-3xl p-8 shadow-xl">
            <ul className="space-y-4 text-lg">
              <li className="flex items-start space-x-3">
                <span className="text-azul-cielo-500 font-bold text-xl">✓</span>
                <span className="text-morado-700">Define tu presupuesto (desde opciones económicas hasta sistemas profesionales).</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-azul-cielo-500 font-bold text-xl">✓</span>
                <span className="text-morado-700">Elige entre Wi-Fi o cableado según tu necesidad de estabilidad.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-azul-cielo-500 font-bold text-xl">✓</span>
                <span className="text-morado-700">Revisa la resolución (Full HD 1080p o 4K para mayor claridad).</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-azul-cielo-500 font-bold text-xl">✓</span>
                <span className="text-morado-700">Verifica el almacenamiento (nube, tarjeta SD o DVR).</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-azul-cielo-500 font-bold text-xl">✓</span>
                <span className="text-morado-700">Considera instalación profesional si necesitas un sistema complejo.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-hueso-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {mensajeExito && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-8 text-center">
              {mensajeExito}
            </div>
          )}
          {mensajeError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8 text-center">
              {mensajeError}
            </div>
          )}

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-morado-700 mb-6">🚀 ¿Listo para Proteger tu Hogar o Negocio?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full mb-8"></div>
            <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
              <p className="text-lg text-morado-700 mb-6">
                En <span className="font-bold text-azul-cielo-600">CONEXA</span>, te ofrecemos:
              </p>
              <ul className="space-y-3 text-lg">
                <li className="flex items-center justify-center space-x-3">
                  <span className="text-green-500 font-bold text-xl">✔</span>
                  <span className="text-morado-700">Asesoría gratuita para elegir el mejor sistema.</span>
                </li>
                <li className="flex items-center justify-center space-x-3">
                  <span className="text-green-500 font-bold text-xl">✔</span>
                  <span className="text-morado-700">Instalación profesional con garantía.</span>
                </li>
                <li className="flex items-center justify-center space-x-3">
                  <span className="text-green-500 font-bold text-xl">✔</span>
                  <span className="text-morado-700">Soporte 24/7 en caso de fallas.</span>
                </li>
              </ul>
            </div>
          </div>

          {!showForm ? (
            <div className="text-center">
              <p className="text-xl text-morado-700 mb-8">
                Si estás interesado en nuestro servicio, completa nuestro formulario y uno de nuestros especialistas se comunicará contigo.
              </p>
              <button
                className="bg-gradient-to-r from-azul-cielo-500 to-azul-cielo-600 hover:from-azul-cielo-600 hover:to-azul-cielo-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => setShowForm(true)}
              >
                Solicitar cotización ahora
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-morado-700 text-center mb-8">Solicita tu cotización</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-morado-700 font-medium mb-2">Nombre completo*</label>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Ej: Juan Pérez García"
                      value={formData.nombre}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-azul-cielo-500 ${errors.nombre ? 'border-red-500' : 'border-hueso-300'
                        }`}
                    />
                    {errors.nombre && <span className="text-red-500 text-sm">{errors.nombre}</span>}
                  </div>

                  <div>
                    <label className="block text-morado-700 font-medium mb-2">Correo electrónico*</label>
                    <input
                      type="email"
                      name="correo"
                      placeholder="Ej: contacto@empresa.com"
                      value={formData.correo}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-azul-cielo-500 ${errors.correo ? 'border-red-500' : 'border-hueso-300'
                        }`}
                    />
                    {errors.correo && <span className="text-red-500 text-sm">{errors.correo}</span>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-morado-700 font-medium mb-2">Teléfono*</label>
                    <input
                      type="tel"
                      name="telefono"
                      placeholder="Ej: 5551234567"
                      value={formData.telefono}
                      onChange={handleChange}
                      maxLength="10"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-azul-cielo-500 ${errors.telefono ? 'border-red-500' : 'border-hueso-300'
                        }`}
                    />
                    {errors.telefono && <span className="text-red-500 text-sm">{errors.telefono}</span>}
                  </div>

                  <div>
                    <label className="block text-morado-700 font-medium mb-2">Tipo de propiedad*</label>
                    <select
                      name="tipoPropiedad"
                      value={formData.tipoPropiedad}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-azul-cielo-500 ${errors.tipoPropiedad ? 'border-red-500' : 'border-hueso-300'
                        }`}
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="casa">Casa habitación</option>
                      <option value="departamento">Departamento</option>
                      <option value="negocio">Negocio local</option>
                      <option value="oficina">Oficinas</option>
                      <option value="industrial">Área industrial</option>
                    </select>
                    {errors.tipoPropiedad && <span className="text-red-500 text-sm">{errors.tipoPropiedad}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-morado-700 font-medium mb-2">Áreas a vigilar* (selecciona todas las que apliquen)</label>
                  <div className={`grid grid-cols-2 gap-4 p-4 border rounded-lg ${errors.areas ? 'border-red-500' : 'border-hueso-300'
                    }`}>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="areas"
                        value="entrada"
                        onChange={handleChange}
                        checked={formData.areas.includes('entrada')}
                        className="text-azul-cielo-500"
                      />
                      <span className="text-morado-700">Entrada principal</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="areas"
                        value="estacionamiento"
                        onChange={handleChange}
                        checked={formData.areas.includes('estacionamiento')}
                        className="text-azul-cielo-500"
                      />
                      <span className="text-morado-700">Estacionamiento</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="areas"
                        value="interior"
                        onChange={handleChange}
                        checked={formData.areas.includes('interior')}
                        className="text-azul-cielo-500"
                      />
                      <span className="text-morado-700">Pasillos/Interiores</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="areas"
                        value="exterior"
                        onChange={handleChange}
                        checked={formData.areas.includes('exterior')}
                        className="text-azul-cielo-500"
                      />
                      <span className="text-morado-700">Áreas exteriores</span>
                    </label>
                  </div>
                  {errors.areas && <span className="text-red-500 text-sm">{errors.areas}</span>}
                </div>

                <div>
                  <label className="block text-morado-700 font-medium mb-2">Número de cámaras estimadas</label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => handleNumCamaras(false)}
                      className="bg-morado-500 hover:bg-morado-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold text-morado-700 px-4">{formData.numCamaras}</span>
                    <button
                      type="button"
                      onClick={() => handleNumCamaras(true)}
                      className="bg-morado-500 hover:bg-morado-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-morado-700 font-medium mb-2">Características técnicas deseadas</label>
                  <div className="grid grid-cols-2 gap-4 p-4 border border-hueso-300 rounded-lg">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="caracteristicas"
                        value="visionNocturna"
                        onChange={handleChange}
                        checked={formData.caracteristicas.includes('visionNocturna')}
                        className="text-azul-cielo-500"
                      />
                      <span className="text-morado-700">Visión nocturna</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="caracteristicas"
                        value="audio"
                        onChange={handleChange}
                        checked={formData.caracteristicas.includes('audio')}
                        className="text-azul-cielo-500"
                      />
                      <span className="text-morado-700">Audio bidireccional</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="caracteristicas"
                        value="deteccionMovimiento"
                        onChange={handleChange}
                        checked={formData.caracteristicas.includes('deteccionMovimiento')}
                        className="text-azul-cielo-500"
                      />
                      <span className="text-morado-700">Detección de movimiento</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="caracteristicas"
                        value="altaResolucion"
                        onChange={handleChange}
                        checked={formData.caracteristicas.includes('altaResolucion')}
                        className="text-azul-cielo-500"
                      />
                      <span className="text-morado-700">Alta resolución (4K+)</span>
                    </label>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-morado-700 font-medium mb-2">Tipo de almacenamiento preferido</label>
                    <select
                      name="almacenamiento"
                      value={formData.almacenamiento}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-hueso-300 rounded-lg focus:ring-2 focus:ring-azul-cielo-500"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="nube">Almacenamiento en la nube</option>
                      <option value="tarjeta">Tarjeta SD</option>
                      <option value="dvr">DVR/NVR local</option>
                      <option value="nas">NAS empresarial</option>
                      <option value="hibrido">Híbrido</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-morado-700 font-medium mb-2">Presupuesto estimado</label>
                    <select
                      name="presupuesto"
                      value={formData.presupuesto}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-hueso-300 rounded-lg focus:ring-2 focus:ring-azul-cielo-500"
                    >
                      <option value="">Selecciona un rango</option>
                      <option value="1000-2000">$1,000 - $2,000 MXN</option>
                      <option value="2000-3500">$2,000 - $3,500 MXN</option>
                      <option value="3500-5000">$3,500 - $5,000 MXN</option>
                      <option value="5000-10000">$5,000 - $10,000 MXN</option>
                      <option value="10000-20000">$10,000 - $20,000 MXN</option>
                      <option value="20000-30000">$20,000 - $30,000 MXN</option>
                      <option value="30000+">Más de $30,000 MXN</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-morado-700 font-medium mb-2">Requisitos especiales*</label>
                  <textarea
                    name="descripcion"
                    placeholder="Ej: Necesito reconocimiento facial para empleados, integración con sistema de alarma existente, cámaras resistentes a lluvia..."
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-azul-cielo-500 ${errors.descripcion ? 'border-red-500' : 'border-hueso-300'
                      }`}
                  ></textarea>
                  {errors.descripcion && <span className="text-red-500 text-sm">{errors.descripcion}</span>}
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-azul-cielo-500 to-azul-cielo-600 hover:from-azul-cielo-600 hover:to-azul-cielo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Enviar solicitud
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-xl text-morado-700 font-medium">
              🔒 No esperes a que ocurra un incidente. La seguridad de tu familia y patrimonio no tiene precio.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Camaras;