const mqtt = require('mqtt');
const Device = require('./../models/deviceModel');
const HealthIndexes = require('../models/healthIndexesModel');

const mqttServer = 'broker.emqx.io';
const mqttPort = '1883';
const mqttClientId = 'khang-khanh-kien-tam';
const mqttUsername = 'group3-api-server';
const mqttPassword = 'khangkhanhkientam';
const mqttSubTopic = 'iotcourse_group3/server';

const client = mqtt.connect({
  host: mqttServer,
  port: mqttPort,
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
  console.log('mqttserver oke');
});

client.on('message', async (topic, message) => {
  // convert message to JSON format
  try {
    //example of message: {"deviceNumber":"DEVICE5086","data":{"heartRate":83}}
    const messageJSON = JSON.parse(message.toString());
    const device = await Device.findOne({
      deviceNumber: messageJSON.deviceNumber,
    });
    console.log(device);
    const result = await HealthIndexes.findOneAndUpdate(
      { user: device.user },
      { $push: { data: { heartRate: messageJSON.data.heartRate } } },
      { new: true, useFindAndModify: false },
    );
    console.log(result);
  } catch (error) {
    console.log("Something's wrong in mqtt processing message");
  }
});

client.on('error', (err) => {
  console.error('MQTT Client Error:', err);
});

client.on('close', () => {
  console.warn('MQTT Client Disconnected');
});

module.exports = client;
