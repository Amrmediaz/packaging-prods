import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import styles from './styles.js';

function AdminLayout({ children }) {
  return (
    <div style={styles.layout}>

      {/* Sidebar - fixed on the left */}
      <Sidebar />

      {/* Main content area */}
      <div style={styles.main}>

        {/* Header - fixed on the top */}
        <Header />

        {/* Page content goes here */}
        {children}

      </div>
    </div>
  );
}

export default AdminLayout;