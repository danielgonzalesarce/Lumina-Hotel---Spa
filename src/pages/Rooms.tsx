import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Users, Wifi, Wind, Coffee, Tv, Shield, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { storage } from '../services/storage';
import { Room, RoomType } from '../types';
import { formatCurrency } from '../lib/utils';

export default function Rooms() {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setRooms(storage.getRooms());
    const guestsParam = searchParams.get('guests');
    if (guestsParam) {
      // We could filter by capacity, but usually users want to see all and then decide
      // For now, let's just ensure the rooms are loaded
    }
  }, [searchParams]);

  const filteredRooms = rooms.filter(room => {
    const matchesType = filter === 'all' || room.type === filter;
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         room.description.toLowerCase().includes(searchTerm.toLowerCase());
    const guestsParam = parseInt(searchParams.get('guests') || '0');
    const matchesCapacity = guestsParam ? room.capacity >= guestsParam : true;
    
    return matchesType && matchesSearch && matchesCapacity;
  });

  const types = [
    { id: 'all', name: 'Todas' },
    { id: RoomType.Standard, name: 'Estándar' },
    { id: RoomType.Double, name: 'Doble' },
    { id: RoomType.Suite, name: 'Suite' },
    { id: RoomType.PremiumSuite, name: 'Premium' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Nuestras Habitaciones</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Encuentre el espacio perfecto para su descanso. Desde habitaciones acogedoras hasta suites de lujo.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {types.map(type => (
            <button
              key={type.id}
              onClick={() => setFilter(type.id)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === type.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar habitación..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Listado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRooms.map((room) => (
          <motion.div
            key={room.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col group"
          >
            <div className="relative h-72 overflow-hidden">
              <img
                src={room.images[0]}
                alt={room.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {room.type}
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-lg font-bold text-indigo-600 shadow-xl">
                {formatCurrency(room.price)} <span className="text-xs text-gray-500 font-normal">/ noche</span>
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Hab. {room.number} - {room.name}</h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                {room.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-indigo-500" />
                  <span>Hasta {room.capacity} pers.</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Wifi className="h-4 w-4 text-indigo-500" />
                  <span>WiFi Gratis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Wind className="h-4 w-4 text-indigo-500" />
                  <span>Aire Acond.</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-indigo-500" />
                  <span>Caja Fuerte</span>
                </div>
              </div>

              <div className="mt-auto flex gap-3">
                <Link
                  to={`/habitaciones/${room.id}`}
                  className="flex-1 text-center py-3 px-4 border-2 border-indigo-600 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all"
                >
                  Ver detalles
                </Link>
                <Link
                  to={`/reserva?roomId=${room.id}`}
                  className="flex-1 text-center py-3 px-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                >
                  Reservar
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron habitaciones</h3>
          <p className="text-gray-500">Intente ajustar sus filtros o términos de búsqueda.</p>
        </div>
      )}
    </div>
  );
}
