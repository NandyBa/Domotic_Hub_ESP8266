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
#include <ESP8266HTTPClient.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>


// Create AsyncWebServer object on port specified on the config file
AsyncWebServer server(WebServerPort);

// Variable to store the HTTP request
String header;
String state[6] {"off","off","off","off","off","off"};
String commande[6] {"off","off","off","off","off","off"};
String objectName[6] = {"","","Bureau","Lit","Lampe d'appoint","Salon"};


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
  }
   server.on("/3/toggle", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send_P(200, "text/plain", toggleLight(3).c_str());
  });
  server.on("/4/toggle", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send_P(200, "text/plain", toggleLight(4).c_str());
  });
  server.on("/5/toggle", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send_P(200, "text/plain", toggleLight(5).c_str());
  });
  server.on("/6/toggle", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send_P(200, "text/plain", toggleLight(6).c_str());
  });
  server.on("/states", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send_P(200, "text/plain", getStates().c_str());
  });

  server.begin();
}

void putRequest(String URI, String data){
  HTTPClient http;

  http.begin(URI);
  http.addHeader("Content-Type", "text/plain");            
 
  int httpResponseCode = http.PUT(data);   
 
  if(httpResponseCode>0){
 
   String response = http.getString();   
 
   //Serial.println(httpResponseCode);
   //Serial.println(response);          
 
  }else{
 
   Serial.print("Error on sending PUT Request: ");
   Serial.println(httpResponseCode);
 
  }
 
  http.end();
}

String toggleLight(int i){
  if(state[i-1] == "off"){
    commande[i-1] = "on";
  }else{
    commande[i-1] = "off";
  }
  return commande[i-1];
}

String getStates(){
  String str = "";
  for(int i = 3; i<= 6; i++){
    str += state[i-1] + ";";
  }
  return str;
}

void switchOnLight(int id){
  String URI = "http://"+PhilipsHubIp+"/api/"+PhilipsUsername+"/lights/"+String(id)+"/state/";
  String data = "{\"on\":true}";
  putRequest(URI, data);
}
void switchOffLight(int id){
  String URI = "http://"+PhilipsHubIp+"/api/"+PhilipsUsername+"/lights/"+String(id)+"/state/";
  String data = "{\"on\":false}";
  putRequest(URI, data);
}
void createbutton(WiFiClient client, int id){
   client.println("<p>"+objectName[id-1]+"- State " + String(state[id-1]) + "</p>");
   // If the output5State is off, it displays the ON button       
   if (String(state[id-1])=="off") {
     client.println("<p><a href=\"/"+String(id)+"/on\"><button class=\"button\">ON</button></a></p>");
   } else {
     client.println("<p><a href=\"/"+String(id)+"/off\"><button class=\"button buttonOff\">OFF</button></a></p>");
   }
}

void loop(){
  for(int i = 3; i <= 6; i++){
    if(String(commande[i-1]) != String(state[i-1])){
        if(commande[i-1] == "on"){
          state[i-1] = "on";
          switchOnLight(i);
        }else{
          state[i-1] = "off";
          switchOffLight(i);
        } 
    }

  }
}
