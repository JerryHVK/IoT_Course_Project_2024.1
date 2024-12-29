const mqtt = require('mqtt');
// const deviceController = require('./../controllers/deviceController');
// const Device = require('./../models/deviceModel');
// const HealthIndexes = require('./../models/HealthIndexes');

const mqttServer = 'broker.emqx.io:1883';
const mqttClientId = 'khang-khanh-kien-tam';
const mqttUsername = 'group3-api-server';
const mqttPassword = 'khangkhanhkientam';
const mqttSubTopic = 'iotcourse_group3/server';

const client = mqtt.connect(mqttServer, {
  clientId: mqttClientId,
  clean: true,
  username: mqttUsername,
  password: mqttPassword,
  keepalive: 60, // 60 seconds
});

client.on('connect', () => {
  console.log('Connected Mqtt service');
  client.subscribe([mqttSubTopic], (error) => {
    if (error) {
      console.log(`Mqtt client cannot subscribe the topic: ${mqttSubTopic}`);
    }
  });
});

// client.on('message', async (topic, message) => {
//   // convert message to JSON format
//   try {
//     const messageJSON = message.toJSON();
//     const device = await Device.findOne({deviceNumber: messageJSON.deviceNumber});
//     const data = await HealthIndexes.findOneAndUpdate({user: device.user}, {})
//   } catch (error) {
//     console.log("Something's wrong when processing the mqtt message");
//   }
// });

module.exports = client;
