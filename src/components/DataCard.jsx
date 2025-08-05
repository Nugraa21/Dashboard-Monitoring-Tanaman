import React from 'react';
import { motion } from 'framer-motion';
import { WiHumidity, WiThermometer, WiRaindrop } from 'react-icons/wi';

const getCondition = (label, value) => {
  if (value === null) return { text: 'Mengambil data...', color: 'text-gray-300' };
  const v = parseFloat(value);
  switch (label) {
    case 'Suhu':
      if (v < 20) return { text: 'Dingin', color: 'text-blue-300' };
      if (v > 35) return { text: 'Panas', color: 'text-red-400' };
      return { text: 'Normal', color: 'text-green-300' };
    case 'Kelembapan Udara':
      if (v < 30) return { text: 'Kering', color: 'text-yellow-300' };
      if (v > 80) return { text: 'Lembap Tinggi', color: 'text-blue-300' };
      return { text: 'Normal', color: 'text-green-300' };
    case 'Kelembapan Tanah':
      if (v < 30) return { text: 'Kering', color: 'text-yellow-400' };
      if (v > 80) return { text: 'Basah', color: 'text-blue-400' };
      return { text: 'Ideal', color: 'text-green-300' };
    default:
      return { text: '-', color: 'text-white' };
  }
};

const DataPanel = ({ suhu, kelembapan, tanah }) => {
  const data = [
    { label: 'Suhu', icon: <WiThermometer className="text-5xl" />, value: suhu, unit: '°C' },
    { label: 'Kelembapan Udara', icon: <WiHumidity className="text-5xl" />, value: kelembapan, unit: '%' },
    { label: 'Kelembapan Tanah', icon: <WiRaindrop className="text-5xl" />, value: tanah, unit: '%' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="backdrop-blur-lg bg-white/10 border border-white/30 shadow-2xl rounded-3xl w-full max-w-5xl p-6 md:p-10 text-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {data.map((item, i) => {
          const cond = getCondition(item.label, item.value);
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white/5 rounded-xl p-4 hover:bg-white/10 duration-300"
            >
              <div className="mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold uppercase tracking-wide">{item.label}</h3>
              <p className="text-3xl font-bold">
                {item.value ?? '--'} <span className="text-xl">{item.unit}</span>
              </p>
              <p className={`text-sm mt-1 font-medium ${cond.color}`}>{cond.text}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DataPanel;
