import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './styles.js';

// Map routes to page titles
const pageTitles = {
  '/dashboard': 'Dashboard',
  '/users': 'Users',
  '/orders': 'Orders',
  '/roles-permissions': 'Roles & Permissions',
};

function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const [search, setSearch] = useState('');

  // Get first letter of name for avatar
  const avatarLetter = user?.name?.charAt(0).toUpperCase() || 'A';

  // Get current page title
  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header style={styles.header}>

      {/* Left: Page Title */}
      <div style={styles.left}>
        <h1 style={styles.pageTitle}>{pageTitle}</h1>
      </div>

      {/* Right: Search + Notifications + User */}
      <div style={styles.right}>

        {/* Search Box */}
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Notifications */}
        <div style={styles.notifBtn}>
          🔔
        </div>

        {/* User Info */}
        <div style={styles.userBox}>
          <div style={styles.avatar}>
            {avatarLetter}
          </div>
          <div>
            <div style={styles.userName}>{user?.name || 'Admin'}</div>
            <div style={styles.userRole}>Administrator</div>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;