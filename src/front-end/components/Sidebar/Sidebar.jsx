import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import styles from './styles.js';

// 1. القائمة المحدثة لبيزنس Packn Oman
const navItems = [
  {
    label : 'User Management',
    items: [
      { name: 'Employees', icon: '👥', path: ROUTES.USERS || '/users' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Inventory Control', icon: '📦', path: ROUTES.DASHBOARD },
     { name: 'Production Lines', icon: '🏭', path: ROUTES?.PRODUCTION || '/production' },
    ],
  },
  {
    label: 'Sales & Logistics',
    items: [
      { name: 'B2B Clients', icon: '🤝', path: ROUTES.SETTINGS || '/settings' },
      { name: 'Fleet Tracker', icon: '🚚', path: ROUTES.LOGISTICS || '/logistics' },
      { name: 'Settings', icon: '⚙️', path: ROUTES.SETTINGS },
    ],
  },
];

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false); // 👈 added

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    console.log("الزرار اتداس! المسار هو:", path);
    if (path) {
      navigate(path);
      if (isMobile) setIsMobileOpen(false);
    } else {
      console.error("خطأ: المسار غير معرف (undefined)");
    }
  };

  const handleLogoutConfirm = () => { // 👈 added
    setShowLogoutDialog(false);
    logout();
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          style={{
            ...styles.mobileToggle,
            left: isMobileOpen ? '210px' : '15px',
            backgroundColor: isMobileOpen ? 'transparent' : '#3b82f6',
          }}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? '✕' : '☰'}
        </button>
      )}

      {isMobileOpen && (
        <div style={styles.overlay} onClick={() => setIsMobileOpen(false)} />
      )}

      <aside style={{
        ...styles.sidebar,
        transform: isMobile && !isMobileOpen ? 'translateX(-100%)' : 'translateX(0)',
        boxShadow: isMobileOpen ? '10px 0 20px rgba(0,0,0,0.3)' : 'none',
      }}>

        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>📦</div>
          <span style={styles.logoText}>PACKN OMAN</span>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          {navItems.map((section) => (
            <div key={section.label} style={styles.navSection}>
              <div style={styles.navLabel}>{section.label}</div>
              {section.items.map((item) => (
                <div
                  key={item.path}
                  style={{
                    ...styles.navItem,
                    ...(isActive(item.path) ? styles.navItemActive : {}),
                    ...(hoveredItem === item.path && !isActive(item.path)
                      ? styles.navItemHover
                      : {}),
                  }}
                  onClick={() => handleNavigate(item.path)}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span style={{
                    ...styles.navIcon,
                    color: isActive(item.path) ? '#fff' : '#94a3b8'
                  }}>{item.icon}</span>
                  <span style={styles.navText}>{item.name}</span>
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={styles.footer}>
          <button
            style={styles.logoutBtn}
            onClick={() => setShowLogoutDialog(true)} // 👈 changed
          >
            <span style={styles.navIcon}>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */} // 👈 added
      {showLogoutDialog && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: '#fff', borderRadius: '12px',
            padding: '28px 24px', width: '300px',
          }}>
            <div style={{ fontSize: '36px', textAlign: 'center', marginBottom: '12px' }}>🚪</div>
            <h2 style={{ margin: '0 0 8px', fontSize: '18px', textAlign: 'center' }}>
              Sign Out
            </h2>
            <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px', textAlign: 'center' }}>
              Are you sure you want to sign out?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowLogoutDialog(false)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  border: '1px solid #e2e8f0', background: '#f8fafc',
                  cursor: 'pointer', fontSize: '14px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  border: 'none', background: '#ef4444', color: '#fff',
                  cursor: 'pointer', fontSize: '14px', fontWeight: '500',
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;