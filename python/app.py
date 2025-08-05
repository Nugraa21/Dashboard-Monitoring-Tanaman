import paho.mqtt.client as mqtt
import json
import time

# Konfigurasi broker HiveMQ
broker = 'broker.hivemq.com'
port = 1883
topic = 'data/tanaman'

# Inisialisasi client MQTT
client = mqtt.Client()
client.connect(broker, port, 60)

try:
    while True:
        # Contoh data dummy
        data = {
            "suhu": round(25 + (2 * time.time()) % 5, 1),
            "kelembapan_udara": round(60 + (3 * time.time()) % 20, 1),
            "kelembapan_tanah": round(40 + (4 * time.time()) % 30, 1)
        }

        # Konversi ke JSON string
        payload = json.dumps(data)

        # Publish ke topik
        client.publish(topic, payload)
        print("Data terkirim:", payload)

        time.sleep(5)  # kirim setiap 5 detik

except KeyboardInterrupt:
    print("\nBerhenti mengirim data.")
    client.disconnect()
