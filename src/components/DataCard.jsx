import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WiHumidity, WiThermometer, WiRaindrop } from 'react-icons/wi';

const getCondition = (label, value) => {
  if (value === null) return { text: 'Mengambil data...', color: 'text-gray-400' };
  const v = parseFloat(value);
  switch (label) {
    case 'Suhu':
      if (v < 20) return { text: 'Dingin', color: 'text-blue-400' };
      if (v > 35) return { text: 'Panas', color: 'text-red-400' };
      return { text: 'Normal', color: 'text-green-400' };
    case 'Kelembapan Udara':
      if (v < 30) return { text: 'Kering', color: 'text-yellow-400' };
      if (v > 80) return { text: 'Lembap Tinggi', color: 'text-blue-400' };
      return { text: 'Normal', color: 'text-green-400' };
    case 'Kelembapan Tanah':
      if (v < 30) return { text: 'Kering', color: 'text-yellow-400' };
      if (v > 80) return { text: 'Basah', color: 'text-blue-400' };
      return { text: 'Ideal', color: 'text-green-400' };
    default:
      return { text: '-', color: 'text-white' };
  }
};

const DataPanel = ({ suhu, kelembapan, tanah }) => {
  const [modalData, setModalData] = useState(null);

  const data = [
    { label: 'Suhu', icon: <WiThermometer className="text-5xl text-orange-400" />, value: suhu, unit: '°C' },
    { label: 'Kelembapan Udara', icon: <WiHumidity className="text-5xl text-cyan-400" />, value: kelembapan, unit: '%' },
    { label: 'Kelembapan Tanah', icon: <WiRaindrop className="text-5xl text-green-400" />, value: tanah, unit: '%' },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-gray-900/20 border border-white/30 rounded-3xl w-full max-w-6xl p-8 md:p-12 text-white shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((item, i) => {
            const cond = getCondition(item.label, item.value);
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => setModalData({ ...item, condition: cond.text })}
                className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/20 shadow-lg"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold uppercase tracking-wider text-white/90">{item.label}</h3>
                <p className="text-4xl font-bold text-white">
                  {item.value ?? '--'} <span className="text-xl">{item.unit}</span>
                </p>
                <p className={`text-sm mt-2 font-medium ${cond.color}`}>{cond.text}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {modalData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setModalData(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-6">{modalData.icon}</div>
              <h2 className="text-2xl font-bold text-white text-center">{modalData.label}</h2>
              <p className="text-3xl font-semibold text-center text-cyan-300 mt-4">
                {modalData.value ?? '--'} {modalData.unit}
              </p>
              <p className="text-center text-lg mt-2 text-white/80">Status: <span className={getCondition(modalData.label, modalData.value).color}>{modalData.condition}</span></p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModalData(null)}
                className="mt-6 w-full bg-cyan-500 text-white font-semibold py-2 rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Tutup
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DataPanel;