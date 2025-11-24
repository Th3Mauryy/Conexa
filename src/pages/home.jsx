import React, { useState } from 'react';

function Home() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [porqueElegirnosIndex, setPorqueElegirnosIndex] = useState(0);

  const handleToggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const toggleImage = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const ventajas = [
    {
      titulo: "✅ Velocidad garantizada",
      descripcion: "Ofrecemos velocidades de internet que se adaptan a tus necesidades, ya sea para uso doméstico o empresarial.",
      imagen: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG82OWNoNHlmYm1zZndjaTFsejgzaHlpMGM4ZmV3ejRiMTB0ZXVjcCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Jo1Ox5v5pV9g9ati4S/100.webp",
    },
    {
      titulo: "✅ Soporte técnico 24/7",
      descripcion: "Nuestro equipo de soporte está disponible de Lunes a Viernes en un horario de 9:00 am a 2:00 pm y de 5:00 pm a 7:00 pm , para resolver cualquier problema.",
      imagen: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnY1bXJiOTJxdnNkbWwxZW1uYzdoMGVteGhzZG9lNjVwaTBveGk4dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zBSmegjNjsfVR7Hs5I/giphy.gif",
    },
    {
      titulo: "✅ Sin contratos forzosos",
      descripcion: "No te atamos con contratos largos. Puedes disfrutar de nuestros servicios sin compromisos a largo plazo.",
      imagen: "https://st.depositphotos.com/15585482/54810/v/450/depositphotos_548102544-stock-illustration-contract-cancellation-business-concept.jpg",
    },
    {
      titulo: "✅ Instalación rápida",
      descripcion: "Nuestro equipo de instalación está listo para conectarte en el menor tiempo posible.",
      imagen: "https://thenetworkinstallers.com/wp-content/uploads/2022/06/wifi-installation.jpg",
    },
    {
      titulo: "✅ Precios transparentes",
      descripcion: "Sin cargos ocultos. Sabrás exactamente lo que pagas desde el primer día.",
      imagen: "https://media3.giphy.com/media/ADgfsbHcS62Jy/200w.webp?cid=790b7611hphw2xirci7m8kitcts9o3ftilvahlohotu1l91n&ep=v1_gifs_search&rid=200w.webp&ct=g",
    },
    {
      titulo: "✅ Conectividad sin interrupciones, incluso en emergencias",
      descripcion: "Nuestro internet satelital te ofrece conexión estable y pronto será híbrido con fibra óptica, garantizando respaldo en caso de fallas por fenómenos naturales o daños inesperados.",
      imagen: "https://img.freepik.com/foto-gratis/amigos-icono-senal-wifi_53876-146439.jpg",
    },
  ];

  const porqueElegirnosItems = [
    {
      text: "✅ Contamos con la mejor respuesta de atención en caso de fallas en nuestro servicio.",
      image: "https://blog.conzultek.com/hs-fs/hubfs/mantenimiento-de-redes-2.png?width=2400&name=mantenimiento-de-redes-2.png",
    },
    {
      text: "✅ Tenemos una amplia cobertura en cualquiera de los lugares que tengamos nuestro servicio.",
      image: "https://www.redeszone.net/app/uploads-redeszone.net/2020/11/Insternet-Casa.jpg",
    },
    {
      text: "✅ Contamos con la mejor velocidad de red para que navegues en tus aplicaciones favoritas.",
      image: "https://www.codigosanluis.com/wp-content/uploads/2021/11/wifi-2214137.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-hueso-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-morado-600/70 via-morado-500/60 to-azul-cielo-500/70"></div>
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: "url('https://www.informador.mx/__export/1632926021108/sites/elinformador/img/2021/09/29/rs889740_2289305-dig-2015-02-26-0502_crop1632926020173.jpg_1615471961.jpg')",
            backgroundSize: '100% 110%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="relative z-10 px-4 py-20 sm:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-hueso-50 mb-6 leading-tight">
              <span className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 inline-block">
                "Donde quiera que estés llegamos para conectarnos"
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-hueso-100 max-w-4xl mx-auto leading-relaxed">
              Conoce la nueva red de internet en Colima, vive la experiencia.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-hueso-50 to-transparent"></div>
      </section>

      {/* Quiénes somos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-morado-700 mb-4">
              Quiénes somos
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-hueso-100 to-white p-8 rounded-3xl shadow-xl">
                <p className="text-lg text-morado-700 leading-relaxed">
                  Somos una empresa de servicios de telecomunicaciones que cuenta con la mejor conectividad y 
                  los mejores paquetes que se adaptan a todo tipo de clientes y sus necesidades.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-morado-500 to-azul-cielo-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <img
                  src="https://st4.depositphotos.com/13193658/29566/i/600/depositphotos_295663768-stock-photo-four-multiethnic-colleagues-formal-wear.jpg"
                  alt="Imagen de Quiénes somos"
                  className="relative rounded-3xl shadow-2xl w-full h-auto transform group-hover:scale-105 transition duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-20 bg-hueso-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-morado-700 mb-4">
              ¿Por qué elegirnos?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-1">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-azul-cielo-500 to-morado-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <img 
                  src={porqueElegirnosItems[porqueElegirnosIndex].image} 
                  alt={`Imagen ${porqueElegirnosIndex + 1}`}
                  className="relative rounded-3xl shadow-2xl w-full h-80 object-cover transform transition duration-500"
                />
              </div>
            </div>
            <div className="order-2">
              <div className="space-y-4">
                {porqueElegirnosItems.map((item, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      index === porqueElegirnosIndex 
                        ? 'bg-gradient-to-r from-morado-500 to-azul-cielo-500 text-white shadow-xl' 
                        : 'bg-white text-morado-700 shadow-md hover:shadow-lg border-l-4 border-azul-cielo-400'
                    }`}
                    onMouseEnter={() => setPorqueElegirnosIndex(index)}
                  >
                    <p className={`text-lg font-medium ${index === porqueElegirnosIndex ? 'text-white' : 'text-morado-700'}`}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ventajas de elegir CONEXA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-morado-700 mb-4">
              Ventajas de elegir CONEXA
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ventajas.map((ventaja, index) => (
              <div
                key={index}
                className={`bg-hueso-50 rounded-3xl p-8 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:shadow-2xl border-t-4 border-azul-cielo-400 flex flex-col h-full ${
                  expandedIndex === index ? 'shadow-2xl ring-2 ring-morado-300' : 'shadow-lg'
                }`}
                onClick={() => {
                  handleToggleExpand(index);
                  toggleImage(index);
                }}
              >
                <h3 className="text-xl font-bold text-morado-700 mb-4 min-h-[3.5rem] flex items-center">
                  {ventaja.titulo}
                </h3>
                
                <div className={`overflow-hidden transition-all duration-500 ${
                  expandedIndex === index ? 'max-h-96' : 'max-h-0'
                }`}>
                  <p className="text-morado-600 mb-6 leading-relaxed">
                    {ventaja.descripcion}
                  </p>
                  
                  <div className={`transition-all duration-500 transform ${
                    activeIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}>
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-gradient-to-r from-morado-400 to-azul-cielo-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                      <img 
                        src={ventaja.imagen} 
                        alt={`Imagen ${index + 1}`}
                        className="relative rounded-2xl w-full h-48 object-cover shadow-lg transform group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 text-center">
                  <span className="text-azul-cielo-500 font-medium">
                    {expandedIndex === index ? 'Contraer' : 'Expandir'} →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ubicación en el mapa */}
      <section className="py-20 bg-hueso-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-morado-700 mb-4">
              Nuestra ubicación
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-morado-600 max-w-2xl mx-auto">
              Visítanos en nuestra oficina principal:
            </p>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-morado-500 to-azul-cielo-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3760.719041983694!2d-103.7133379246865!3d19.24534488180872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84255aa46b9dfd13%3A0xee526d1e1385b0cc!2sAv.%20San%20Fernando%20533-30%2C%20Camino%20Real%2C%2028014%20Colima%2C%20Col.!5e0!3m2!1ses!2smx!4v1697050000000!5m2!1ses!2smx"
              width="100%"
              height="450"
              className="relative rounded-3xl shadow-2xl border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Extensión de Conexa */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-morado-700 mb-4">
              Extensión de Conexa
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-morado-500 to-azul-cielo-500 mx-auto rounded-full mb-6"></div>
            <div className="bg-gradient-to-br from-hueso-100 to-white p-8 rounded-3xl shadow-xl max-w-4xl mx-auto mb-12">
              <p className="text-lg text-morado-700 leading-relaxed">
                En <span className="font-bold text-azul-cielo-600">CONEXA</span>, nos comprometemos a ofrecer{' '}
                <span className="font-bold text-morado-600">conexión de calidad y un soporte técnico excepcional</span> en Colima. 
                Nuestra red sigue creciendo para llevar{' '}
                <span className="font-bold text-azul-cielo-600">internet confiable y accesible a más hogares y negocios</span>, 
                conectando a las comunidades con el mundo digital.
              </p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-azul-cielo-500 to-morado-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <iframe
              src="https://www.google.com/maps/d/u/0/embed?mid=15tZm1xvCMf8_Ou0sRSfrbJCO_T1_mzc&ehbc=2E312F&noprof=1"
              width="100%"
              height="450"
              className="relative rounded-3xl shadow-2xl border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;