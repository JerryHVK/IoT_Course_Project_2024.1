const mqtt = require('mqtt');
const deviceController = require('./../controllers/deviceController');

const mqttServer = 'broker.emqx.io';
const mqttClientId = 'khang-khanh-kien-tam';
const mqttUsername = 'group3-api-server';
const mqttPassword = 'khangkhanhkientam';
const mqttSubTopic = '/group3/iot-project/data';

const client = mqtt.connect(mqttServer, {
  clientId: mqttClientId,
  clean: true,
  username: mqttUsername,
  password: mqttPassword,
  keepalive: 60, // 60 seconds
});

client.on('connect', () => {
  console.log("Connected Mqtt service");
  client.subscribe([mqttSubTopic], (error) => {
    if(error){
      console.log(`Mqtt client cannot subscribe the topic: ${mqttSubTopic}`);
    }
  });
});

client.on('message', (topic, message) => {
  // convert message to JSON format
  try {
    const messageJSON = message.toJSON();

  } catch (error) {
    console.log("Something's wrong when processing the mqtt message");
  }
});

module.exports = client;
