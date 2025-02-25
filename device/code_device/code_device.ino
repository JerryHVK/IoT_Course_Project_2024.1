#include <Wire.h>
#include <WiFi.h>
#include "MAX30105.h"
#include "heartRate.h"
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <esp_wifi.h>

//  define the wifi and MQTT ip address
const char* ssid = "Khang";
const char* password = "11111111"; 
const char *mqtt_server = "broker.emqx.io";
const int mqtt_port = 1883;
const char *pub_topic = "iotcourse_group3/server";
const int time_between_2_pubs = 5000; // (ms)
char mac_address[100];

//  client for wifi connection
WiFiClient espClient;

//  client for mqtt connection
PubSubClient client(espClient);

unsigned long lastMsg = 0;

MAX30105 particleSensor;
const byte RATE_SIZE = 10; //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE]; //Array of heart rates
byte rateSpot = 0;
long lastBeat = 0; //Time at which the last beat occurred
float beatsPerMinute;
int beatAvg;

//  finger = true if there is a finger on the sensor, otherwise = false
bool finger = true;

// setup
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  //  setup the sensor MAX30102
  if (particleSensor.begin() == false)
  {
    Serial.println("MAX30102 was not found. Please check wiring/power. ");
    while (1);
  } 
  particleSensor.setup();
  Serial.println("MAX30102 setup successfully!");
  
  //  setup wifi
  setup_wifi();
 
  //  mqtt client connect to mqtt broker
  client.setServer(mqtt_server, mqtt_port);
}

// loop
void loop() {
  // put your main code here, to run repeatedly:

  //  check wifi connection at each loop
  if(WiFi.status() != WL_CONNECTED) {
    setup_wifi();
  }

  //  check the mqtt connection at each loop
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // send data 
  long start = millis();
  long end;
  while(1){
    loop_for_data();
    end = millis();
    if(end - start > time_between_2_pubs){
      if(finger){
        send_data();
        break;
      }
      break;
    }
  }
}

//  this "setup_wifi()" function is the code example from "Wifi.h" library
void setup_wifi() {
  WiFi.mode(WIFI_STA);
  delay(1000);
  //This line hides the viewing of ESP as wifi hotspot
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  readMacAddress();
  Serial.println(mac_address);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected successfully");
  Serial.print("connected to : "); Serial.println(ssid);
  Serial.print("IP address: "); Serial.println(WiFi.localIP());
}


//  this "reconnect()" functions is from the example of "PubSubClient" library
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");

    // Create a random client ID
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

// loop for getting data from sensor
void loop_for_data(){
  long irValue = particleSensor.getIR();

  if (checkForBeat(irValue) == true)
  {
    //We sensed a beat!
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute < 220 && beatsPerMinute > 27)
    {
      rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
      rateSpot %= RATE_SIZE; //Wrap variable

      //Take average of readings
      beatAvg = 0;
      for (byte x = 0 ; x < RATE_SIZE ; x++)
        beatAvg += rates[x];
      beatAvg /= RATE_SIZE;
    }
  }

  Serial.print("IR=");
  Serial.print(irValue);
  Serial.print(", BPM=");
  Serial.print(beatsPerMinute);
  Serial.print(", Avg BPM=");
  Serial.print(beatAvg);

  if (irValue < 100000){
    Serial.print(" No finger?");
    finger = false;
  }
  else{
    finger = true;
  }
  Serial.println();
  // delay(500);
}

void send_data(){
  JsonDocument doc;
  doc["deviceNumber"] = mac_address;
  doc["data"]["heartRate"] = beatAvg;
  // doc["data"]["spo2"]
  char dataString[256];
  serializeJson(doc, dataString);
  client.publish(pub_topic, dataString);
}

void readMacAddress(){
  uint8_t baseMac[6];
  esp_err_t ret = esp_wifi_get_mac(WIFI_IF_STA, baseMac);
  if (ret == ESP_OK) {
    sprintf(mac_address,"%02x:%02x:%02x:%02x:%02x:%02x",
                  baseMac[0], baseMac[1], baseMac[2],
                  baseMac[3], baseMac[4], baseMac[5]);
  } else {
    Serial.println("Failed to read MAC address");
  }
}
