import { useState } from 'react';
import { ThermometerSun, Wind, TreePine, Droplets, TrendingUp, AlertTriangle, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapHub.css';

const MapHub = () => {
  const [activeLayer, setActiveLayer] = useState('heat');

  return (
    <div className="map-hub-container">
      <div className="layer-toggles">
        <button 
          className={`layer-btn ${activeLayer === 'heat' ? 'active' : ''}`}
          onClick={() => setActiveLayer('heat')}
        >
          <ThermometerSun size={16} /> Heat Stress
        </button>
        <button 
          className={`layer-btn ${activeLayer === 'aqi' ? 'active' : ''}`}
          onClick={() => setActiveLayer('aqi')}
        >
          <Wind size={16} /> AQI
        </button>
        <button 
          className={`layer-btn ${activeLayer === 'green' ? 'active' : ''}`}
          onClick={() => setActiveLayer('green')}
        >
          <TreePine size={16} /> Green Cover
        </button>
        <button 
          className={`layer-btn ${activeLayer === 'water' ? 'active' : ''}`}
          onClick={() => setActiveLayer('water')}
        >
          <Droplets size={16} /> Water Bodies
        </button>
      </div>

      <div className="map-wrapper">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>

      <div className="map-side-panel">
        <div className="panel-header">
          <h3>National Overview</h3>
        </div>
        
        <div className="stat-block">
          <span className="stat-label">Avg. Temp</span>
          <span className="stat-value">34.2°C</span>
          <span className="stat-trend"><TrendingUp size={14} /> +1.2° vs yday</span>
        </div>

        <div className="divider"></div>

        <div className="stat-block">
          <span className="stat-label" style={{marginBottom: '12px'}}>Active Alerts</span>
          <div className="alert-item">
            <AlertTriangle size={16} className="alert-icon" />
            <span>Severe heatwave warning issued for Northern plains (next 48h).</span>
          </div>
        </div>

        <div className="divider"></div>
        <div className="updated-time">Last updated: 14:02 IST</div>
      </div>

      <div className="map-legend">
        <div className="legend-title">Heat Distribution</div>
        <div className="legend-gradient"></div>
        <div className="legend-labels">
          <span>Safe</span>
          <span>Critical</span>
        </div>
      </div>

      <div className="map-actions">
        <button className="action-btn">
          <Crosshair size={24} />
        </button>
      </div>
    </div>
  );
};

export default MapHub;
