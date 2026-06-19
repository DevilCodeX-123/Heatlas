import { useState, useEffect } from 'react';
import { Calendar, Download, TreePine, Eye, Leaf, Star, ChevronRight, CheckCircle2, Link } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts';
import './Governance.css';

const impactData = [
  { name: 'JAN', value: 30 },
  { name: 'FEB', value: 45 },
  { name: 'MAR', value: 80 },
  { name: 'APR', value: 60 },
  { name: 'MAY', value: 50 },
];

const Governance = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("Backend returned non-array data:", data);
          setProjects([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setProjects([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="governance-container">
      <div className="page-header">
        <div>
          <div className="page-title">
            <h1>Climate Governance Engine</h1>
            <p className="page-subtitle">Real-time oversight of national ecological remediation projects and budget utilization.</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-outline">
            <Calendar size={16} /> Q3 Fiscal 2024
          </button>
          <button className="btn-outline">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      <div className="gov-stats">
        <div className="gov-stat-card">
          <div className="gov-stat-header">
            <span>Total Projects</span>
            <TreePine size={16} />
          </div>
          <div className="gov-stat-value">1,248</div>
          <div className="gov-stat-trend trend-up">
            <CheckCircle2 size={12} /> +12% vs last quarter
          </div>
        </div>
        <div className="gov-stat-card">
          <div className="gov-stat-header">
            <span>Budget Efficiency</span>
            <Eye size={16} />
          </div>
          <div className="gov-stat-value">94.2%</div>
          <div className="gov-stat-trend trend-up">
            <CheckCircle2 size={12} /> Optimized via AI
          </div>
        </div>
        <div className="gov-stat-card">
          <div className="gov-stat-header">
            <span>Net Green Gain</span>
            <Leaf size={16} />
          </div>
          <div className="gov-stat-value">+18.4k Ha</div>
          <div className="gov-stat-trend trend-up">
            <CheckCircle2 size={12} /> Satellite Verified
          </div>
        </div>
        <div className="gov-stat-card">
          <div className="gov-stat-header">
            <span>Avg Success Score</span>
            <Star size={16} />
          </div>
          <div className="gov-stat-value">8.4/10</div>
          <div className="gov-stat-trend" style={{color: 'var(--text-secondary)'}}>
            <Info size={12} /> Based on biodiversity index
          </div>
        </div>
      </div>

      <div className="gov-main">
        <div className="registry-section">
          <div className="registry-header">
            <h2>Active Projects Registry</h2>
            <div className="registry-filters">
              <button className="filter-btn">Filter</button>
              <button className="filter-btn">Sort</button>
            </div>
          </div>
          <table className="registry-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Budget Allocation</th>
                <th>Completion</th>
                <th>Success Score</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>Loading projects from database...</td></tr>
              ) : projects.map(p => (
                <tr key={p._id || p.id}>
                  <td>
                    <div className="project-name-cell">
                      <div className="project-icon"><TreePine size={16} color={p.color} /></div>
                      <div className="project-info">
                        <span className="project-name">{p.name}</span>
                        <span className="project-zone">Zone: {p.zone}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="budget-val">{p.budget}</span>
                  </td>
                  <td>
                    <div className="completion-cell">
                      <div className="completion-bar-bg">
                        <div className="completion-bar-fill" style={{width: `${p.completion}%`, backgroundColor: p.color}}></div>
                      </div>
                      <span className="completion-text">{p.completion}% {p.phase}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`score-badge score-${p.status}`}>
                      {p.score} {p.status !== 'tbd' && <Link size={12} />}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="gov-right-panel">
          <div className="gov-map-card">
            <div className="gov-map-header">
              <div className="live-dot"></div>
              Live Project Clusters
            </div>
            <div className="gov-map-image">
              {/* Map pins would go here */}
            </div>
          </div>
          
          <div className="gov-chart-card">
            <div className="gov-chart-header">
              <span>Net Resource Impact</span>
              <ChevronRight size={16} />
            </div>
            <div style={{ height: '140px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 10}} dy={5} />
                  <Bar dataKey="value" fill="var(--text-primary)" radius={[2, 2, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '12px'}}>
              <span style={{color: 'var(--text-secondary)'}}>AI Optimization Gain</span>
              <span style={{color: 'var(--status-good)', fontWeight: 600}}>+₹4.2 Cr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Icon stub for missing Info
const Info = ({size}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);

export default Governance;
