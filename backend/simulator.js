// SMART HARDWARE SIMULATOR
let currentAQI = 200;
let fanStatus = "OFF";

setInterval(async () => {
    // 1. REALISTIC PHYSICS ENGINE
    if (fanStatus === "ON") {
        // Fan is clearing the air! Pollution drops rapidly.
        currentAQI -= Math.floor(Math.random() * 40) + 20; 
    } else {
        // Fan is OFF. Natural slow buildup of CO2/VOCs in a closed room.
        currentAQI += Math.floor(Math.random() * 15) + 5; 

        // 10% chance of a sudden massive pollution spike (e.g., matchstick smoke)
        if (Math.random() < 0.10) {
            currentAQI += Math.floor(Math.random() * 150) + 100; 
        }
    }

    // 2. HARDWARE BOUNDARIES (Keep numbers realistic)
    if (currentAQI < 150) currentAQI = 150 + Math.floor(Math.random() * 10); // Clean air baseline
    if (currentAQI > 800) currentAQI = 800; // Max hardware reading

    // 3. SMART THERMOSTAT LOGIC (Hysteresis)
    // Turns ON if above 400. Stays ON until air is deeply cleaned below 250.
    if (currentAQI > 400) {
        fanStatus = "ON";
    } else if (currentAQI < 250) {
        fanStatus = "OFF";
    }

    const payload = {
        air_quality: currentAQI,
        fan_status: fanStatus
    };

    // 4. SEND TO BACKEND
    try {
        await fetch('http://localhost:5000/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        // Added the print statement back so you can watch it in the terminal!
        console.log(`[SIMULATOR] Sent -> AQI: ${currentAQI} | Fan: ${fanStatus}`);
        
    } catch (error) {
        console.log("Waiting for backend server to start...");
    }

}, 3000);