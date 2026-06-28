import { useState, useEffect } from 'react';
import { Download, Share2, Home, TreePine, Droplets, Zap, MapPin, Search, Cpu } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { getWeatherData, getAqiData, getForwardGeocoding } from '../utils/geoServices';
import indiaData from '../data/indiaStatesDistricts.json';
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
  const [loadingLoc, setLoadingLoc] = useState(false);
  
  // Search UI State
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtsList, setDistrictsList] = useState([]);
  
  // AI State
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Update district list when state changes
  useEffect(() => {
    if (selectedState) {
      const stateObj = indiaData.states.find(s => s.state === selectedState);
      if (stateObj) {
        setDistrictsList(stateObj.districts);
        setSelectedDistrict('');
      }
    }
  }, [selectedState]);

  // Fetch data when a valid district is selected
  useEffect(() => {
    if (selectedState && selectedDistrict && districtsList.includes(selectedDistrict)) {
      fetchRegionData(selectedDistrict, selectedState);
    }
  }, [selectedDistrict]);

  const fetchRegionData = async (district, state) => {
    setLoadingLoc(true);
    setAiAnalysis('');
    
    try {
      const coords = await getForwardGeocoding(district, state);
      if (!coords) {
        alert("Could not find coordinates for this district.");
        setLoadingLoc(false);
        return;
      }
      
      const [weather, aqi] = await Promise.all([
        getWeatherData(coords.lat, coords.lon),
        getAqiData(coords.lat, coords.lon)
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

      // Trigger AI Analysis
      const temp = weather?.current?.temperature_2m || 0;
      const aqiVal = aqi?.current?.us_aqi || 0;
      fetchAiAnalysis(district, state, temp, aqiVal);

    } catch (err) {
      console.error("Error loading regional data:", err);
    } finally {
      setLoadingLoc(false);
    }
  };

  const fetchAiAnalysis = async (district, state, temp, aqi) => {
    setIsAiLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL_1 || 'http://localhost:8000';
      const res = await fetch(`${API_BASE}/api/ai/district-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ district, state, temperature: temp, aqi })
      });
      const data = await res.json();
      setAiAnalysis(data.analysis || "Analysis complete.");
    } catch (err) {
      console.error(err);
      setAiAnalysis("Unable to connect to Heatlas AI Engine.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentTemp = weatherData?.current?.temperature_2m ?? "--";
  const currentAqi = aqiData?.current?.us_aqi ?? "--";
  const tempColor = currentTemp > 40 ? 'var(--status-critical)' : currentTemp > 35 ? 'var(--status-warning)' : 'var(--status-good)';

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
            Analytics &gt; <span>India Heat Monitor</span>
          </div>
          <div className="page-title">
            <h1>India Heat Monitor</h1>
            <p className="page-subtitle">Select a State and District to generate a comprehensive AI-driven climate and sustainability report.</p>
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

      {/* SEARCH FILTERS UI */}
      <div style={{
        background: 'var(--bg-card)', 
        padding: '20px', 
        borderRadius: '12px', 
        border: '1px solid var(--border-color)',
        marginBottom: '24px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center'
      }}>
        <div style={{flex: 1}}>
          <label style={{display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px'}}>Select State / Union Territory</label>
          <input 
            list="stateList" 
            placeholder="Type to search state..." 
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)'}}
          />
          <datalist id="stateList">
            {indiaData.states.map(s => <option key={s.state} value={s.state} />)}
          </datalist>
        </div>

        <div style={{flex: 1}}>
          <label style={{display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px'}}>Select District</label>
          <input 
            list="districtList" 
            placeholder={selectedState ? "Type to search district..." : "Select state first"}
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedState || districtsList.length === 0}
            style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', opacity: (!selectedState) ? 0.5 : 1}}
          />
          <datalist id="districtList">
            {districtsList.map(d => <option key={d} value={d} />)}
          </datalist>
        </div>

        <button 
          className="btn-primary" 
          style={{marginTop: '22px', height: '42px'}}
          onClick={() => {
            if (selectedState && selectedDistrict) {
              fetchRegionData(selectedDistrict, selectedState);
            }
          }}
        >
          <Search size={16} /> Analyze
        </button>
      </div>

      {loadingLoc ? (
        <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-secondary)'}}>
          <div className="spinner" style={{marginBottom: '16px'}}></div>
          Fetching live satellite & sensor data for {selectedDistrict}...
        </div>
      ) : !weatherData ? (
        <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '12px'}}>
          <MapPin size={48} style={{opacity: 0.2, marginBottom: '16px'}} />
          <h3>No Region Selected</h3>
          <p>Please select a State and District above to generate the report.</p>
        </div>
      ) : (
        <>
          {/* AI ANALYSIS HERO SECTION */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(14, 165, 233, 0.05))',
            border: '1px solid var(--status-info)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--status-info)', fontWeight: 'bold'}}>
              <Cpu size={20} />
              <span>Heatlas AI Analysis for {selectedDistrict}, {selectedState}</span>
            </div>
            
            {isAiLoading ? (
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)'}}>
                <div className="spinner" style={{width: '20px', height: '20px', borderWidth: '2px'}}></div>
                AI is analyzing geographic and meteorological patterns...
              </div>
            ) : (
              <p style={{fontSize: '16px', lineHeight: '1.6', color: 'var(--text-primary)', margin: 0}}>
                {aiAnalysis}
              </p>
            )}
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
              <div className="ring-content" style={{textAlign: 'center'}}>
                <span className="ring-value" style={{color: 'var(--status-warning)', fontSize: '32px', fontWeight: 'bold'}}>{currentAqi}</span>
                <span className="ring-label" style={{display: 'block', fontSize: '12px', color: 'var(--text-secondary)'}}>Live US AQI</span>
              </div>
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
                <p>Location: {selectedDistrict}</p>
                <button className="btn-full">Expand Map</button>
              </div>
            </div>
          </div>

          <div className="actions-section">
            <div className="actions-header">
              <h2>Recommended Priority Actions for {selectedDistrict}</h2>
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
        </>
      )}
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
