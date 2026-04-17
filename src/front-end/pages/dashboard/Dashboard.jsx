import React from 'react';
import styles from './styles'; // The Pack'n styles we created
import { useAuth } from '../../context/AuthContext';


const Dashboard = ({ user }) => {
  const { can } = useAuth(user);

  // Hardcoded static data for now
  const staticStats = [
    { title: 'Total Revenue', value: 'RO 12,450', change: '+12.5%', icon: '💰' },
    { title: 'Active Projects', value: '84', change: '+5.2%', icon: '📦' },
    { title: 'Total Clients', value: '1,024', change: '+18%', icon: '👥' },
  ];

  // 1. Security Check: If user can't view dashboard, show nothing or a message
  if (!can('dashboard', 'view')) {
    return (
      <div style={styles.container}>
        <div style={styles.section}>
          <h2 style={{color: '#e11d48'}}>Access Denied</h2>
          <p>You do not have permission to view the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.sectionTitle}>Business Overview</h1>
      
      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {staticStats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statTop}>
              <span style={styles.statTitle}>{stat.title}</span>
              <span style={styles.statIcon}>{stat.icon}</span>
            </div>
            <div style={styles.statValue}>{stat.value}</div>
            <div style={{...styles.statChange, color: '#10b981'}}>
              {stat.change} <span style={{color: '#94a3b8', marginLeft: '5px'}}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Static Table Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Activity</h2>
        <div style={styles.tableWrapper}>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={{flex: 1}}>Description</div>
              <div style={{flex: 1}}>Date</div>
              <div style={{flex: 1}}>Status</div>
            </div>
            <div style={styles.tableRow}>
              <div style={styles.tableCell}>Bulk Packaging Order #102</div>
              <div style={styles.tableCell}>12 April 2026</div>
              <div style={styles.tableCell}>
                 <span style={styles.badge}>Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;