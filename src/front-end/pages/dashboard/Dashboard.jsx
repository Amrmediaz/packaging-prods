import React from 'react';
import styles from './styles'; 
import { useAuth } from '../../context/AuthContext';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const Dashboard = ({ user }) => {
  const { can } = useAuth(user);

  // Static Data for Charts
  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 8500 },
  ];

  const projectData = [
    { name: 'Boxes', count: 45 },
    { name: 'Labels', count: 30 },
    { name: 'Tape', count: 15 },
    { name: 'Bags', count: 25 },
  ];

  const staticStats = [
    { title: 'Total Revenue', value: 'RO 12,450', change: '+12.5%', icon: '💰' },
    { title: 'Active Projects', value: '84', change: '+5.2%', icon: '📦' },
    { title: 'Total Clients', value: '1,024', change: '+18%', icon: '👥' },
  ];

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

      {/* CHARTS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        
        {/* Revenue Line Chart */}
        <div style={{ ...styles.section, height: '350px', padding: '20px' }}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Revenue Growth (OMR)</h3>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eb5224" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#eb5224" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
                itemStyle={{ color: '#eb5224' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#eb5224" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Project Bar Chart */}
        <div style={{ ...styles.section, height: '350px', padding: '20px' }}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Product Categories</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: '#1f2937'}}
                contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Table Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Activity</h2>
        {/* ... existing table code ... */}
      </div>
    </div>
  );
};

export default Dashboard;