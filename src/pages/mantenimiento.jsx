import React, { useState } from 'react';
import api from '../api';

// URLs de imágenes de ejemplo
const imgVelocidad = "https://academia3e.com/wp-content/uploads/2021/08/herramientas-mantenimiento-pc-scaled.jpg";
const imgCalentamiento = "https://centrodereparacioncompusystem.com/wp-content/uploads/2020/07/tips-mantenimiento-a-equipo-de-computo.jpg";
const imgVidaUtil = "https://www.mgtech.cl/wp-content/uploads/2023/05/Fotos-web-1-2.jpg";
const imgSeguridad = "https://www.gestinet.com/wp-content/uploads/2021/02/Mantenimiento-informatico.jpg";
const imgFisico = "https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/media/image/2021/09/montaje-ordenador-2472785.jpg?tf=3840x";

const Mantenimiento = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errorTelefono, setErrorTelefono] = useState('');
  const [errorCorreo, setErrorCorreo] = useState('');

  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const beneficios = [
    {
      titulo: "1. Mayor velocidad y eficiencia",
      imagen: imgVelocidad,
      puntos: [
        "Eliminamos archivos basura, software obsoleto y optimizamos el sistema.",
        "Actualizamos controladores y sistemas operativos para un rendimiento fluido.",
        "Ideal para evitar lentitud en laptops y equipos de escritorio por falta de mantenimiento."
      ],
      color: "azul-cielo"
    },
    {
      titulo: "2. Protección contra el sobrecalentamiento",
      imagen: imgCalentamiento,
      puntos: [
        "Limpieza profunda de ventiladores y disipadores (¡el polvo es el enemigo silencioso!).",
        "Aplicación de pasta térmica nueva en CPUs/GPUs para un mejor enfriamiento.",
        "Evita apagados repentinos y daños por altas temperaturas (especialmente crítico en laptops)."
      ],
      color: "morado"
    },
    {
      titulo: "3. Extiende la vida útil de tu equipo",
      imagen: imgVidaUtil,
      puntos: [
        "Revisión de componentes críticos: discos duros, fuentes de poder, tarjetas madre.",
        "Prevenimos fallos por desgaste antes de que ocurran.",
        "Ahorras dinero: Un mantenimiento cuesta menos que una reparación mayor o comprar equipo nuevo."
      ],
      color: "azul-cielo"
    },
    {
      titulo: "4. Seguridad y prevención de desastres",
      imagen: imgSeguridad,
      puntos: [
        "Diagnóstico de discos duros/SSD para evitar pérdida de información.",
        "Eliminación de virus, spyware y ransomware que ponen en riesgo tus archivos.",
        "Backup básico de datos importantes (opcional)."
      ],
      color: "morado"
    },
    {
      titulo: "5. Mantenimiento físico profesional",
      imagen: imgFisico,
      puntos: [
        "Equipos de escritorio: Limpieza interna, revisión de conexiones y cableado.",
        "Laptops: Atención especial a baterías, teclados y sistemas de ventilación compactos.",
        "Usamos herramientas y productos especializados para no dañar componentes delicados."
      ],
      color: "azul-cielo"
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
        tipo: 'mantenimiento',
        fecha: new Date().toISOString()
      };

      await api.post('/notifications', {
        type: 'service_request',
        data: datosCliente
      });

      setMensaje('¡Solicitud enviada con éxito! Estaremos en contacto contigo lo más pronto posible.');

      setNombre('');
      setCorreo('');
      setTelefono('');
      setDescripcion('');
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      setMensaje('Hubo un error al enviar tu solicitud. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-hueso-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-morado-600 via-azul-cielo-500 to-morado-700"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-hueso-50 mb-8 leading-tight">
              ¿Por qué contratar nuestro servicio de mantenimiento para tu computadora?
            </h1>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-xl text-hueso-100 leading-relaxed">
                Mantener tu equipo en óptimas condiciones <span className="font-bold text-azul-cielo-200">no es un lujo, es una necesidad</span>. Ya sea una computadora de escritorio o una laptop, el polvo, el desgaste natural y la falta de cuidados pueden generar fallos costosos, pérdida de productividad e incluso la pérdida irreversible de tus datos.
              </p>
              <p className="text-lg text-hueso-200">
                En <span className="font-bold text-azul-cielo-300">CONEXA</span>, ofrecemos mantenimiento preventivo y correctivo para alargar la vida de tu equipo, mejorar su rendimiento y evitar gastos innecesarios.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-hueso-50 to-transparent"></div>
      </section>

      {/* Beneficios Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-morado-700 mb-4">
              Beneficios de nuestro servicio
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-16">
            {beneficios.map((beneficio, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                <div className={`${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative group">
                    <div className={`absolute -inset-4 bg-gradient-to-r from-${beneficio.color}-500 to-morado-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000`}></div>
                    <img
                      src={beneficio.imagen}
                      alt={beneficio.titulo}
                      className="relative rounded-3xl shadow-2xl w-full h-80 object-cover transform group-hover:scale-105 transition duration-500"
                    />
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className={`bg-white rounded-3xl p-8 shadow-xl border-l-4 border-${beneficio.color}-400`}>
                    <h3 className="text-2xl font-bold text-morado-700 mb-6">
                      {beneficio.titulo}
                    </h3>
                    <ul className="space-y-4">
                      {beneficio.puntos.map((punto, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <svg className={`w-6 h-6 text-${beneficio.color}-500 mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-morado-600 leading-relaxed">
                            {punto.split('**').map((part, partIdx) =>
                              partIdx % 2 === 1 ? <strong key={partIdx} className="text-azul-cielo-600">{part}</strong> : part
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frecuencia Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-morado-700 mb-4">
              ¿Cada cuánto se debe hacer mantenimiento?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-azul-cielo-100 to-white rounded-3xl p-8 shadow-xl text-center">
              <div className="bg-azul-cielo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-morado-700 mb-4">
                Mantenimiento básico (software)
              </h3>
              <p className="text-3xl font-bold text-azul-cielo-600 mb-2">3-6 meses</p>
              <p className="text-morado-600">Optimización y limpieza del sistema</p>
            </div>

            <div className="bg-gradient-to-br from-morado-100 to-white rounded-3xl p-8 shadow-xl text-center">
              <div className="bg-morado-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-morado-700 mb-4">
                Mantenimiento físico (hardware)
              </h3>
              <p className="text-3xl font-bold text-morado-600 mb-2">6-12 meses</p>
              <p className="text-morado-600">Limpieza profunda y revisión de componentes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-hueso-100 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-azul-cielo-500 text-white px-6 py-3 rounded-full text-lg font-semibold mb-8 shadow-lg">
              <span className="mr-2">✨</span>
              No dudes más
            </div>

            {!mostrarFormulario ? (
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-morado-700 mb-6">
                  ¿Te interesa nuestro servicio?
                </h2>
                <button
                  className="bg-gradient-to-r from-azul-cielo-500 to-azul-cielo-600 hover:from-azul-cielo-600 hover:to-azul-cielo-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={() => setMostrarFormulario(true)}
                >
                  📝 Te invitamos a completar nuestro formulario y un asesor se pondrá en contacto contigo!
                </button>
                <p className="text-lg text-morado-600">
                  Evita que tu computadora falle en el peor momento.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-morado-700 mb-8">
                  Solicitud de servicio
                </h2>
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
                      Teléfono (10 dígitos)
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

                  <div>
                    <label className="block text-sm font-medium text-morado-700 mb-2">
                      Describe el problema o servicio que necesitas
                    </label>
                    <textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      className="w-full px-4 py-3 border border-hueso-300 rounded-2xl focus:ring-2 focus:ring-azul-cielo-500 focus:border-transparent transition-all duration-300"
                      placeholder="Describe qué tipo de mantenimiento necesitas..."
                      rows="4"
                      required
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setMostrarFormulario(false);
                        setMensaje('');
                      }}
                      className="flex-1 bg-hueso-200 hover:bg-hueso-300 text-morado-700 font-semibold py-3 px-6 rounded-2xl transition-all duration-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-azul-cielo-500 to-azul-cielo-600 hover:from-azul-cielo-600 hover:to-azul-cielo-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Enviar solicitud
                    </button>
                  </div>
                </form>

                {mensaje && (
                  <div className="mt-6 p-4 bg-azul-cielo-50 border border-azul-cielo-200 rounded-2xl">
                    <p className="text-azul-cielo-700 text-center">{mensaje}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-morado-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-morado-700 mb-4">
              ¿Por qué elegirnos?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
              <div className="bg-morado-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-morado-700 mb-2">Técnicos certificados</h3>
              <p className="text-sm text-morado-600">Con experiencia en marcas como Dell, HP, Lenovo, ASUS, etc.</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
              <div className="bg-azul-cielo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-morado-700 mb-2">Servicio a domicilio</h3>
              <p className="text-sm text-morado-600">(Opcional) para mayor comodidad</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
              <div className="bg-morado-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-morado-700 mb-2">Garantía por escrito</h3>
              <p className="text-sm text-morado-600">En nuestros trabajos</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-2xl font-bold text-morado-700">
              💻 <span className="text-azul-cielo-600">No esperes a que tu equipo falle...</span> ¡Protege tu inversión hoy!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mantenimiento;