/*********
  Rui Santos
  Complete project details at http://randomnerdtutorials.com  
*********/
// Load Configuration file
#include "Config.h"

// Load Wi-Fi library
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>

// NETWORK: Static IP details
IPAddress ip(192, 168, 1, 43);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);


ESP8266WebServer server;

// Variable to store the HTTP request
String header;
String state[6] {"off","off","off","off","off","off"};
String objectName[6] = {"","","Bureau","Lit","Lampe d'appoint","Salon"};

char webpage[] PROGMEM = R"=====(
<html>
<head>
</head>
<body>
<style type="text/css">
.button { background-color: #195B6A; border: none; color: white; padding: 16px 40px;}
</style>
<p> LED Status: <span id="state-1">__</span> </p>
<button onclick="OnOffLight(3)" class="button"> Bureau </button>
<p> LED Status: <span id="state-2">__</span> </p>
<button onclick="OnOffLight(4)" class="button"> Lampe lit </button>
<p> LED Status: <span id="state-3">__</span> </p>
<button onclick="OnOffLight(5)" class="button"> Lampe office </button>
<p> LED Status: <span id="state-4">__</span> </p>
<button onclick="OnOffLight(6)" class="button"> Salon </button>
</body>
<script>
var xhr = new XMLHttpRequest();
var url = "states";
xhr.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) { states = this.responseText.split(";");
    for(i=3;i<=6;i++){
      document.getElementById("state-"+(i-2)).innerHTML = states[i-3];
    }
  }
};
xhr.open("GET", url, true);
xhr.send();

function OnOffLight(i)
{
  var xhr = new XMLHttpRequest();
  var url = "/"+i+"/toggle";
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      state = this.responseText;
      document.getElementById("state-"+(i-2)).innerHTML = state;
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
};
</script>
</html>
)=====";


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

  server.on("/",[](){server.send_P(200,"text/html", webpage);});
  server.on("/3/toggle", toggle3);
  server.on("/4/toggle", toggle4);
  server.on("/5/toggle", toggle5);
  server.on("/6/toggle", toggle6);
  server.on("/states", [state](){
    String chr = "";
    for(int i = 3; i<= 6; i++){
      chr += state[i-1]+";";
    }
    server.send(200,"text/plain", chr);
  });
  for(int i = 3; i<= 6; i++){
    server.on("/"+String(i)+"/state", [i, state](){server.send(200,"text/plain", state[i]);});
  }
  
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

void toggle3(){
  toggleLight(3);
}
void toggle4(){
  toggleLight(4);
}
void toggle5(){
  toggleLight(5);
}
void toggle6(){
  toggleLight(6);
}

void toggleLight(int i){
  if(state[i-1] == "off"){
    switchOnLight(i);
    state[i-1] = "on";
    server.send(200,"text/plain", "on");
  }else{
    switchOffLight(i);
    state[i-1] = "off";
    server.send(200,"text/plain", "off");
  }
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
  server.handleClient();
}
