import React, { useEffect, useState } from 'react';
import client from './mqtt/mqttService';
import DataPanel from './components/DataCard';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-900 flex flex-col items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-xl px-6 py-4 mb-8 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide">🌿 Monitoring Tanaman</h1>
        <p className="text-sm text-white/60 mt-2">Realtime via MQTT & ESP32</p>
      </motion.div>

      <DataPanel suhu={suhu} kelembapan={kelembapan} tanah={tanah} />

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-10 text-white/50 text-xs text-center"
      >
        Dashboard Monitoring nugra21
      </motion.footer>
    </div>
  );
}

export default App;
