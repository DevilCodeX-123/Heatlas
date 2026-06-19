import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Crosshair, Sun, Moon, FileText, AlertTriangle, LogOut, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Layout.css';

const Header = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(prev => prev === name ? null : name);
  };

  const handleLogout = () => {
    localStorage.removeItem('heatlas_auth');
    navigate('/auth');
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="header-links" ref={dropdownRef}>
           <NavLink to="/analytics" className={({ isActive }) => isActive ? "active" : ""}>Analytics</NavLink>
           
           <div className="dropdown-container">
             <button className={`nav-link-btn ${activeDropdown === 'reports' ? 'active' : ''}`} onClick={() => toggleDropdown('reports')}>Reports</button>
             {activeDropdown === 'reports' && (
               <div className="dropdown-menu">
                 <div className="dropdown-header">Recent Reports</div>
                 <div className="dropdown-item">
                   <FileText size={16} /> <div className="dd-text">Monthly Heat Survey <span>Generated 2d ago</span></div>
                 </div>
                 <div className="dropdown-item">
                   <FileText size={16} /> <div className="dd-text">Urban Canopy Audit <span>Processing AI...</span></div>
                 </div>
                 <div className="dropdown-footer">View All Reports</div>
               </div>
             )}
           </div>

           <div className="dropdown-container">
             <button className={`nav-link-btn ${activeDropdown === 'alerts' ? 'active' : ''}`} onClick={() => toggleDropdown('alerts')}>Alerts</button>
             {activeDropdown === 'alerts' && (
               <div className="dropdown-menu">
                 <div className="dropdown-header">System Alerts</div>
                 <div className="dropdown-item">
                   <AlertTriangle size={16} color="var(--status-warning)" /> <div className="dd-text">Moderate Heat Wave Expected <span>Tomorrow, 2:00 PM</span></div>
                 </div>
                 <div className="dropdown-item">
                   <AlertTriangle size={16} color="var(--status-critical)" /> <div className="dd-text">Sensor Offline (Zone 4) <span>Investigating...</span></div>
                 </div>
               </div>
             )}
           </div>
        </div>
      </div>

      <div className="header-right">
        <div className="search-bar">
          <Search size={16} color="var(--text-muted)" />
          <input type="text" placeholder="Search region or parameters..." />
          <Crosshair size={14} color="var(--text-muted)" style={{cursor: 'pointer'}} />
        </div>
        
        <button className="header-icon-btn" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="dropdown-container">
          <button className="header-icon-btn" onClick={() => toggleDropdown('notifications')}>
            <Bell size={20} />
          </button>
          {activeDropdown === 'notifications' && (
            <div className="dropdown-menu align-right">
              <div className="dropdown-header">Notifications (3 New)</div>
              <div className="dropdown-item unread">
                <div className="notify-dot"></div>
                <div className="dd-text">Action Engine Audit Completed <span>Just now</span></div>
              </div>
              <div className="dropdown-item unread">
                <div className="notify-dot"></div>
                <div className="dd-text">New UI features deployed <span>2m ago</span></div>
              </div>
              <div className="dropdown-item unread">
                <div className="notify-dot"></div>
                <div className="dd-text">Welcome to Heatlas <span>1d ago</span></div>
              </div>
            </div>
          )}
        </div>

        <div className="dropdown-container">
          <button className="header-icon-btn" onClick={() => toggleDropdown('profile')}>
            <User size={20} />
          </button>
          {activeDropdown === 'profile' && (
            <div className="dropdown-menu align-right profile-dropdown">
              <div className="profile-header">
                <div className="profile-avatar">DK</div>
                <div>
                  <div className="profile-name">Devill KK</div>
                  <div className="profile-email">devillkk@cosmicfoundry.com</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item">My Account</div>
              <div className="dropdown-item">Subscription Plan</div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item text-danger" onClick={handleLogout}>
                <LogOut size={16} /> Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
