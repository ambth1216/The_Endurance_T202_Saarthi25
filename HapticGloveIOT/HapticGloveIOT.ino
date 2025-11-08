const int motorPin = 9;
const int dotDuration = 200;     // vibration time per dot (ms)
const int pauseDuration = 100;   // pause between dots (ms)
const int charPause = 500;       // pause between characters

// Braille patterns for a–z (6-dot cells)
const byte brailleAlphabet[26][6] = {
  {1,0,0,0,0,0}, {1,1,0,0,0,0}, {1,0,0,1,0,0}, {1,0,0,1,1,0}, {1,0,0,0,1,0},
  {1,1,0,1,0,0}, {1,1,0,1,1,0}, {1,1,0,0,1,0}, {0,1,0,1,0,0}, {0,1,0,1,1,0},
  {1,0,1,0,0,0}, {1,1,1,0,0,0}, {1,0,1,1,0,0}, {1,0,1,1,1,0}, {1,0,1,0,1,0}, 
  {1,1,1,1,0,0}, {1,1,1,1,1,0}, {1,1,1,0,1,0}, {0,1,1,1,0,0}, {0,1,1,1,1,0},
  {1,0,1,0,0,1}, {1,1,1,0,0,1}, {0,1,0,1,1,1}, {1,0,1,1,0,1}, {1,0,1,1,1,1},
  {1,0,1,0,1,1}
};

void setup() {
  pinMode(motorPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Type lowercase letters to vibrate Braille:");
}

void loop() {
  if (Serial.available()) {
    char ch = Serial.read();
    if (ch >= 'a' && ch <= 'z') {
      Serial.print("Character: ");
      Serial.println(ch);
      vibrateBraille(ch);
    } else {
      Serial.println("Only lowercase letters a–z are supported.");
    }
  }
}

void vibrateBraille(char ch) {
  int index = ch - 'a';
  for (int i = 0; i < 6; i++) {
    if (brailleAlphabet[index][i] == 1) {
      Serial.print("Dot ");
      Serial.print(i + 1);
      Serial.println(": Vibrate");
      digitalWrite(motorPin, HIGH);
      delay(dotDuration);
      digitalWrite(motorPin, LOW);
    } else {
      Serial.print("Dot ");
      Serial.print(i + 1);
      Serial.println(": Skip");
      delay(dotDuration);
    }
    delay(pauseDuration);
  }
  delay(charPause);
}