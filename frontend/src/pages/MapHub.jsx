import { useState, useEffect } from 'react';
import { ThermometerSun, Wind, TreePine, Droplets, TrendingUp, AlertTriangle, Crosshair, MapPin, Loader } from 'lucide-react';
import { MapContainer, TileLayer, WMSTileLayer, useMap } from 'react-leaflet';
import { getUserLocation, getWeatherData, getReverseGeocoding } from '../utils/geoServices';
import 'leaflet/dist/leaflet.css';
import './MapHub.css';

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] !== 20.5937) {
      map.flyTo(center, 13);
    }
  }, [center, map]);
  return null;
};

const MapHub = () => {
  const [activeLayer, setActiveLayer] = useState('heat');
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [currentTemp, setCurrentTemp] = useState("--");
  const [locationName, setLocationName] = useState("National Overview");
  const [isLocating, setIsLocating] = useState(false);

  // Fetch initial generic India temp
  useEffect(() => {
    getWeatherData(20.5937, 78.9629).then(data => {
      if (data) setCurrentTemp(data.current.temperature_2m);
    });
  }, []);

  const handleLocateMe = async () => {
    setIsLocating(true);
    try {
      const coords = await getUserLocation();
      setMapCenter([coords.lat, coords.lon]);
      
      const [wData, geo] = await Promise.all([
        getWeatherData(coords.lat, coords.lon),
        getReverseGeocoding(coords.lat, coords.lon)
      ]);
      
      if (wData) setCurrentTemp(wData.current.temperature_2m);
      if (geo && geo.address) {
        setLocationName(geo.address.city || geo.address.town || geo.address.village || geo.address.county || "Local Area");
      }
    } catch (err) {
      alert("Could not get location. Please allow browser location access.");
    } finally {
      setIsLocating(false);
    }
  };

  // Determine base map URL based on active layer
  const getTileLayer = () => {
    if (activeLayer === 'green') {
      return "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";
    } else if (activeLayer === 'water') {
      return "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}";
    } else {
      return "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
    }
  };

  // Determine NASA GIBS WMS Layer
  const getNasaGibsLayer = () => {
    switch (activeLayer) {
      case 'heat': return 'MODIS_Terra_L3_Land_Surface_Temp_Monthly_Day'; // Monthly composite ensures zero cloud gaps
      case 'aqi': return 'MODIS_Terra_Aerosol'; // Daily is fine for aerosols
      case 'green': return 'MODIS_Terra_L3_NDVI_Monthly'; // Monthly vegetation
      case 'water': return 'MODIS_Water_Mask';
      default: return null;
    }
  };

  // Get a stable date in the past for composites
  const getGibsTime = () => {
    if (activeLayer === 'aqi' || activeLayer === 'water') {
       // Daily layers just need a couple days ago to process
       const d = new Date();
       d.setDate(d.getDate() - 3);
       return d.toISOString().split('T')[0];
    }
    // For Monthly layers (Heat, Green), we must provide the 1st day of a previous month
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    d.setDate(1);
    return d.toISOString().split('T')[0];
  };

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
        <MapContainer center={mapCenter} zoom={5} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
          <TileLayer
            key={activeLayer}
            attribution='&copy; Google Maps'
            url={getTileLayer()}
            maxZoom={20}
          />
          
          {/* Real Live Satellite Data from NASA GIBS */}
          {getNasaGibsLayer() && (
            <WMSTileLayer
              key={`${activeLayer}-${getGibsTime()}`}
              url="https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi"
              layers={getNasaGibsLayer()}
              format="image/png"
              transparent={true}
              version="1.3.0"
              opacity={0.65}
              time={getGibsTime()}
              attribution='&copy; <a href="https://earthdata.nasa.gov/gibs">NASA EOSDIS GIBS</a>'
            />
          )}

          <MapController center={mapCenter} />
        </MapContainer>
      </div>

      <div className="map-side-panel">
        <div className="panel-header">
          <h3>{locationName}</h3>
        </div>
        
        <div className="stat-block">
          <span className="stat-label">Avg. Temp</span>
          <span className="stat-value">{currentTemp}°C</span>
          <span className="stat-trend"><TrendingUp size={14} /> Live</span>
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
        <div className="legend-title">
          {activeLayer === 'heat' && "Thermal Distribution"}
          {activeLayer === 'aqi' && "Pollution Severity (AQI)"}
          {activeLayer === 'green' && "Vegetation Density (NDVI)"}
          {activeLayer === 'water' && "Water Surface Availability"}
        </div>
        <div className={`legend-gradient layer-${activeLayer}`}></div>
        <div className="legend-labels">
          {activeLayer === 'heat' && <><span style={{color: '#fcd34d'}}>Safe (25°C)</span><span style={{color: '#dc2626'}}>Critical (45°C+)</span></>}
          {activeLayer === 'aqi' && <><span style={{color: '#34d399'}}>Good (0-50)</span><span style={{color: '#7e22ce'}}>Hazardous (300+)</span></>}
          {activeLayer === 'green' && <><span style={{color: '#15803d'}}>Dense Forest</span><span style={{color: '#86efac'}}>Sparse</span></>}
          {activeLayer === 'water' && <><span style={{color: '#1d4ed8'}}>Deep Water</span><span style={{color: '#93c5fd'}}>Shallow</span></>}
        </div>
      </div>

      <div className="map-actions">
        <button className="action-btn" onClick={handleLocateMe} disabled={isLocating} title="Find My Location">
          {isLocating ? <Loader size={24} className="spinning" /> : <Crosshair size={24} />}
        </button>
      </div>
    </div>
  );
};

export default MapHub;
