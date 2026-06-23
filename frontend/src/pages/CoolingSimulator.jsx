import { useState, useEffect } from 'react';
import { Plus, Minus, Crosshair, Layers, TreePine, Home, Hash, TrendingUp, Send } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { getUserLocation, getWeatherData, getReverseGeocoding } from '../utils/geoServices';
import 'leaflet/dist/leaflet.css';
import './CoolingSimulator.css';

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15);
  }, [center, map]);
  return null;
};

const CoolingSimulator = () => {
  const [treeDensity, setTreeDensity] = useState(12);
  const [greenRoof, setGreenRoof] = useState(5);
  const [albedo, setAlbedo] = useState(true);
  
  const [baselineTemp, setBaselineTemp] = useState(44.2);
  const [coords, setCoords] = useState([28.6315, 77.2167]);
  const [locationName, setLocationName] = useState("Connaught Place Central • Ward 04");

  useEffect(() => {
    const fetchLocalData = async () => {
      let lat = 28.6315; let lon = 77.2167;
      try {
        const c = await getUserLocation();
        lat = c.lat; lon = c.lon;
        setCoords([lat, lon]);
      } catch(e) {}

      const [weather, geo] = await Promise.all([
        getWeatherData(lat, lon),
        getReverseGeocoding(lat, lon)
      ]);

      if (weather?.current?.temperature_2m) {
        setBaselineTemp(weather.current.temperature_2m + 2.5); // Add 2.5C for Urban Heat Island effect to simulate a hotspot
      }
      if (geo?.address?.city) {
        setLocationName(`${geo.address.city} Urban Hotspot`);
      }
    };
    fetchLocalData();
  }, []);

  // Simple calculation for projection values based on inputs
  const tempRed = -0.5 - (treeDensity - 12)*0.1 - (greenRoof - 5)*0.05 - (albedo ? 0 : -0.8);
  const estInv = 4.8 + (treeDensity - 12)*0.1 + (greenRoof - 5)*0.2 + (albedo ? 0 : -0.5);

  return (
    <div className="simulator-container">
      <div className="sim-map-wrapper">
        <MapContainer center={coords} zoom={15} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
          <MapUpdater center={coords} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <CircleMarker center={coords} radius={40} color="var(--status-critical)" fillColor="var(--status-critical)" fillOpacity={0.4}>
            <Popup>
              BASE HOTSPOT: {baselineTemp.toFixed(1)}°C <br/>
              SIMULATED: {(baselineTemp + tempRed).toFixed(1)}°C
            </Popup>
          </CircleMarker>
        </MapContainer>

        <div className="sim-map-controls">
          <button><Plus size={20} /></button>
          <button><Minus size={20} /></button>
          <button><Crosshair size={20} /></button>
          <button><Layers size={20} /></button>
        </div>

        <div className="active-sector">
          <div className="sector-label">Active Sector</div>
          <div className="sector-name">{locationName}</div>
        </div>
      </div>

      <div className="sim-side-panel">
        <div className="sim-panel-header">
          <div className="sim-header-top">
            <h2>Scenario Configurator</h2>
            <div className="engine-version">v2.4<br/>Engine</div>
          </div>
          <p>Simulate environmental infrastructure to mitigate heat island effects.</p>
        </div>

        <div className="sim-config-section">
          <div className="config-item">
            <div className="config-header">
              <div className="config-label"><TreePine size={18} /> Tree Canopy Density</div>
              <div className="config-value">{treeDensity}%</div>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={treeDensity} 
              onChange={(e) => setTreeDensity(Number(e.target.value))} 
              className="sim-slider"
            />
            <div className="config-scale">
              <span>SPARSE</span>
              <span>DENSE CANOPY</span>
            </div>
          </div>

          <div className="config-item">
            <div className="config-header">
              <div className="config-label"><Home size={18} /> Green Roof Coverage</div>
              <div className="config-value">{greenRoof}%</div>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={greenRoof} 
              onChange={(e) => setGreenRoof(Number(e.target.value))} 
              className="sim-slider"
            />
            <div className="config-scale">
              <span>BASELINE</span>
              <span>FULL ADOPTION</span>
            </div>
          </div>

          <div className="config-item" style={{gap: '8px'}}>
            <div className="config-header">
              <div className="config-label"><Hash size={18} /> Reflective Albedo</div>
              <label className="toggle-switch">
                <input type="checkbox" checked={albedo} onChange={(e) => setAlbedo(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <p className="config-desc" style={{marginTop: '12px'}}>
              Applying high-albedo coatings to all asphalt surfaces within the sector to reflect solar radiation.
            </p>
          </div>
        </div>

        <div className="projections-section">
          <div className="proj-header">REAL-TIME PROJECTIONS</div>
          <div className="proj-grid">
            <div className="proj-box">
              <div className="p-label">SIMULATED TEMPERATURE</div>
              <div className="p-val" style={{color: 'var(--status-good)'}}>{(baselineTemp + tempRed).toFixed(1)}<span>°C</span></div>
              <div style={{height: '2px', backgroundColor: 'var(--border-color)', marginTop: '8px'}}>
                <div style={{width: '60%', height: '100%', backgroundColor: 'var(--status-good)'}}></div>
              </div>
            </div>
            <div className="proj-box">
              <div className="p-label">EST. INVESTMENT</div>
              <div className="p-val">₹{estInv.toFixed(1)}<span> Cr</span></div>
              <div className="p-sub">
                <TrendingUp size={12} className="icon" /> High ROI (14 mo)
              </div>
            </div>
          </div>

          <div className="proj-list">
            <div className="proj-list-item">
              <span>Grid Load Reduction</span>
              <span className="p-list-val">-18%</span>
            </div>
            <div className="proj-list-item">
              <span>Heat-Related Hospitalizations</span>
              <span className="p-list-val">-22%</span>
            </div>
            <div className="proj-list-item">
              <span>Carbon Sequestration (T/yr)</span>
              <span className="p-list-val">+{Math.round(142 + (treeDensity-12)*5)}</span>
            </div>
          </div>
        </div>

        <div className="sim-footer">
          <button className="btn-export">Export Model</button>
          <button className="btn-propose">
            <Send size={16} /> Propose Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoolingSimulator;
