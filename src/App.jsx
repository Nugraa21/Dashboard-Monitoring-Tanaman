import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DataPanel from './components/DataCard';
import client from './mqtt/mqttService';

function App() {
  const [suhu, setSuhu] = useState(null);
  const [kelembapan, setKelembapan] = useState(null);
  const [tanah, setTanah] = useState(null);

  useEffect(() => {
    client.on('message', (topic, message) => {
      if (topic === 'data/tanaman') {
        try {
          const data = JSON.parse(message.toString());
          setSuhu(data.suhu);
          setKelembapan(data.kelembapan_udara);
          setTanah(data.kelembapan_tanah);
        } catch (error) {
          console.error('Gagal parsing data JSON:', error);
        }
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-blue-800 flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl px-8 py-6 mb-10 text-center shadow-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300 tracking-tight">
          🌱 PlantSync Dashboard
        </h1>
        <p className="text-sm text-white/70 mt-3 font-medium">Real-time Monitoring via MQTT & ESP32</p>
      </motion.div>

      <DataPanel suhu={suhu} kelembapan={kelembapan} tanah={tanah} />

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-12 text-white/60 text-sm font-light"
      >
        &copy; 2025 nugra21 - Smart Plant Monitoring
      </motion.footer>
    </div>
  );
}

export default App;