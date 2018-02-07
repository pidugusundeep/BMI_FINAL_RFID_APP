#include <ESP8266WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <string.h>
#define PubNub_BASE_CLIENT WiFiClient
#include <PubNub.h>


// Replace these with your WiFi network settings
const char* ssid = "pidugusundeep5"; //replace this with your WiFi network name
const char* password = "deep1234"; //replace this with your WiFi network password
#define SS_PIN 4  //D2
#define RST_PIN 5 //D1
#define BUILTIN_LED 15

//PubNub details
const static char pubkey[] = "pub-c-8b72e987-9fc7-4566-b237-72a2297e78ca";         // your publish key
const static char subkey[] = "sub-c-c8a055ae-e4d3-11e7-9f1e-625d8ea2b1bc";         // your subscribe key
const static char channel[] = "IOT-RFID"; // channel to use

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance.
int statuss = 0;
int out = 0;

void setup()
{
  delay(1000);
  Serial.begin(9600);
  pinMode(BUILTIN_LED, OUTPUT);
  WiFi.begin(ssid, password);
  Serial.println();
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("success connection!");
  SPI.begin();      // Initiate  SPI bus
  mfrc522.PCD_Init();   // Initiate MFRC522
  mfrc522.PCD_DumpVersionToSerial();
  PubNub.begin(pubkey, subkey);
  Serial.println("PubNub set up Success !");
}
void loop() {
  digitalWrite(BUILTIN_LED, LOW);
  if ( ! mfrc522.PICC_IsNewCardPresent())
  {
    return;
  }
  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial())
  {
    return;
  }
  //Show UID on serial monitor
  Serial.println();
  Serial.print(" UID tag :");
  String content = "";
  byte letter;
  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(mfrc522.uid.uidByte[i], HEX);
    content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
    content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }
  content.toUpperCase();
  Serial.println();
  Serial.println("----- CARD ID------");
  Serial.println(content.substring(1));
  Serial.println("-----------");
  char msg[17];
  if (content.substring(1) == "40 8E 7B A5") //change UID of the card that you want to give access
  { char msg[] = "\"40 8E 7B A5\"";
    Serial.println(msg);
  }
  else if (content.substring(1) == "74 7F 1B DB")
  { char msg[] = "\"74 7F 1B DB\"";
    Serial.println(msg);
  }
  else if (content.substring(1) == "95 D0 DA 64")
  { char msg[] = "\"95 D0 DA 64\"";
    Serial.println(msg);
  }
  else if (content.substring(1) == "6B 32 B1 79")
  {
    char msg[] = "\"6B 32 B1 79\"";
    Serial.println(msg);
  }
//  char ca[15];
//  ca[0] = '\\';
//  ca[1] = '\"';
//  for (int i = 2; i < content.substring(1).length() + 2; i++) {
//    ca[i] = content.substring(1)[i];
//  }
//  ca[content.substring(1).length() + 3] = '\"';
//  ca[content.substring(1).length() + 4] = '\\';
//
//  Serial.println("--------- ! ------");
//  Serial.println(ca);
//  Serial.println("--------- ! ------");
  Serial.println(" Access Granted ");
  digitalWrite(BUILTIN_LED, HIGH);
  delay(1000);
  Serial.println(msg);
  Serial.println();
  WiFiClient *client;

  client = PubNub.publish(channel, msg);
  if (!client) {
    Serial.println("publishing error");
    delay(1000);
    return;
  }
  if (PubNub.get_last_http_status_code_class() != PubNub::http_scc_success) {
    Serial.print("Got HTTP status code error from PubNub, class: ");
    Serial.print(PubNub.get_last_http_status_code_class(), DEC);
    digitalWrite(BUILTIN_LED, LOW);
  }
  while (client->available()) {
    Serial.write(client->read());
  }
  client->stop();
  statuss = 1;

}
