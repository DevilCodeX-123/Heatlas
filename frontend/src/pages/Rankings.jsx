import { Plus, Clock, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import './Rankings.css';

const rankingsData = [
  { rank: 1, city: 'Mysuru', state: 'Karnataka', img: 'https://images.unsplash.com/photo-1600078512255-a05d21a24891?w=100&q=80', aqi: 42, trend: '-12%', trendDir: 'down' },
  { rank: 2, city: 'Indore', state: 'Madhya Pradesh', img: 'https://images.unsplash.com/photo-1615022046835-265103a89078?w=100&q=80', aqi: 51, trend: '-5%', trendDir: 'down' },
  { rank: 3, city: 'Chandigarh', state: 'Chandigarh UT', img: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=100&q=80', aqi: 68, trend: '+2%', trendDir: 'up' },
  { rank: 4, city: 'Bhopal', state: 'Madhya Pradesh', img: 'https://images.unsplash.com/photo-1622308644420-a6125b206f6b?w=100&q=80', aqi: 84, trend: '-15%', trendDir: 'down' },
];

const Rankings = () => {
  return (
    <div className="rankings-container">
      <div className="comparative-section">
        <div className="comp-header">
          <div className="comp-title">
            <h2>Comparative Insights</h2>
            <p>Analyze environmental benchmarks across urban hubs.</p>
          </div>
          <div className="comp-actions">
            <button className="add-city-btn">
              <Plus size={16} /> Add City to Compare...
            </button>
            <button className="compare-btn">Compare</button>
          </div>
        </div>

        <div className="compare-grid">
          <div className="city-compare-card">
            <div className="city-comp-top">
              <div className="city-comp-info">
                <span className="city-role">BASELINE</span>
                <span className="city-name">New Delhi</span>
              </div>
              <div className="city-aqi">
                <div className="aqi-value severe">182</div>
                <div className="aqi-label">AQI Level (Severe)</div>
              </div>
            </div>
            <div className="city-metrics">
              <div className="metric-box">
                <div className="metric-label">Heat Stress</div>
                <div className="metric-value">42°C</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">Green Cover</div>
                <div className="metric-value">20.2%</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">Sustain Score</div>
                <div className="metric-value">64</div>
              </div>
            </div>
          </div>

          <div className="city-compare-card">
            <div className="city-comp-top">
              <div className="city-comp-info">
                <span className="city-role">COMPARISON</span>
                <span className="city-name">Mumbai</span>
              </div>
              <div className="city-aqi">
                <div className="aqi-value mod">74</div>
                <div className="aqi-label">AQI Level (Moderate)</div>
              </div>
            </div>
            <div className="city-metrics">
              <div className="metric-box">
                <div className="metric-label">Heat Stress</div>
                <div className="metric-value">34°C</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">Green Cover</div>
                <div className="metric-value">12.8%</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">Sustain Score</div>
                <div className="metric-value">71</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="leaderboards-section">
        <div className="lb-header">
          <h2 className="lb-title">City Performance Leaderboards</h2>
          <div className="lb-updated">
            <Clock size={14} /> LAST UPDATED: 12 OCT 2023, 14:30 IST
          </div>
        </div>

        <div className="lb-tabs">
          <button className="lb-tab active">AQI</button>
          <button className="lb-tab">Heat Stress</button>
          <button className="lb-tab">Greenest Cities</button>
          <button className="lb-tab">Most Sustainable</button>
        </div>

        <table className="lb-table">
          <thead>
            <tr>
              <th className="rank-cell">Rank</th>
              <th>City</th>
              <th>State</th>
              <th>AQI Index</th>
              <th>1Y Trend</th>
              <th style={{textAlign: 'right'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rankingsData.map(item => (
              <tr key={item.rank}>
                <td className="rank-cell">
                  <div className="rank-badge">{item.rank}</div>
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
                  <div className="aqi-index-cell">
                    <div className={`dot ${item.aqi > 60 ? 'mod' : 'good'}`}></div>
                    {item.aqi}
                  </div>
                </td>
                <td>
                  <span className={`trend-badge ${item.trendDir === 'down' ? 'trend-down' : 'trend-up'}`}>
                    {item.trend}
                  </span>
                </td>
                <td className="action-cell">
                  <button className="action-link"><ExternalLink size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="lb-footer">
          <div>Showing 4 of 240 Indian Cities</div>
          <div className="pagination">
            <button className="page-btn"><ChevronLeft size={16} /></button>
            <button className="page-btn"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rankings;
