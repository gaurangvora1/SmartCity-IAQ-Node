# Smart City IAQ Monitoring via Occupancy Detection

**Course:** BCSE316L - Design of Smart Cities (Winter 2025-26)  
**Institution:** Vellore Institute of Technology (VIT), Vellore

## 👥 Team Members
* **Goyal Eklavya Shyam Sunder (24BCE0743)** - *Team Leader* (System Architecture, Node.js Backend, Paper Documentation)
* **Vora Gaurang Himanshu (24BCE0722)** - *Team Member* (Arduino Firmware, Hardware Integration, React.js Frontend, Testing)

---

## 📌 Project Overview
This repository contains the full-stack source code for an IoT-based Smart City Indoor Air Quality (IAQ) node. Traditional IAQ systems rely on chemical gas sensors (like the MQ-135) that require frequent calibration, continuous power, and high maintenance costs. 

This project proposes a software-driven approach that utilizes **spatial room occupancy as a heuristic proxy for indoor air quality**. By deploying an array of ultrasonic sensors connected to an Arduino edge node, the system calculates an estimated Air Quality Index (AQI) based on real-time crowd density and automatically triggers a ventilation relay when the AQI reaches hazardous levels.

## ✨ Key Features
* **Heuristic Proxy Model:** Maps real-time crowd density (0-3 sensors blocked) to an estimated AQI scale (100, 150, 200, 300).
* **Software-Defined Actuator:** Closed-loop process control automatically triggers a 5V exhaust fan relay when AQI ≥ 300 (EPA Hazardous Threshold).
* **Full-Stack Dashboard:** A React.js SPA providing a centralized administrative view with real-time UI updates (< 1000ms latency).
* **API Enrichment:** Node.js backend merges local hardware telemetry with live ambient weather data via the Open-Meteo REST API.
* **SDG Alignment:** Directly supports UN SDGs 3 (Good Health), 7 (Clean Energy), and 11 (Sustainable Cities).

---

## 🛠️ Technology Stack

### Hardware (Edge Node)
* **Microcontroller:** Arduino UNO (ATmega328P)
* **Sensors:** 3x HC-SR04 Ultrasonic Sensors
* **Actuator:** 5V Single-Channel Relay Module
* **Communication:** USB-to-Serial Data Bridge (9600 baud)

### Software (Web Architecture)
* **Backend:** Node.js, Express, `serialport` (v12), `axios`
* **Frontend:** React.js (v18), Vite, Recharts (Data Visualization)
* **External APIs:** Open-Meteo (Ambient Temperature & Humidity)

---

## 🚀 How to Run Locally

### 1. Hardware Setup
1. Flash the `SmartCity_IAQ_Node.ino` firmware to your Arduino UNO.
2. Connect the Arduino via USB to the host machine. Note the COM port (e.g., `COM3` on Windows or `/dev/ttyUSB0` on Linux/Mac).

### 2. Backend Setup
Navigate to the `Backend` directory, install dependencies, and start the server:
```bash
cd Backend
npm install
node server.js
```
*Ensure the COM port in `server.js` matches your Arduino's active port.*

### 3. Frontend Setup
Open a new terminal, navigate to the `Frontend` directory, install dependencies, and run the development server:
```bash
cd Frontend
npm install
npm run dev
```
The React dashboard will be accessible at `http://localhost:5173`.
```
