import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import styles from './styles.js';

function Sidebar() {
  const { logout, can } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // 1. Move navItems inside useMemo to filter based on permissions
  const filteredNavItems = useMemo(() => {
    const rawItems = [
      {
        label: 'User Management',
        items: [
        can('users', 'view') && { name: 'Employees', icon: '👥', path: ROUTES.USERS || '/users' },
          // Only add this item if the user 'can' access it
          can('users', 'roles') && { 
            name: 'Roles & Permissions', 
            icon: '🛡️', 
            path: ROUTES.RolesPermissions || '/roles-permissions' 
          },
        ].filter(Boolean), // This removes the 'false' entries
      },
      {
        label: 'Operations',
        items: [
        can('dashboard', 'view') && { name: 'Dashboard', icon: '📊', path: ROUTES.DASHBOARD },
       can('orders', 'view') && { name: 'Orders', icon: '🛒', path: ROUTES?.Orders || '/orders' },
        ].filter(Boolean),
      },
      // {
      //   label: 'Sales & Logistics',
      //   items: [
      //     { name: 'B2B Clients', icon: '🤝', path: ROUTES.SETTINGS || '/settings' },
      //     { name: 'Orders', icon: '🚚', path: ROUTES.Orders || '/orders' },
      //     { name: 'Settings', icon: '⚙️', path: ROUTES.SETTINGS },
      //   ].filter(Boolean),
      // },
    ];

    // Filter out entire sections if they have no visible items
    return rawItems.filter(section => section.items.length > 0);
  }, [can]); 

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
    if (path) {
      navigate(path);
      if (isMobile) setIsMobileOpen(false);
    }
  };

  const handleLogoutConfirm = () => {
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

        <div style={styles.logo}>
          <div style={styles.logoIcon}>📦</div>
          <span style={styles.logoText}>PACKN OMAN</span>
        </div>

        <nav style={styles.nav}>
          {filteredNavItems.map((section) => (
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

        <div style={styles.footer}>
          <button
            style={styles.logoutBtn}
            onClick={() => setShowLogoutDialog(true)}
          >
            <span style={styles.navIcon}>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Logout Dialog */}
      {showLogoutDialog && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px',
            padding: '32px', width: '320px', textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🚪</div>
            <h2 style={{ margin: '0 0 8px', fontSize: '20px', color: '#1e293b' }}>Sign Out</h2>
            <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px' }}>
              Are you sure you want to exit?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowLogoutDialog(false)}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  border: '1px solid #e2e8f0', background: '#fff',
                  cursor: 'pointer', fontWeight: '600', color: '#64748b'
                }}
              >Cancel</button>
              <button
                onClick={handleLogoutConfirm}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  border: 'none', background: '#ef4444', color: '#fff',
                  cursor: 'pointer', fontWeight: '600'
                }}
              >Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;