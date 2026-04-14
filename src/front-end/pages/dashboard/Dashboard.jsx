import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import styles from './styles.js';

// Specific Packn Metrics
const stats = [
  { title: 'Total Inventory', value: '84,200', icon: '📦', change: '+12% Units', up: true },
  { title: 'Processing Orders', value: '1,452', icon: '⚙️', change: '+8%', up: true },
  { title: 'Out of Stock', value: '12 SKUs', icon: '⚠️', change: '-5%', up: false },
  { title: 'Deliveries In Transit', value: '45', icon: '🚚', change: 'Oman-wide', up: true },
];

const productionData = [
  { name: 'Paper', output: 4000, demand: 2400 },
  { name: 'Plastic', output: 3000, demand: 1398 },
  { name: 'Custom', output: 5000, demand: 9800 },
  { name: 'Biodeg.', output: 2780, demand: 3908 },
  { name: 'Industrial', output: 1890, demand: 4800 },
];

const recentActivity = [
  { id: 101, client: 'Muscat Catering', action: 'Bulk Carton Order', time: '5 min ago', status: 'shipped' },
  { id: 102, client: 'Nizwa Logistics', action: 'Custom Print Approval', time: '1 hr ago', status: 'pending' },
  { id: 103, client: 'Salalah Retail', action: 'Inventory Restock', time: '3 hr ago', status: 'delivered' },
  { id: 104, client: 'Sohar Factory', action: 'Raw Material Delivery', time: '5 hr ago', status: 'processing' },
];

const statusColors = {
  shipped: { bg: '#0c4a6e', color: '#7dd3fc' },
  pending: { bg: '#451a03', color: '#fdba74' },
  delivered: { bg: '#064e3b', color: '#6ee7b7' },
  processing: { bg: '#1e1b4b', color: '#a5b4fc' },
};

function Dashboard() {
  return (
    <div style={styles.container}>
      
      {/* 1. Packn Inventory Overview */}
      <div style={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.title} style={styles.statCard}>
            <div style={styles.statTop}>
              <div>
                <div style={styles.statTitle}>{stat.title}</div>
                <div style={styles.statValue}>{stat.value}</div>
              </div>
              <div style={styles.statIcon}>{stat.icon}</div>
            </div>
            <div style={{ ...styles.statChange, color: stat.up ? '#4ade80' : '#f87171' }}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Production & Demand Charts */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Production Output (Units)</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productionData}>
                <defs>
                  <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Area type="monotone" dataKey="output" stroke="#3b82f6" fill="url(#colorOutput)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Market Demand vs Stock</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip cursor={{fill: '#334155'}} contentStyle={{ backgroundColor: '#1e293b' }} />
                <Bar dataKey="demand" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Logistics & Client Activity */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent B2B Orders</h2>
        <div style={styles.tableWrapper}>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={{...styles.tableCell, flex: 0.5}}>ID</div>
              <div style={styles.tableCell}>Client</div>
              <div style={styles.tableCell}>Product / Action</div>
              <div style={styles.tableCell}>Time</div>
              <div style={styles.tableCell}>Logistics Status</div>
            </div>

            {recentActivity.map((item) => (
              <div key={item.id} style={styles.tableRow}>
                <div style={{...styles.tableCell, flex: 0.5}}>{item.id}</div>
                <div style={styles.tableCell}><strong>{item.client}</strong></div>
                <div style={styles.tableCell}>{item.action}</div>
                <div style={styles.tableCell}>{item.time}</div>
                <div style={styles.tableCell}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: statusColors[item.status].bg,
                    color: statusColors[item.status].color,
                  }}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;