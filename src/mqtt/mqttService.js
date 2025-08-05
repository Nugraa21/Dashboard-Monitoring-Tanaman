import mqtt from 'mqtt';

const brokerUrl = 'wss://broker.hivemq.com:8884/mqtt';

const options = {
  clientId: 'web-client-' + Math.random().toString(16).substr(2, 8),
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
};

const client = mqtt.connect(brokerUrl, options);

client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  client.subscribe('data/tanaman', (err) => {
    if (!err) console.log('Subscribed to data/tanaman');
  });
});

client.on('error', (err) => {
  console.error('Connection error: ', err);
});

export default client;
