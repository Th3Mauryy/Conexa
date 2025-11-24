import React, { useState } from 'react';

const Internet = () => {
  const [faqVisibility, setFaqVisibility] = useState({});

  const toggleFaq = (index) => {
    setFaqVisibility((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const faqs = [
    {
      question: '¿Qué es una topología de red en malla?',
      answer:
        'Es una estructura donde cada nodo está conectado a uno o más nodos, proporcionando múltiples rutas para los datos. Esto aumenta la fiabilidad y la redundancia de la red.',
    },
    {
      question: '¿Puedo usar ambos WiFi de 2.4 GHz y 5 GHz?',
      answer:
        'Sí, nuestros routers son dual-band, lo que significa que puedes conectarte a la frecuencia que mejor se adapte a tus necesidades. El WiFi de 2.4 GHz es ideal para mayor cobertura, mientras que el de 5 GHz ofrece mayor velocidad en distancias más cortas.',
    },
    {
      question: '¿Qué ventajas tiene el Internet híbrido?',
      answer:
        'El Internet híbrido combina la estabilidad de la fibra óptica con la cobertura global del satélite, ofreciendo un servicio más resistente a interrupciones y fallos externos.',
    },
    {
      question: '¿Cómo puedo contratar el servicio?',
      answer:
        'Ponte en contacto con nosotros a través de nuestro sitio web o llámanos al número de atención al cliente. Nuestro equipo estará encantado de ayudarte.',
    },
    {
      question: '¿Cuál es la cobertura y qué alcance en metros tiene el módem?',
      answer:
        'En cuanto al alcance del módem dentro de tu hogar, este puede variar según el tipo de construcción, interferencias y ubicación del dispositivo. Generalmente, un módem WiFi tiene un alcance de entre 10 y 30 metros en interiores. Si necesitas mayor cobertura, puedes optar por repetidores de señal o un sistema de malla WiFi.',
    },
    {
      question: '¿Cuántos teléfonos y/o equipos soporta cada paquete?',
      answer:
        'El número de dispositivos que pueden conectarse simultáneamente depende del paquete contratado y del tipo de uso que se le dé a la conexión. A continuación, te damos una referencia aproximada:\n\n- **5MG** → Hasta 3 dispositivos para navegación básica (redes sociales, correo y navegación web).\n- **10MG** → Hasta 6 dispositivos con navegación fluida y reproducción de videos en calidad estándar.\n- **15MG** → Hasta 10 dispositivos con transmisión en HD y videollamadas sin interrupciones.\n- **20MG** → Hasta 15 dispositivos con juegos en línea, streaming en 4K y descargas rápidas.\n\nEl rendimiento también puede verse afectado por la cantidad de dispositivos conectados al mismo tiempo y el tipo de actividad realizada en cada uno. Si necesitas más velocidad o estabilidad, puedes consultar opciones como repetidores de señal o una conexión por cable ethernet.',
    }
  ];

  return (
    <div className="min-h-screen bg-hueso-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-morado-600 via-azul-cielo-500 to-morado-700"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-hueso-50 mb-6">
              Internet de Alta Velocidad
            </h1>
            <p className="text-xl text-hueso-100 max-w-3xl mx-auto leading-relaxed">
              Instalamos y configuramos Internet para tu hogar o negocio con la mejor tecnología disponible.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-hueso-50 to-transparent"></div>
      </section>

      {/* Topología de Red */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-morado-700 mb-4">
              Topología de Red
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-hueso-100 to-white p-8 rounded-3xl shadow-xl">
                <p className="text-lg text-morado-700 leading-relaxed">
                  Nuestra red utiliza una topología de <span className="font-bold text-azul-cielo-600">Malla</span>, lo que garantiza una conexión robusta y confiable. Esta estructura permite que los nodos de la red estén interconectados, proporcionando múltiples rutas para los datos y asegurando que, incluso en caso de fallos en algún punto, la conexión se mantenga activa.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-morado-500 to-azul-cielo-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <img
                  src="https://media2.giphy.com/media/waew7tMWAh200/200w.webp?cid=790b7611hw6gtzoexmxim1jhmb6amb8b8t7wqilwr17q81ko&ep=v1_gifs_search&rid=200w.webp&ct=g"
                  alt="Topología de Malla"
                  className="relative rounded-3xl shadow-2xl w-full transform group-hover:scale-105 transition duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Qué ofrecemos? */}
      <section className="py-20 bg-hueso-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-morado-700 mb-4">
              ¿Qué ofrecemos?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-t-4 border-azul-cielo-400">
              <div className="text-center mb-6">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-azul-cielo-400 to-morado-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <img
                    src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHczeTI0cmxpeTJpOWF3a240ZWswb3Q4MTk0ZHRqbzlzbWo1OW42ZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/emySgWo0iBKWqni1wR/200w.webp"
                    alt="Velocidad"
                    className="relative rounded-2xl mx-auto w-32 h-24 object-cover"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-morado-700 mb-4 text-center">Velocidad</h3>
              <p className="text-morado-600 text-center leading-relaxed">
                Ofrecemos velocidades de hasta 100 Mbps, adaptables a tus necesidades.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-t-4 border-morado-400">
              <div className="text-center mb-6">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-morado-400 to-azul-cielo-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <img
                    src="https://media3.giphy.com/media/WTu5YH9J0kyVtymRIe/200.webp?cid=790b7611tckcv4sv4n69w38uzaes39lph0w9bayu25lrwves&ep=v1_gifs_search&rid=200.webp&ct=g"
                    alt="Tecnología WiFi"
                    className="relative rounded-2xl mx-auto w-32 h-24 object-cover"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-morado-700 mb-4 text-center">Tecnología WiFi</h3>
              <p className="text-morado-600 text-center leading-relaxed">
                Soporte para redes WiFi de 2.4 GHz y 5 GHz, lo que te permite conectar todos tus dispositivos con la mejor calidad de señal.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-t-4 border-azul-cielo-600">
              <div className="text-center mb-6">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-azul-cielo-600 to-morado-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <img
                    src="https://media1.giphy.com/media/yI2e6qMaZeNcQ/giphy.webp?cid=ecf05e47iq3h553q6dcqsln7yep3s16sfvzm5kmw3b3nbr5r&ep=v1_gifs_related&rid=giphy.webp&ct=g"
                    alt="Cobertura"
                    className="relative rounded-2xl mx-auto w-32 h-24 object-cover"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-morado-700 mb-4 text-center">Cobertura</h3>
              <p className="text-morado-600 text-center leading-relaxed">
                Nuestra infraestructura está diseñada para ofrecer cobertura en áreas urbanas y rurales, con una conexión estable y de baja latencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Paquetes de Internet */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-morado-700 mb-4">
              Paquetes de Internet
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-morado-600 max-w-4xl mx-auto">
              Ofrecemos diferentes paquetes de Internet para adaptarnos a tus necesidades. A continuación, te explicamos las ventajas y diferencias de cada uno:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-hueso-100 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-azul-cielo-500 to-azul-cielo-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">5</span>
                </div>
                <h3 className="text-2xl font-bold text-morado-700">5 Mbps</h3>
              </div>
              <div className="space-y-3 text-sm text-morado-600">
                <p><span className="font-bold text-azul-cielo-600">Ideal para:</span> Usuarios que navegan en redes sociales, revisan correos electrónicos y consumen contenido ligero.</p>
                <p><span className="font-bold text-azul-cielo-600">Ventajas:</span> Económico y suficiente para tareas básicas.</p>
                <p><span className="font-bold text-azul-cielo-600">Dispositivos:</span> Hasta 3 dispositivos conectados simultáneamente.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-hueso-100 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-morado-500 to-morado-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">10</span>
                </div>
                <h3 className="text-2xl font-bold text-morado-700">10 Mbps</h3>
              </div>
              <div className="space-y-3 text-sm text-morado-600">
                <p><span className="font-bold text-azul-cielo-600">Ideal para:</span> Familias pequeñas o personas que trabajan desde casa.</p>
                <p><span className="font-bold text-azul-cielo-600">Ventajas:</span> Velocidad adecuada para streaming en HD, videollamadas y descargas moderadas.</p>
                <p><span className="font-bold text-azul-cielo-600">Dispositivos:</span> Hasta 6 dispositivos conectados simultáneamente.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-hueso-100 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-azul-cielo-600 to-azul-cielo-700 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">15</span>
                </div>
                <h3 className="text-2xl font-bold text-morado-700">15 Mbps</h3>
              </div>
              <div className="space-y-3 text-sm text-morado-600">
                <p><span className="font-bold text-azul-cielo-600">Ideal para:</span> Hogares con múltiples usuarios y dispositivos conectados.</p>
                <p><span className="font-bold text-azul-cielo-600">Ventajas:</span> Velocidad rápida para streaming en 4K, juegos en línea y descargas rápidas.</p>
                <p><span className="font-bold text-azul-cielo-600">Dispositivos:</span> Hasta 10 dispositivos conectados simultáneamente.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-morado-100 to-azul-cielo-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ring-2 ring-morado-300">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-morado-600 to-azul-cielo-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">20</span>
                </div>
                <h3 className="text-2xl font-bold text-morado-700">20 Mbps</h3>
                <span className="bg-azul-cielo-500 text-white px-3 py-1 rounded-full text-xs font-medium">RECOMENDADO</span>
              </div>
              <div className="space-y-3 text-sm text-morado-600">
                <p><span className="font-bold text-azul-cielo-600">Ideal para:</span> Negocios pequeños o hogares con altas demandas de conectividad.</p>
                <p><span className="font-bold text-azul-cielo-600">Ventajas:</span> Máxima velocidad para múltiples actividades simultáneas, como streaming en 4K, teletrabajo y descargas pesadas.</p>
                <p><span className="font-bold text-azul-cielo-600">Dispositivos:</span> Hasta 15 dispositivos conectados simultáneamente.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Internet Híbrido */}
      <section className="py-20 bg-hueso-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-morado-700 mb-4">
              Próximamente: Internet Híbrido
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-1">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-azul-cielo-500 to-morado-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <img
                  src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDkxOHhxNm4xNGN2cHUxZW0wMzltN2RsMGZjd2h0YWg1bXk4eTY1dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l41YvpiA9uMWw5AMU/giphy.gif"
                  alt="Internet Híbrido"
                  className="relative rounded-3xl shadow-2xl w-full transform group-hover:scale-105 transition duration-500"
                />
              </div>
            </div>
            <div className="order-2">
              <div className="bg-gradient-to-br from-white to-hueso-100 p-8 rounded-3xl shadow-xl">
                <p className="text-lg text-morado-700 leading-relaxed">
                  Actualmente, ofrecemos Internet satelital de alta calidad, pero muy pronto implementaremos{' '}
                  <span className="font-bold text-azul-cielo-600">fibra óptica</span>. Esto nos permitirá ofrecer un servicio híbrido que combina lo mejor de ambas tecnologías. Con esta solución, tendrás un respaldo automático en caso de interrupciones causadas por fenómenos naturales o fallos externos, garantizando que siempre estés conectado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-morado-700 mb-4">
              Preguntas Frecuentes
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-hueso-50 rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left focus:outline-none focus:ring-2 focus:ring-morado-300 transition-colors duration-300 hover:bg-hueso-100"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-morado-700 pr-4">
                      {faq.question}
                    </h3>
                    <svg
                      className={`w-6 h-6 text-azul-cielo-500 transform transition-transform duration-300 ${
                        faqVisibility[index] ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ${
                  faqVisibility[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-8 pb-6">
                    <div className="border-t border-hueso-200 pt-4">
                      <p className="text-morado-600 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Internet;