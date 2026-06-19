import { useState, useEffect } from 'react';
import { Download, Share2, Home, TreePine, Droplets, Zap } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import './CitizenAnalytics.css';

const heatData = [
  { name: '2019', value: 30 },
  { name: '2020', value: 45 },
  { name: '2021', value: 40 },
  { name: '2022', value: 65 },
  { name: '2023', value: 85 },
];

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

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/data/weather').then(res => res.json()),
      fetch('http://localhost:5000/api/data/aqi').then(res => res.json())
    ]).then(([weather, aqi]) => {
      setWeatherData(weather);
      setAqiData(aqi);
    }).catch(err => console.error(err));
  }, []);

  const currentTemp = weatherData?.current?.temperature_2m || 42;
  const currentAqi = aqiData?.current?.us_aqi || 182;
  const tempColor = currentTemp > 40 ? 'var(--status-critical)' : currentTemp > 35 ? 'var(--status-warning)' : 'var(--status-good)';

  return (
    <div className="analytics-container">
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            Analytics &gt; <span>Delhi NCR</span>
          </div>
          <div className="page-title">
            <h1>Citizen Intelligence Dashboard</h1>
            <p className="page-subtitle">Personalized sustainability and heat risk analysis for Chanakyapuri, New Delhi.</p>
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
          <div className="stat-title">Heat Risk Score</div>
          <GaugeChart value={82} color="var(--status-critical)" />
          <div className="stat-footer">Critical Exposure Detected</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Green Canopy Score</div>
          <GaugeChart value={34} color="var(--status-info)" />
          <div className="stat-footer">Below Regional Average (45%)</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Sustainability Score</div>
          <GaugeChart value={58} color="var(--status-warning)" />
          <div className="stat-footer">Moderate Adaptation Level</div>
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
            <div className="chart-title">Historical Heat Trends (5 Years)</div>
            <div className="badge-danger">SEVERE INCREASE</div>
          </div>
          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={heatData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    heatData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? "url(#colorValue)" : "url(#colorValueNormal)"} />
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
