import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, ArrowRight, Wifi, Waves, Utensils, Sprout, Car, Wind, Star, ChevronLeft, ChevronRight, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { storage } from '../services/storage';
import { formatCurrency } from '../lib/utils';

export default function Home() {
  const navigate = useNavigate();
  const rooms = storage.getRooms().filter(r => r.featured);
  const reviews = storage.getReviews().filter(r => r.approved);
  const gallery = storage.getGallery();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const isPaused = isHovered || isClicked;

  // Manejar clic fuera para reanudar el carrusel
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.review-card')) {
        setIsClicked(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Duplicamos las reseñas para el efecto infinito
  const marqueeReviews = [...reviews, ...reviews, ...reviews];

  const [search, setSearch] = useState({
    checkIn: '',
    checkOut: '',
    guests: '1'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/habitaciones?checkIn=${search.checkIn}&checkOut=${search.checkOut}&guests=${search.guests}`);
  };

  const services = [
    { icon: Wifi, name: 'WiFi Alta Velocidad' },
    { icon: Waves, name: 'Piscina Climatizada' },
    { icon: Utensils, name: 'Restaurante Gourmet' },
    { icon: Sprout, name: 'Spa & Wellness' },
    { icon: Car, name: 'Estacionamiento' },
    { icon: Wind, name: 'Aire Acondicionado' },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* 1. HERO */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000"
            alt="Hotel Hero"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Lumina Hotel & Spa
          </motion.h1>
          <motion.p 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="text-xl md:text-2xl mb-10 font-light text-gray-200"
          >
            Donde el lujo se encuentra con la serenidad en el corazón de la ciudad.
          </motion.p>
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/reserva"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-indigo-500/40"
            >
              Reservar ahora
            </Link>
            <Link
              to="/habitaciones"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-semibold transition-all"
            >
              Ver habitaciones
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. BUSCADOR */}
      <section className="max-w-7xl mx-auto px-4 -mt-32 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-600" /> Check-in
              </label>
              <input
                type="date"
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={search.checkIn}
                onChange={e => setSearch({...search, checkIn: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-600" /> Check-out
              </label>
              <input
                type="date"
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={search.checkOut}
                onChange={e => setSearch({...search, checkOut: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-600" /> Personas
              </label>
              <select
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={search.guests}
                onChange={e => setSearch({...search, guests: e.target.value})}
              >
                {[1,2,3,4,5,6].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Persona' : 'Personas'}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              Buscar disponibilidad
            </button>
          </form>
        </div>
      </section>

      {/* 3. HABITACIONES DESTACADAS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Habitaciones Destacadas</h2>
            <p className="text-gray-600">Seleccionadas cuidadosamente para su máximo confort.</p>
          </div>
          <Link to="/habitaciones" className="hidden md:flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all">
            Ver todas <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col"
            >
              <div className="relative h-64">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-indigo-600">
                  {formatCurrency(room.price)} / noche
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Hab. {room.number} - {room.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{room.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {room.capacity} pers.</span>
                  <span className="flex items-center gap-1"><Wifi className="h-4 w-4" /> WiFi</span>
                </div>
                <div className="mt-auto flex gap-2">
                  <Link
                    to={`/habitaciones/${room.id}`}
                    className="flex-1 text-center py-2 px-4 border border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
                  >
                    Detalles
                  </Link>
                  <Link
                    to={`/reserva?roomId=${room.id}`}
                    className="flex-1 text-center py-2 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Reservar
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. SERVICIOS */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Servicios del Hotel</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Todo lo que necesita para una estancia inolvidable.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
              >
                <service.icon className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
                <span className="font-semibold text-gray-800 text-sm">{service.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GALERÍA */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Galería del Hotel</h2>
          <p className="text-gray-600">Un vistazo a nuestras instalaciones de clase mundial.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((img, i) => (
            <motion.div
              key={img.id}
              whileHover={{ scale: 1.02 }}
              className={`relative overflow-hidden rounded-3xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
            >
              <img src={img.url} alt={img.title} className="w-full h-full object-cover aspect-square" referrerPolicy="no-referrer" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. RESEÑAS */}
      <section className="bg-indigo-600 py-24 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-indigo-100">Experiencias reales de huéspedes satisfechos.</p>
          </div>
        </div>

        <div 
          className="flex gap-8 px-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            animate={{
              x: isPaused ? 0 : [0, -2000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            className="flex gap-8"
          >
            {marqueeReviews.map((review, i) => (
              <div 
                key={`${review.id}-${i}`} 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsClicked(true);
                }}
                className="review-card w-[350px] md:w-[450px] flex-shrink-0 bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 shadow-xl transition-all hover:bg-white/20 hover:scale-105 cursor-pointer"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`} />
                  ))}
                </div>
                <p className="text-lg italic mb-6 line-clamp-4">"{review.comment}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{review.userName}</div>
                    <div className="text-xs text-indigo-200">{review.date}</div>
                  </div>
                  <div className="text-white/10 font-black text-4xl select-none">"</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. UBICACIÓN */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestra Ubicación</h2>
              <p className="text-gray-600 text-lg">
                Estamos ubicados en el corazón de San Isidro, el distrito financiero y más exclusivo de Lima. 
                Rodeados de los mejores restaurantes, centros comerciales y parques de la ciudad.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Dirección</h4>
                  <p className="text-gray-600">Av. Lujo 123, San Isidro, Lima, Perú</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                  <Navigation className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Puntos de Interés</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Centro Financiero (5 min)</li>
                    <li>• Parque El Olivar (10 min)</li>
                    <li>• Centro Comercial Larcomar (15 min)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=-12.097,-77.036" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <Navigation className="h-5 w-5" /> Cómo llegar
              </a>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=-12.097,-77.036" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all"
              >
                <ExternalLink className="h-5 w-5" /> Ver en Google Maps
              </a>
            </div>
          </div>

          <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.23456789!2d-77.036!3d-12.097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDA1JzQ5LjIiUyA3N8KwMDInMDkuNiJX!5e0!3m2!1ses!2spe!4v1620000000000!5m2!1ses!2spe" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
            ></iframe>
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl pointer-events-none transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Lumina Hotel & Spa</div>
                  <div className="text-sm text-gray-500">San Isidro, Lima</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
             <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">¿Listo para una estancia inolvidable?</h2>
            <Link
              to="/reserva"
              className="inline-block px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-xl transition-all shadow-2xl hover:shadow-indigo-500/50"
            >
              Reservar ahora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
