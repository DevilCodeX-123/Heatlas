import { useState, useEffect } from 'react';
import { Download, Share2, Home, TreePine, Droplets, Zap, MapPin } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { getUserLocation, getWeatherData, getAqiData, getReverseGeocoding } from '../utils/geoServices';
import './CitizenAnalytics.css';

const GaugeChart = ({ value, color, max = 100 }) => {
  const data = [
    { name: 'value', value: value },
    { name: 'empty', value: max - value }
  ];
  return (
    <div className="gauge-container">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={75}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="var(--border-color)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="gauge-value">{value}%</div>
    </div>
  );
};

const CitizenAnalytics = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [recentHeatData, setRecentHeatData] = useState([]);
  const [locationName, setLocationName] = useState({ city: "Detecting Location...", state: "" });
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [aiStatus, setAiStatus] = useState("Not Tested");

  const testAiConnection = async () => {
    setAiStatus("Testing...");
    try {
      const API_BASE = import.meta.env.VITE_AI_URL || 'http://localhost:8000';
      const res = await fetch(`${API_BASE}/api/ai/test-connection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hello from React Frontend!" })
      });
      const data = await res.json();
      if (data.success) {
        setAiStatus("Connected to Python AI!");
        alert(data.ai_response);
      } else {
        setAiStatus("Connection Failed");
      }
    } catch (err) {
      console.error(err);
      setAiStatus("Error: Is FastAPI running?");
      alert("Error connecting to AI. Make sure you run 'uvicorn api:app --reload' in the Ai folder.");
    }
  };

  useEffect(() => {
    const fetchEnvironmentalData = async () => {
      try {
        // 1. Try to get user location
        let lat = 28.6139; // Default: New Delhi
        let lon = 77.2090;
        
        try {
          const coords = await getUserLocation();
          lat = coords.lat;
          lon = coords.lon;
        } catch (e) {
          console.warn("Geolocation blocked or failed. Using default location (New Delhi).");
        }

        // 2. Fetch all real-time data in parallel
        const [weather, aqi, geo] = await Promise.all([
          getWeatherData(lat, lon),
          getAqiData(lat, lon),
          getReverseGeocoding(lat, lon)
        ]);

        if (weather) {
          setWeatherData(weather);
          if (weather.daily && weather.daily.time) {
            const historical = [];
            for(let i=0; i<weather.daily.time.length; i++) {
              const dateStr = weather.daily.time[i];
              const maxTemp = weather.daily.temperature_2m_max[i];
              const day = new Date(dateStr).toLocaleDateString('en-US', {weekday: 'short'});
              historical.push({ name: day, value: maxTemp });
            }
            setRecentHeatData(historical);
          }
        }
        if (aqi) setAqiData(aqi);
        
        if (geo && geo.address) {
          const city = geo.address.city || geo.address.town || geo.address.village || geo.address.county || geo.address.suburb || "Local Area";
          const state = geo.address.state || geo.address.country || "";
          setLocationName({ city, state });
        } else {
          setLocationName({ city: "New Delhi", state: "India" });
        }
      } catch (err) {
        console.error("Error loading environmental data:", err);
      } finally {
        setLoadingLoc(false);
      }
    };

    fetchEnvironmentalData();
  }, []);

  const currentTemp = weatherData?.current?.temperature_2m ?? "--";
  const currentAqi = aqiData?.current?.us_aqi ?? "--";
  const tempColor = currentTemp > 40 ? 'var(--status-critical)' : currentTemp > 35 ? 'var(--status-warning)' : 'var(--status-good)';

  // Real Calculations based on live API data
  const realTemp = parseFloat(currentTemp) || 25;
  const realAqi = parseFloat(currentAqi) || 50;
  
  const heatRiskScore = Math.min(100, Math.max(0, Math.round(((realTemp - 25) / 20) * 100))); 
  const airQualityRisk = Math.min(100, Math.round((realAqi / 300) * 100));
  const sustainabilityScore = Math.max(0, 100 - airQualityRisk);
  const greenCanopyScore = Math.max(10, Math.round(100 - (heatRiskScore * 0.5) - (airQualityRisk * 0.5)));

  return (
    <div className="analytics-container">
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            Analytics &gt; <span>{loadingLoc ? "Locating..." : `${locationName.city}`}</span>
          </div>
          <div className="page-title">
            <h1>Citizen Intelligence Dashboard</h1>
            <p className="page-subtitle">Personalized sustainability and heat risk analysis for <MapPin size={14} style={{display: 'inline', marginBottom: '-2px'}}/> {loadingLoc ? "Detecting area..." : `${locationName.city}, ${locationName.state}`}.</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-outline">
            <Download size={16} /> Export PDF
          </button>
          <button className="btn-primary">
            <Share2 size={16} /> Share Report
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Real-Time Heat Risk</div>
          <GaugeChart value={heatRiskScore} color={heatRiskScore > 75 ? "var(--status-critical)" : heatRiskScore > 50 ? "var(--status-warning)" : "var(--status-good)"} />
          <div className="stat-footer">{heatRiskScore > 75 ? "Critical Exposure Detected" : "Moderate Exposure"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Estimated Green Canopy</div>
          <GaugeChart value={greenCanopyScore} color="var(--status-info)" />
          <div className="stat-footer">Derived from local heat retention</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Sustainability Score</div>
          <GaugeChart value={sustainabilityScore} color={sustainabilityScore > 50 ? "var(--status-good)" : "var(--status-warning)"} />
          <div className="stat-footer">Based on local air quality</div>
        </div>
        <div className="stat-card" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div className="ring-content" style={{textAlign: 'center', marginBottom: '16px'}}>
            <span className="ring-value" style={{color: tempColor, fontSize: '32px', fontWeight: 'bold'}}>{currentTemp}°C</span>
            <span className="ring-label" style={{display: 'block', fontSize: '12px', color: 'var(--text-secondary)'}}>Live Temperature</span>
          </div>
          <div className="ring-content" style={{textAlign: 'center', marginBottom: '16px'}}>
            <span className="ring-value" style={{color: 'var(--status-warning)', fontSize: '32px', fontWeight: 'bold'}}>{currentAqi}</span>
            <span className="ring-label" style={{display: 'block', fontSize: '12px', color: 'var(--text-secondary)'}}>Live US AQI</span>
          </div>
          <button onClick={testAiConnection} style={{padding: '5px 10px', fontSize: '12px', background: 'var(--status-info)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
            Test AI Bridge
          </button>
          <span style={{fontSize: '10px', marginTop: '4px', color: 'var(--text-secondary)'}}>{aiStatus}</span>
        </div>
      </div>

      <div className="middle-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Recent Heat Trends (Last 5 Days)</div>
            {recentHeatData.length > 0 && recentHeatData[recentHeatData.length-1].value > 40 ? 
              <div className="badge-danger">SEVERE HEATWAVE</div> : 
              <div className="badge-warning">MONITORING</div>
            }
          </div>
          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentHeatData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--status-critical)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--bg-card)" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="colorValueNormal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a0aec0" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--bg-card)" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} dy={10} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)'}}/>
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {
                    recentHeatData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value > 40 ? "url(#colorValue)" : "url(#colorValueNormal)"} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="map-snippet-card">
          <div className="map-image"></div>
          <div className="map-info">
            <h3>Micro-Climate Layer</h3>
            <p>Last scanned: 12 minutes ago</p>
            <button className="btn-full">Expand Map</button>
          </div>
        </div>
      </div>

      <div className="actions-section">
        <div className="actions-header">
          <h2>Recommended Priority Actions</h2>
          <button className="view-all">View All Actions</button>
        </div>
        <div className="actions-grid">
          <ActionCard 
            icon={<Home size={18} />}
            impact="High Impact"
            impactClass="impact-high"
            cost="₹45,000"
            title="Install Cool Roof"
            desc="Apply solar reflective coating to reduce indoor heat by up to 5°C."
            roi={75}
          />
          <ActionCard 
            icon={<TreePine size={18} />}
            impact="Med Impact"
            impactClass="impact-med"
            cost="₹12,000"
            title="Plant 3 Shade Trees"
            desc="Native species like Neem or Peepal for natural perimeter cooling."
            roi={50}
          />
          <ActionCard 
            icon={<Droplets size={18} />}
            impact="Urgent"
            impactClass="impact-urgent"
            cost="₹85,000"
            title="Rainwater Harvest"
            desc="Upgrade drainage to store 5,000L of monsoon runoff annually."
            roi={90}
          />
          <ActionCard 
            icon={<Zap size={18} />}
            impact="Max Impact"
            impactClass="impact-max"
            cost="₹1,20,000"
            title="Grid Hybrid Solar"
            desc="Install 5kW PV panels to offset peak cooling energy demands."
            roi={65}
          />
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ icon, impact, impactClass, cost, title, desc, roi }) => (
  <div className="action-card">
    <div className="action-top">
      <div className="action-icon">{icon}</div>
      <div className="action-impact">
        <span className={`impact-badge ${impactClass}`}>{impact}</span>
        <div className="action-cost">Cost: {cost}</div>
      </div>
    </div>
    <div className="action-title">{title}</div>
    <div className="action-desc">{desc}</div>
    <div className="roi-container">
      <div className="roi-bar-bg">
        <div className="roi-bar-fill" style={{width: `${roi}%`}}></div>
      </div>
      <div className="roi-text">{roi}% ROI</div>
    </div>
  </div>
);

export default CitizenAnalytics;
