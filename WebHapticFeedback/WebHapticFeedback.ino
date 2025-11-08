const int motorPin = 9;
const int dotDuration = 200;    // vibration time per dot (ms)
const int pauseDuration = 100;  // pause between dots (ms)
const int charPause = 500;      // pause between characters
const int wordPause = 1000;     // A new, longer pause for spaces

// Braille patterns (same as yours)
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
  Serial.println("Braille Subtitle System Ready.");
}

void loop() {
  if (Serial.available()) {
    char ch = Serial.read();

    // Convert uppercase to lowercase
    if (ch >= 'A' && ch <= 'Z') {
      ch = ch + 32; // ASCII conversion
    }

    if (ch >= 'a' && ch <= 'z') {
      Serial.print("Character: ");
      Serial.println(ch);
      vibrateBraille(ch);
    } 
    else if (ch == ' ') {
      // If it's a space, just pause for a word gap
      Serial.println("Space: Word Pause");
      delay(wordPause);
    }
    // Ignore all other characters (numbers, punctuation, etc.)
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
      delay(dotDuration); // Still delay to keep timing consistent
    }
    delay(pauseDuration);
  }
  delay(charPause);
}