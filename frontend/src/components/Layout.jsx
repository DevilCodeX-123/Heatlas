import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="layout-container">
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <div className="main-content">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
