/*********
  Rui Santos
  Complete project details at http://randomnerdtutorials.com  
*********/
// Load Configuration file
#include "Config.h"

// Load library to fash files to the ESP8266 (html, css, js)
#include "FS.h"

// Load Wi-Fi library
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>


// Create AsyncWebServer object on port specified on the config file
AsyncWebServer server(WebServerPort);


void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi network with SSID and password
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.config(ip, gateway, subnet); // Static IP Setup Info Here
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // Print local IP address and start web server
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  if(!SPIFFS.begin()){
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }else{
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
      request->send(SPIFFS, "/index.html", "text/html");
    });
    server.on("/index.js", HTTP_GET, [](AsyncWebServerRequest *request){
      request->send(SPIFFS, "/index.js", "text/javascript");
    });
    server.on("/config.js", HTTP_GET, [](AsyncWebServerRequest *request){
      request->send(SPIFFS, "/config.js", "text/javascript");
    });
  }

  server.begin();
}

void loop(){

}
