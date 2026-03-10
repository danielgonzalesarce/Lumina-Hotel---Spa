import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, CheckCircle2, Info } from 'lucide-react';
import { storage } from '../services/storage';
import { Room, Reservation } from '../types';
import { formatCurrency } from '../lib/utils';
import { differenceInDays, parseISO } from 'date-fns';

export default function ReservationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get('roomId');
  
  const [room, setRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState(storage.getCurrentUser());
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '1'),
    extras: {
      breakfast: false,
      shuttle: false,
      extraBed: false
    }
  });

  useEffect(() => {
    const found = storage.getRooms().find(r => r.id === roomId);
    if (found) setRoom(found);
  }, [roomId]);

  const nights = formData.checkIn && formData.checkOut 
    ? Math.max(0, differenceInDays(parseISO(formData.checkOut), parseISO(formData.checkIn)))
    : 0;

  const extrasPrice = (formData.extras.breakfast ? 15 : 0) + 
                      (formData.extras.shuttle ? 30 : 0) + 
                      (formData.extras.extraBed ? 25 : 0);
  
  const totalPrice = room ? (room.price * nights) + extrasPrice : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;

    const newReservation: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      roomId: room.id,
      roomName: `Hab. ${room.number} - ${room.name}`,
      userId: currentUser?.id || 'guest',
      userName: formData.name,
      userEmail: formData.email,
      userPhone: formData.phone,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      totalPrice: totalPrice,
      status: 'pending',
      extras: formData.extras,
      createdAt: new Date().toISOString()
    };

    storage.saveReservation(newReservation);
    alert('¡Reserva realizada con éxito! Puede verla en su panel.');
    navigate(currentUser ? '/user/mis-reservas' : '/');
  };

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Por favor seleccione una habitación primero</h2>
        <button onClick={() => navigate('/habitaciones')} className="bg-indigo-600 text-white px-6 py-2 rounded-full">Ver Habitaciones</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">Confirmar su Reserva</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Formulario */}
        <div className="lg:col-span-2 space-y-8">
          <form id="reservation-form" onSubmit={handleSubmit} className="space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" /> Datos Personales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Teléfono</label>
                  <input
                    type="tel"
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" /> Detalles de la Estancia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Check-in</label>
                  <input
                    type="date"
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.checkIn}
                    onChange={e => setFormData({...formData, checkIn: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Check-out</label>
                  <input
                    type="date"
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.checkOut}
                    onChange={e => setFormData({...formData, checkOut: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Huéspedes</label>
                  <select
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={formData.guests}
                    onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
                  >
                    {[...Array(room.capacity)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1} {i === 0 ? 'Huésped' : 'Huéspedes'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Info className="h-5 w-5 text-indigo-600" /> Servicios Adicionales
              </h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-indigo-600 rounded"
                    checked={formData.extras.breakfast}
                    onChange={e => setFormData({...formData, extras: {...formData.extras, breakfast: e.target.checked}})}
                  />
                  <div className="flex-grow">
                    <div className="font-semibold">Desayuno Buffet</div>
                    <div className="text-xs text-gray-500">Variedad de platos locales e internacionales (+S/ 15.00)</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-indigo-600 rounded"
                    checked={formData.extras.shuttle}
                    onChange={e => setFormData({...formData, extras: {...formData.extras, shuttle: e.target.checked}})}
                  />
                  <div className="flex-grow">
                    <div className="font-semibold">Transporte al Aeropuerto</div>
                    <div className="text-xs text-gray-500">Recojo o traslado privado (+S/ 30.00)</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-indigo-600 rounded"
                    checked={formData.extras.extraBed}
                    onChange={e => setFormData({...formData, extras: {...formData.extras, extraBed: e.target.checked}})}
                  />
                  <div className="flex-grow">
                    <div className="font-semibold">Cama Adicional</div>
                    <div className="text-xs text-gray-500">Para mayor comodidad de sus acompañantes (+S/ 25.00)</div>
                  </div>
                </label>
              </div>
            </section>
          </form>
        </div>

        {/* Resumen */}
        <div className="space-y-6">
          <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-24">
            <h3 className="text-2xl font-bold mb-8">Resumen de Reserva</h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-gray-400 text-sm">Habitación</div>
                  <div className="font-bold">Hab. {room.number} - {room.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-sm">Noches</div>
                  <div className="font-bold">{nights}</div>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Habitación ({nights} noches)</span>
                  <span>{formatCurrency(room.price * nights)}</span>
                </div>
                {formData.extras.breakfast && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Desayuno Buffet</span>
                    <span>{formatCurrency(15)}</span>
                  </div>
                )}
                {formData.extras.shuttle && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Transporte</span>
                    <span>{formatCurrency(30)}</span>
                  </div>
                )}
                {formData.extras.extraBed && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Cama Adicional</span>
                    <span>{formatCurrency(25)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-6 flex justify-between items-center">
                <span className="text-xl font-bold">Total a pagar</span>
                <span className="text-3xl font-bold text-indigo-400">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <button
              form="reservation-form"
              type="submit"
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              <CreditCard className="h-6 w-6" /> Confirmar Reserva
            </button>
            
            <p className="mt-6 text-xs text-gray-500 text-center">
              Al confirmar, acepta nuestros términos y condiciones de reserva.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
