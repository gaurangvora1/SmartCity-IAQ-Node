int trig1 = 8, echo1 = 9;
int trig2 = 10, echo2 = 11;
int trig3 = 12, echo3 = 13;

long readDistance(int trig, int echo) {
  digitalWrite(trig, LOW);
  delayMicroseconds(2);

  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  long duration = pulseIn(echo, HIGH);
  long distance = duration * 0.034 / 2;

  return distance;
}

void setup() {
  Serial.begin(9600);

  pinMode(trig1, OUTPUT); pinMode(echo1, INPUT);
  pinMode(trig2, OUTPUT); pinMode(echo2, INPUT);
  pinMode(trig3, OUTPUT); pinMode(echo3, INPUT);
}

void loop() {
  int count = 0;

  long d1 = readDistance(trig1, echo1);
  long d2 = readDistance(trig2, echo2);
  long d3 = readDistance(trig3, echo3);

  if (d1 > 0 && d1 < 50) count++;
  if (d2 > 0 && d2 < 50) count++;
  if (d3 > 0 && d3 < 50) count++;

  int aqi = count * 100;  // 0,100,200,300

  Serial.print("{\"aqi\":");
  Serial.print(aqi);
  Serial.println("}");

  delay(1000);
}