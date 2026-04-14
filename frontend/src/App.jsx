import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wind, Thermometer, Droplets, Fan, AlertTriangle, CheckCircle2 } from 'lucide-react';

function App() {
  const [data, setData] = useState({ 
    currentStatus: { air_quality: 100, fan_status: 'OFF', temp: 0, humidity: 0 }, 
    history: [] 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData(); // Fetch immediately on load
    
    // Set to 1000ms (1 second) so it responds instantly to your hand waves!
    const interval = setInterval(fetchData, 1000); 
    
    return () => clearInterval(interval);
  }, []);

  const { air_quality, fan_status, temp, humidity } = data.currentStatus;
  
  // Triggers the red alert exactly when 3 sensors are covered (AQI 350)
  const isDanger = air_quality >= 300; 

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '30px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#38bdf8', fontSize: '36px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Wind size={40} /> Smart City IAQ Node
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '18px' }}>Real-Time Indoor Air Quality & Automated Ventilation Control</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: isDanger ? '#7f1d1d' : '#14532d', padding: '15px 25px', borderRadius: '30px', border: `2px solid ${isDanger ? '#ef4444' : '#22c55e'}` }}>
          {isDanger ? <AlertTriangle color="#fca5a5" size={28} /> : <CheckCircle2 color="#86efac" size={28} />}
          <span style={{ fontWeight: 'bold', fontSize: '20px', color: isDanger ? '#fca5a5' : '#86efac' }}>
            {isDanger ? 'SYSTEM ALERT: HAZARDOUS AIR' : 'SYSTEM OPTIMAL'}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        
        {/* Air Quality Card */}
        <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', borderTop: `5px solid ${isDanger ? '#ef4444' : '#38bdf8'}`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)', transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '20px' }}>
            <h3>Air Quality (AQI)</h3>
            <Wind />
          </div>
          <h1 style={{ fontSize: '64px', margin: '15px 0', color: isDanger ? '#ef4444' : '#f8fafc', transition: 'color 0.3s ease' }}>{air_quality}</h1>
          <p style={{ margin: 0, color: isDanger ? '#fca5a5' : '#94a3b8', fontSize: '16px' }}>Hazard Threshold: 300</p>
        </div>

        {/* Fan Status Card */}
        <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', borderTop: `5px solid ${fan_status === 'ON' ? '#a855f7' : '#475569'}`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)', transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '20px' }}>
            <h3>Exhaust Fan</h3>
            <Fan className={fan_status === 'ON' ? 'spin-animation' : ''} size={32} color={fan_status === 'ON' ? '#c084fc' : '#94a3b8'} />
          </div>
          <h1 style={{ fontSize: '64px', margin: '15px 0', color: fan_status === 'ON' ? '#c084fc' : '#94a3b8', transition: 'color 0.3s ease' }}>{fan_status}</h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '16px' }}>Automated Relay Control</p>
        </div>

        {/* Temperature Card */}
        <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', borderTop: '5px solid #f59e0b', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '20px' }}>
            <h3>Temperature</h3>
            <Thermometer color="#fcd34d" size={32} />
          </div>
          <h1 style={{ fontSize: '64px', margin: '15px 0' }}>{temp}°C</h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '16px' }}>Live Web API Data</p>
        </div>

        {/* Humidity Card */}
        <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', borderTop: '5px solid #06b6d4', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '20px' }}>
            <h3>Humidity</h3>
            <Droplets color="#67e8f9" size={32} />
          </div>
          <h1 style={{ fontSize: '64px', margin: '15px 0' }}>{humidity}%</h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '16px' }}>Live Web API Data</p>
        </div>
      </div>

      {/* Chart Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}>
        <h3 style={{ marginTop: 0, color: '#f8fafc', marginBottom: '20px', fontSize: '24px' }}>Hardware Pollutant Concentration Trend</h3>
        <div style={{ width: '100%' , height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.history}>
              <defs>
                <linearGradient id="colorAq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDanger ? "#ef4444" : "#38bdf8"} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={isDanger ? "#ef4444" : "#38bdf8"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 14}} />
              <YAxis domain={[0, 800]} stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 14}} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '16px' }} />
              <Area 
                type="monotone" 
                dataKey="aq" 
                stroke={isDanger ? "#ef4444" : "#38bdf8"} 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorAq)" 
                isAnimationActive={false} /* Disabled animation for snappier real-time updates */
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CSS for Fan Spinning Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin-animation { animation: spin 0.8s linear infinite; }
      `}} />
    </div>
  );
}

export default App;