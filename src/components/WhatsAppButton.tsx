import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { storage } from '../services/storage';

export default function WhatsAppButton() {
  const config = storage.getConfig();
  const phoneNumber = config.whatsapp;
  const message = encodeURIComponent('Hola, quiero información sobre las habitaciones del hotel.');
  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 transition-colors"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-green-500 -z-10"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <MessageCircle className="h-7 w-7" />
    </motion.a>
  );
}
