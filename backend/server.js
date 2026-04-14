const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { SerialPort, ReadlineParser } = require('serialport'); 

const app = express();
app.use(cors());
app.use(express.json());

let sensorHistory = []; 
let weatherData = { temp: 0, humidity: 0 }; 
let currentStatus = { air_quality: 100, fan_status: "OFF", temp: 0, humidity: 0 };

// --- 1. FETCH LIVE WEATHER ---
async function fetchWeather() {
    try {
        const response = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=12.92&longitude=79.13&current_weather=true&hourly=relativehumidity_2m');
        weatherData.temp = response.data.current_weather.temperature;
        weatherData.humidity = response.data.hourly.relativehumidity_2m[0];
    } catch (error) {
        console.error("Error fetching weather data");
    }
}
fetchWeather();
setInterval(fetchWeather, 10 * 60 * 1000); 

// --- 2. LISTEN TO ARDUINO VIA USB ---
// IMPORTANT: Make sure this is the right COM port!
const portName = 'COM6'; 
const port = new SerialPort({ path: portName, baudRate: 9600 }); 
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (data) => {
    try {
        const arduinoData = JSON.parse(data); 
        const aqiLevel = arduinoData.aqi;
        
        // ✨ THE MAGIC RULE ✨
        // If AQI is 300 or higher (which happens when 3 sensors are blocked), turn Fan ON!
        const fan = aqiLevel >= 300 ? "ON" : "OFF";

        currentStatus = { 
            air_quality: aqiLevel, 
            fan_status: fan,
            temp: weatherData.temp,
            humidity: weatherData.humidity
        };
        
        // Save to History for the Graph
        const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
        sensorHistory.push({ time: time, aq: aqiLevel });
        if (sensorHistory.length > 20) sensorHistory.shift(); 
        
        console.log(`[LIVE DATA] Sensors Blocked -> AQI: ${aqiLevel} | Fan: ${fan}`);
    } catch (err) {
        // Ignore garbled data
    }
});

// --- 3. SERVE TO REACT ---
app.get('/api/data', (req, res) => {
    res.json({ currentStatus, history: sensorHistory });
});

app.listen(5000, () => {
    console.log(`✅ Backend listening to Arduino on ${portName} and serving on port 5000!`);
});