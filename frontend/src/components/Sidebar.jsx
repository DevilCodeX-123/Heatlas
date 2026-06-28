import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  Map, 
  BarChart2, 
  Landmark, 
  ThermometerSnowflake, 
  Activity, 
  Trophy,
  Settings,
  HelpCircle,
  ShieldAlert,
  LogOut,
  X,
  Bot
} from 'lucide-react';
import Modal from './Modal';
import './Layout.css';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Get current user from local storage
  const currentUserStr = localStorage.getItem('heatlas_current_user');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : { name: 'Guest User', email: '' };
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('heatlas_auth');
    navigate('/auth');
  };
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <ThermometerSnowflake color="var(--accent-primary)" />
          Heatlas
          <button className="mobile-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="user-profile">
          <div className="avatar">
             <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=2d3340&color=fff`} alt="User" style={{borderRadius: '50%', width: '100%'}} />
          </div>
          <div className="user-info">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-role">Research Dept</span>
          </div>
        </div>
      </div>

      <nav className="nav-menu">
        <NavLink to="/map" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Map className="nav-icon" />
          <span>Map Hub</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <BarChart2 className="nav-icon" />
          <span>India Heat Monitor</span>
        </NavLink>
        <NavLink to="/governance" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Landmark className="nav-icon" />
          <span>Governance</span>
        </NavLink>
        <NavLink to="/simulator" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <ThermometerSnowflake className="nav-icon" />
          <span>Cooling Simulator</span>
        </NavLink>
        <NavLink to="/action" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Activity className="nav-icon" />
          <span>Action Engine</span>
        </NavLink>
        <NavLink to="/rankings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Trophy className="nav-icon" />
          <span>Rankings</span>
        </NavLink>
        <NavLink to="/ai" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Bot className="nav-icon" />
          <span>AI Assistant</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="submit-btn" onClick={() => setIsReportOpen(true)}>
          Submit Report
        </button>
        <div className="footer-nav">
          <button className="footer-nav-item" onClick={() => setIsSettingsOpen(true)}>
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button className="footer-nav-item" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Platform Settings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{fontWeight: 600}}>Push Notifications</div>
              <div style={{fontSize: 12, color: 'var(--text-muted)'}}>Receive alerts for thermal anomalies</div>
            </div>
            <input type="checkbox" defaultChecked style={{width: 18, height: 18, accentColor: 'var(--accent-primary)'}} />
          </div>
          <div style={{ height: 1, background: 'var(--border-color)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{fontWeight: 600}}>Location Services</div>
              <div style={{fontSize: 12, color: 'var(--text-muted)'}}>Allow background location tracking</div>
            </div>
            <input type="checkbox" defaultChecked style={{width: 18, height: 18, accentColor: 'var(--accent-primary)'}} />
          </div>
        </div>
      </Modal>

      <Modal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} title="Submit Heat Anomaly">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'block'}}>Issue Type</label>
            <select style={{width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)'}}>
              <option>Extreme Localized Heat</option>
              <option>Power Grid Failure</option>
              <option>Water Scarcity</option>
            </select>
          </div>
          <div>
            <label style={{fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'block'}}>Description</label>
            <textarea rows="3" placeholder="Describe the anomaly..." style={{width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)'}}></textarea>
          </div>
          <button className="submit-btn" style={{marginTop: 8}} onClick={() => { alert('Report submitted to Central DB'); setIsReportOpen(false); }}>
            Submit to Network
          </button>
        </div>
      </Modal>

    </aside>
  );
};

export default Sidebar;
