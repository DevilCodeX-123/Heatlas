import { useState, useEffect } from 'react';
import { Plus, Clock, ExternalLink, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { getMultiCityLiveWeather, getUserLocation, getWeatherData, getReverseGeocoding, getAqiData } from '../utils/geoServices';
import './Rankings.css';

const TARGET_CITIES = [
  { city: 'New Delhi', state: 'Delhi', lat: 28.6139, lon: 77.2090, img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=100&q=80' },
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777, img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=100&q=80' },
  { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=100&q=80' },
  { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639, img: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=100&q=80' },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873, img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=100&q=80' },
  { city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946, img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=100&q=80' },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867, img: 'https://images.unsplash.com/photo-1587326442654-e699cb4f0bc4?w=100&q=80' }
];

const Rankings = () => {
  const [liveRankings, setLiveRankings] = useState([]);
  const [localData, setLocalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Heat Stress');
  
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Multi-City Live Data
        const citiesData = await getMultiCityLiveWeather(TARGET_CITIES);
        // Sort by Temperature Descending initially
        citiesData.sort((a, b) => b.temp - a.temp);
        setLiveRankings(citiesData);

        // 2. Fetch User Local Data for Baseline comparison
        let lat = 28.6139; let lon = 77.2090;
        try {
          const coords = await getUserLocation();
          lat = coords.lat; lon = coords.lon;
        } catch(e) {}

        const [weather, aqi, geo] = await Promise.all([
          getWeatherData(lat, lon),
          getAqiData(lat, lon),
          getReverseGeocoding(lat, lon)
        ]);

        const city = geo?.address?.city || "Your City";
        setLocalData({
          city,
          temp: weather?.current?.temperature_2m || 0,
          aqi: aqi?.current?.us_aqi || 0,
          sustain: Math.max(0, 100 - (aqi?.current?.us_aqi || 0) / 3)
        });

      } catch (err) {
        console.error("Rankings Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleSort = (tab) => {
    setActiveTab(tab);
    const sorted = [...liveRankings];
    if (tab === 'Heat Stress') sorted.sort((a, b) => b.temp - a.temp);
    if (tab === 'AQI') sorted.sort((a, b) => b.aqi - a.aqi);
    setLiveRankings(sorted);
  };

  const topCity = liveRankings[0];

  return (
    <div className="rankings-container">
      <div className="comparative-section">
        <div className="comp-header">
          <div className="comp-title">
            <h2>Real-Time Insights</h2>
            <p>Comparing your local climate to the most extreme metro right now.</p>
          </div>
          <div className="comp-actions">
            <button className="add-city-btn">
              <Plus size={16} /> Live Data Active
            </button>
          </div>
        </div>

        <div className="compare-grid">
          {/* BASELINE (USER LOCATION) */}
          <div className="city-compare-card">
            <div className="city-comp-top">
              <div className="city-comp-info">
                <span className="city-role">YOUR LOCATION (BASELINE)</span>
                <span className="city-name"><MapPin size={16} style={{display:'inline'}}/> {localData ? localData.city : 'Locating...'}</span>
              </div>
              <div className="city-aqi">
                <div className={`aqi-value ${localData?.aqi > 100 ? 'severe' : 'mod'}`}>{loading ? '--' : Math.round(localData?.aqi)}</div>
                <div className="aqi-label">Live AQI</div>
              </div>
            </div>
            <div className="city-metrics">
              <div className="metric-box">
                <div className="metric-label">Heat Stress</div>
                <div className="metric-value">{loading ? '--' : localData?.temp}°C</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">Sustain Score</div>
                <div className="metric-value">{loading ? '--' : Math.round(localData?.sustain)}</div>
              </div>
            </div>
          </div>

          {/* EXTREME (HOTTEST CITY) */}
          {topCity && (
            <div className="city-compare-card" style={{border: '1px solid var(--status-critical)'}}>
              <div className="city-comp-top">
                <div className="city-comp-info">
                  <span className="city-role" style={{color: 'var(--status-critical)'}}>HOTTEST METRO RIGHT NOW</span>
                  <span className="city-name">{topCity.city}</span>
                </div>
                <div className="city-aqi">
                  <div className={`aqi-value ${topCity.aqi > 100 ? 'severe' : 'mod'}`}>{Math.round(topCity.aqi)}</div>
                  <div className="aqi-label">Live AQI</div>
                </div>
              </div>
              <div className="city-metrics">
                <div className="metric-box">
                  <div className="metric-label">Heat Stress</div>
                  <div className="metric-value" style={{color: 'var(--status-critical)'}}>{topCity.temp}°C</div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">Green Cover</div>
                  <div className="metric-value">Unknown</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="leaderboards-section">
        <div className="lb-header">
          <h2 className="lb-title">Live Metro Leaderboard</h2>
          <div className="lb-updated">
            <Clock size={14} /> LIVE FETCH FROM OPEN-METEO
          </div>
        </div>

        <div className="lb-tabs">
          <button className={`lb-tab ${activeTab === 'Heat Stress' ? 'active' : ''}`} onClick={() => handleSort('Heat Stress')}>Heat Stress</button>
          <button className={`lb-tab ${activeTab === 'AQI' ? 'active' : ''}`} onClick={() => handleSort('AQI')}>AQI</button>
        </div>

        <table className="lb-table">
          <thead>
            <tr>
              <th className="rank-cell">Rank</th>
              <th>City</th>
              <th>State</th>
              <th>Live Temp</th>
              <th>Live AQI</th>
              <th style={{textAlign: 'right'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>Fetching live satellite & weather models...</td></tr>
            ) : (
              liveRankings.map((item, index) => (
                <tr key={item.city}>
                  <td className="rank-cell">
                    <div className="rank-badge">{index + 1}</div>
                  </td>
                  <td>
                    <div className="city-cell">
                      <div className="city-img" style={{backgroundImage: `url(${item.img})`}}></div>
                      <div className="city-details">
                        <span className="c-name">{item.city}</span>
                        <span className="c-state-small">{item.state}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="state-cell">{item.state}</span>
                  </td>
                  <td>
                    <div style={{fontWeight: 'bold', color: item.temp > 40 ? 'var(--status-critical)' : 'inherit'}}>
                      {item.temp}°C
                    </div>
                  </td>
                  <td>
                    <div className="aqi-index-cell">
                      <div className={`dot ${item.aqi > 100 ? 'severe' : item.aqi > 50 ? 'mod' : 'good'}`}></div>
                      {Math.round(item.aqi)}
                    </div>
                  </td>
                  <td className="action-cell">
                    {item.temp > 40 ? <span className="badge-danger">Extreme Heat</span> : <span className="badge-warning">Stable</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rankings;
