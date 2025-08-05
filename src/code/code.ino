#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// ======== Konfigurasi WiFi dan MQTT =========
const char* ssid       = "NAMA_WIFI";
const char* password   = "PASSWORD_WIFI";
const char* mqttServer = "broker.hivemq.com";
const int   mqttPort   = 1883;
const char* mqttTopic  = "data/tanaman";

// ======== Pin Sensor dan Relay =========
#define DHTPIN        4       // pin untuk sensor DHT11
#define DHTTYPE       DHT11
#define SOIL_PIN      34      // pin analog sensor kelembapan tanah
#define RELAY_PIN     5       // pin untuk relay (motor DC)

// ======== Objek dan Variabel =========
DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient mqttClient(espClient);
const int batasKelembapanTanah = 35; // nilai minimum (%) sebelum motor nyala

// ======== Fungsi Koneksi WiFi =========
void connectToWiFi() {
  Serial.print("Menghubungkan ke WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi terhubung. IP: " + WiFi.localIP().toString());
}

// ======== Fungsi Koneksi MQTT =========
void connectToMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Menghubungkan ke MQTT...");
    String clientId = "esp32-client-" + String(random(1000));
    if (mqttClient.connect(clientId.c_str())) {
      Serial.println("Terhubung!");
    } else {
      Serial.print("Gagal, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" mencoba lagi...");
      delay(2000);
    }
  }
}

// ======== Setup Awal =========
void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // default mati

  dht.begin();
  connectToWiFi();

  mqttClient.setServer(mqttServer, mqttPort);
}

// ======== Loop Utama =========
void loop() {
  if (!mqttClient.connected()) connectToMQTT();
  mqttClient.loop();

  // === Baca Sensor ===
  float suhu              = dht.readTemperature();
  float kelembapanUdara   = dht.readHumidity();
  int   tanahAnalog       = analogRead(SOIL_PIN);
  int   kelembapanTanah   = map(tanahAnalog, 4095, 0, 0, 100);
  kelembapanTanah         = constrain(kelembapanTanah, 0, 100);

  // === Kendali Pompa Berdasarkan Kelembapan Tanah ===
  if (kelembapanTanah < batasKelembapanTanah) {
    digitalWrite(RELAY_PIN, HIGH); // nyalakan motor/pompa
  } else {
    digitalWrite(RELAY_PIN, LOW);  // matikan motor/pompa
  }

  // === Buat Pesan JSON Manual ===
  String jsonPayload = "{";
  jsonPayload += "\"suhu\":" + String(suhu, 1) + ",";
  jsonPayload += "\"kelembapan_udara\":" + String(kelembapanUdara, 0) + ",";
  jsonPayload += "\"kelembapan_tanah\":" + String(kelembapanTanah, 0);
  jsonPayload += "}";

  // === Kirim ke MQTT ===
  mqttClient.publish(mqttTopic, jsonPayload.c_str());

  // === Tampilkan di Serial Monitor ===
  Serial.println("Data dikirim ke MQTT:");
  Serial.println(jsonPayload);
  Serial.println("----------------------------");

  delay(5000); // delay 5 detik
}
