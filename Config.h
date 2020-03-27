#include <Arduino.h>
#include <ESP8266WiFi.h> // Import here to import IPAddress type
// Replace with your network credentials
const char* ssid     = "YourSSid";
const char* password = "YourWifiPassword";

String PhilipsUsername = "YourPhilipsUsername";
String PhilipsHubIp = "YourPhilipsHubLocalIp";

// NETWORK: Static IP details
IPAddress ip(192, 168, 1, 43); //Your wanted Ip for your ESP Hub
IPAddress gateway(192, 168, 1, 1); // Ip of your gateway - Let like it if your know it
IPAddress subnet(255, 255, 255, 0); // Subnet Ip - Let like it if your know it

int WebServerPort = 80;
