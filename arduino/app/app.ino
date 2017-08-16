const int LOCK_PIN = 9;
const int LOCK_TIMEOUT = 3000;

void setup()                    // run once, when the sketch starts
{
 Serial.begin(9600);            // set the baud rate to 9600, same should be of your Serial Monitor
 pinMode(LOCK_PIN, OUTPUT);
}

void loop() {
  char inputString = (char)Serial.read();
  if(inputString == 'a') {
    digitalWrite(LOCK_PIN, HIGH);
    delay(1000);
    digitalWrite(LOCK_PIN, LOW);
  }
}
