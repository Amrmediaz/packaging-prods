import React, { useState, useEffect } from 'react';
import styles from './styles.js';
import { useAuth } from '../../context/AuthContext';
import { getOrdersRequest } from '../../api/orders.api.js';

function Orders() {
  const { can } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, production: 0, completed: 0, total: 0 });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Since your API helper already returns response.data, 
      // 'result' here is likely the array itself or the data object.
      const result = await getOrdersRequest();
      
      console.log("Full API Response Payload:", result);

      // Defensive check: handle both direct arrays and { orders: [] } structures
      const data = Array.isArray(result) ? result : (result?.data || result?.orders || []);
      
      setOrders(data);
      
      // Calculate dynamic stats for the summary cards
      setStats({
        pending: data.filter(o => ['Pending', 'Queue'].includes(o.status)).length,
        production: data.filter(o => ['Printing', 'Die-Cutting', 'Folding'].includes(o.status)).length,
        completed: data.filter(o => ['Ready', 'Delivered'].includes(o.status)).length,
        total: data.length
      });
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!can('orders', 'view')) {
    return (
      <div style={{ padding: '80px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff' }}>Access Denied</h2>
        <p style={{ color: '#64748b' }}>Contact your administrator for order viewing permissions.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', margin: 0 }}>
            Orders <span style={{ color: '#eb5224' }}>Flow</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Production tracking & logistics for Pack’n Oman
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchOrders} style={btnStyle('#1e293b')}>Refresh Data</button>
          {can('orders', 'create') && (
            <button style={btnStyle('#eb5224')}>+ New Order</button>
          )}
        </div>
      </header>

      {/* STATS SUMMARY */}
      <div style={styles.statsGrid}>
        <StatCard label="In Queue" value={stats.pending} color="#eb5224" icon="📥" />
        <StatCard label="On Factory Floor" value={stats.production} color="#3b82f6" icon="🏭" />
        <StatCard label="Completed" value={stats.completed} color="#10b981" icon="✅" />
        <StatCard label="Total Volume" value={stats.total} color="#8b5cf6" icon="📊" />
      </div>

      {/* ORDERS TABLE */}
      <div style={{ ...styles.section, background: '#111827', borderRadius: '16px', border: '1px solid #1f2937' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #1f2937' }}>
          <h3 style={{ color: '#fff', margin: 0, fontSize: '18px' }}>Active Production Queue</h3>
        </div>

        <div style={styles.tableWrapper}>
          <div style={styles.table}>
            <div style={{ ...styles.tableHeader, background: '#1f2937', padding: '16px 24px' }}>
              <div style={{ ...styles.tableCell, flex: 0.8, color: '#94a3b8', fontSize: '11px', fontWeight: '800' }}>ORDER ID</div>
              <div style={{ ...styles.tableCell, color: '#94a3b8', fontSize: '11px', fontWeight: '800' }}>CLIENT</div>
              <div style={{ ...styles.tableCell, color: '#94a3b8', fontSize: '11px', fontWeight: '800' }}>PRODUCT</div>
              <div style={{ ...styles.tableCell, color: '#94a3b8', fontSize: '11px', fontWeight: '800' }}>STATUS</div>
              <div style={{ ...styles.tableCell, color: '#94a3b8', fontSize: '11px', fontWeight: '800' }}>DEADLINE</div>
            </div>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#eb5224' }}>Loading live orders...</div>
            ) : orders.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No orders found in database.</div>
            ) : (
              orders.map((order) => (
                <div key={order._id || order.id} style={{ ...styles.tableRow, padding: '20px 24px', borderBottom: '1px solid #1f2937' }}>
                  <div style={{ ...styles.tableCell, flex: 0.8 }}>
                    <span style={{ color: '#eb5224', fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {order.orderId || 'N/A'}
                    </span>
                  </div>
                  <div style={styles.tableCell}>
                    <div style={{ color: '#fff', fontWeight: '700' }}>{order.name  || 'Unknown'}</div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>{order.phone || 'No Phone'}</div>
                  </div>
                  <div style={styles.tableCell}>
                    <div style={{ color: '#e5e7eb', fontSize: '13px' }}>{order.product || order.service_type}</div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>Qty: {order.quantity?.toLocaleString() || 0}</div>
                  </div>
                  <div style={styles.tableCell}>
                    <StatusBadge status={order.status} />
                  </div>
                  <div style={styles.tableCell}>
                    <div style={{ color: '#fff', fontWeight: '600' }}>
                      {order.dueDate ? new Date(order.dueDate).toLocaleDateString('en-OM', { day: '2-digit', month: 'short' }) : 'TBD'}
                    </div>
                    <ProgressBar progress={order.progress} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* SUB-COMPONENTS */

const StatCard = ({ label, value, color, icon }) => (
  <div style={{ ...styles.statCard, borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '800' }}>{label}</span>
      <span>{icon}</span>
    </div>
    <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff', marginTop: '8px' }}>{value}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    'Pending': { bg: '#2d1a15', text: '#eb5224' },
    'Queue': { bg: '#2d1a15', text: '#eb5224' },
    'Ready': { bg: '#064e3b', text: '#10b981' },
    'Delivered': { bg: '#064e3b', text: '#10b981' },
    'default': { bg: '#1e293b', text: '#94a3b8' }
  };
  const theme = colors[status] || colors.default;
  return (
    <span style={{
      padding: '6px 14px', borderRadius: '20px', fontSize: '10px', fontWeight: '800',
      background: theme.bg, color: theme.text, textTransform: 'uppercase'
    }}>
      ● {status || 'Unknown'}
    </span>
  );
};

const ProgressBar = ({ progress = 0 }) => (
  <div style={{ width: '80px', height: '4px', background: '#1f2937', borderRadius: '2px', marginTop: '6px' }}>
    <div style={{ width: `${progress}%`, background: '#eb5224', height: '100%', borderRadius: '2px' }} />
  </div>
);

const btnStyle = (bg) => ({
  background: bg, color: '#fff', border: 'none', padding: '10px 20px',
  borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: '0.2s'
});

export default Orders;
