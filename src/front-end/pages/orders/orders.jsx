import React from 'react';
import styles from './styles.js';
import { useAuth } from '../../context/AuthContext';

// Mock data representing actual Packn Oman product lines
const activeOrders = [
  { 
    id: 'PKN-1001', 
    client: 'Muscat Coffee Roasters', 
    product: 'SOS Paper Bags (Medium)', 
    quantity: '15,000 pcs', 
    status: 'Printing', 
    progress: 65,
    delivery: '18 Apr' 
  },
  { 
    id: 'PKN-1002', 
    client: 'Omani Delights', 
    product: 'Corrugated Gift Boxes', 
    quantity: '1,200 pcs', 
    status: 'Die-Cutting', 
    progress: 30,
    delivery: '20 Apr' 
  },
  { 
    id: 'PKN-1003', 
    client: 'Sohar Logistics', 
    product: 'Custom Shipping Cartons', 
    quantity: '5,000 pcs', 
    status: 'Packing', 
    progress: 95,
    delivery: 'Today' 
  },
];

const orderSummary = [
  { label: 'Pending Orders', value: '24', icon: '📥' },
  { label: 'In Production', value: '08', icon: '🏭' },
  { label: 'Ready for Pickup', value: '12', icon: '✅' },
  { label: 'Total Revenue', value: 'OMR 4.2k', icon: '💰' },
];

function Orders() {
  const { can } = useAuth();

  // Guard: If user can't even view orders, don't show the page
  if (!can('orders', 'view')) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
        <h2 style={{ color: '#fff' }}>Access Restricted</h2>
        <p>You do not have the necessary permissions to view the Orders dashboard.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 5px 0', color: '#fff' }}>Orders Dashboard</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Manage and track all customer packaging orders</p>
        </div>
        
        {/* Permission Check for Creating Orders */}
        {can('orders', 'create') && (
          <button style={{
            background: '#3b82f6', color: '#fff', border: 'none',
            padding: '12px 24px', borderRadius: '10px', fontWeight: '700',
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            + Create New Order
          </button>
        )}
      </header>

      {/* Summary Cards */}
      <div style={styles.statsGrid}>
        {orderSummary.map((stat, i) => (
          <div key={i} style={styles.statCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>{stat.icon}</span>
              <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Order Table */}
      <div style={styles.section}>
        <h2 style={{ ...styles.sectionTitle, fontSize: '18px', marginBottom: '20px' }}>Active Production Queue</h2>
        <div style={styles.tableWrapper}>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={{...styles.tableCell, flex: 0.7}}>ID</div>
              <div style={styles.tableCell}>Client</div>
              <div style={styles.tableCell}>Product & Specs</div>
              <div style={styles.tableCell}>Status</div>
              <div style={styles.tableCell}>Progress</div>
            </div>

            {activeOrders.map((order) => (
              <div key={order.id} style={styles.tableRow}>
                <div style={{...styles.tableCell, flex: 0.7, color: '#475569', fontSize: '12px'}}>{order.id}</div>
                <div style={styles.tableCell}>
                  <div style={{ color: '#fff', fontWeight: '700' }}>{order.client}</div>
                </div>
                <div style={styles.tableCell}>
                  <div style={{ fontSize: '13px' }}>{order.product}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Quantity: {order.quantity}</div>
                </div>
                <div style={styles.tableCell}>
                  <span style={{ 
                    padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800',
                    background: order.status === 'Packing' ? '#064e3b' : '#1e293b',
                    color: order.status === 'Packing' ? '#4ade80' : '#94a3b8',
                    textTransform: 'uppercase'
                  }}>
                    {order.status}
                  </span>
                </div>
                <div style={styles.tableCell}>
                  <div style={{ 
                    width: '100%', backgroundColor: '#1e293b', 
                    borderRadius: '10px', height: '6px', marginBottom: '6px' 
                  }}>
                    <div style={{ 
                      width: `${order.progress}%`, 
                      backgroundColor: order.progress > 90 ? '#10b981' : '#3b82f6', 
                      height: '100%', borderRadius: '10px', transition: 'width 0.8s ease-in-out' 
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ color: '#94a3b8' }}>{order.progress}%</span>
                    <span style={{ color: order.delivery === 'Today' ? '#f87171' : '#64748b', fontWeight: '600' }}>
                      Due: {order.delivery}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;





// import React, { useState, useEffect } from 'react';
// import styles from './styles.js';
// import { useAuth } from '../../context/AuthContext';
// import { getOrdersRequest } from '../../api/orders.api'; // You'll need this function

// function Orders() {
//   const { can } = useAuth();
  
//   // State Management
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [error, setError] = useState(null);

//   // 1. Fetch Orders from API on component mount
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         // This calls your backend via the authorize('orders', 'view') middleware
//         const response = await getOrdersRequest(); 
//         setOrders(response.orders || []);
//       } catch (err) {
//         console.error("Failed to load orders:", err);
//         setError("Could not load production data. Please check your connection.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (can('orders', 'view')) {
//       fetchOrders();
//     }
//   }, [can]);

//   // 2. Summary Logic (Derived from actual live data)
//   const stats = [
//     { label: 'Pending Orders', value: orders.filter(o => o.status === 'Queue').length, icon: '📥' },
//     { label: 'In Production', value: orders.filter(o => ['Printing', 'Die-Cutting', 'Folding'].includes(o.status)).length, icon: '🏭' },
//     { label: 'Ready/Delivered', value: orders.filter(o => ['Ready', 'Delivered'].includes(o.status)).length, icon: '✅' },
//     { label: 'Live Jobs', value: orders.length, icon: '📊' },
//   ];

//   // Guard: Permission Check
//   if (!can('orders', 'view')) {
//     return (
//       <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
//         <h2 style={{ color: '#fff' }}>Access Restricted</h2>
//         <p>You do not have the necessary permissions to view the Orders dashboard.</p>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
//         <div>
//           <h1 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 5px 0', color: '#fff' }}>Orders Dashboard</h1>
//           <p style={{ color: '#64748b', margin: 0 }}>Packn Oman Factory Live Production Queue</p>
//         </div>
        
//         {can('orders', 'create') && (
//           <button 
//             onClick={() => setShowModal(true)}
//             style={{
//               background: '#3b82f6', color: '#fff', border: 'none',
//               padding: '12px 24px', borderRadius: '10px', fontWeight: '700',
//               cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
//             }}
//           >
//             + Create New Order
//           </button>
//         )}
//       </header>

//       {/* Summary Cards */}
//       <div style={styles.statsGrid}>
//         {stats.map((stat, i) => (
//           <div key={i} style={styles.statCard}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
//               <span style={{ fontSize: '20px' }}>{stat.icon}</span>
//               <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>{stat.label}</span>
//             </div>
//             <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>{stat.value}</div>
//           </div>
//         ))}
//       </div>

//       {/* Main Order Table */}
//       <div style={styles.section}>
//         <h2 style={{ ...styles.sectionTitle, fontSize: '18px', marginBottom: '20px' }}>Active Production Queue</h2>
        
//         {loading ? (
//           <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading production data...</div>
//         ) : error ? (
//           <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>
//         ) : (
//           <div style={styles.tableWrapper}>
//             <div style={styles.table}>
//               <div style={styles.tableHeader}>
//                 <div style={{...styles.tableCell, flex: 0.7}}>Order ID</div>
//                 <div style={styles.tableCell}>Client</div>
//                 <div style={styles.tableCell}>Product & Quantity</div>
//                 <div style={styles.tableCell}>Status</div>
//                 <div style={styles.tableCell}>Progress</div>
//               </div>

//               {orders.length === 0 ? (
//                 <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No active orders found.</div>
//               ) : (
//                 orders.map((order) => (
//                   <div key={order.id} style={styles.tableRow}>
//                     <div style={{...styles.tableCell, flex: 0.7, color: '#475569', fontSize: '12px'}}>{order.orderId}</div>
//                     <div style={styles.tableCell}>
//                       <div style={{ color: '#fff', fontWeight: '700' }}>{order.client}</div>
//                     </div>
//                     <div style={styles.tableCell}>
//                       <div style={{ fontSize: '13px' }}>{order.product}</div>
//                       <div style={{ fontSize: '11px', color: '#64748b' }}>Qty: {order.quantity.toLocaleString()}</div>
//                     </div>
//                     <div style={styles.tableCell}>
//                       <span style={{ 
//                         padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800',
//                         background: order.status === 'Ready' || order.status === 'Packing' ? '#064e3b' : '#1e293b',
//                         color: order.status === 'Ready' || order.status === 'Packing' ? '#4ade80' : '#94a3b8',
//                         textTransform: 'uppercase'
//                       }}>
//                         {order.status}
//                       </span>
//                     </div>
//                     <div style={styles.tableCell}>
//                       <div style={{ 
//                         width: '100%', backgroundColor: '#1e293b', 
//                         borderRadius: '10px', height: '6px', marginBottom: '6px' 
//                       }}>
//                         <div style={{ 
//                           width: `${order.progress}%`, 
//                           backgroundColor: order.progress > 90 ? '#10b981' : '#3b82f6', 
//                           height: '100%', borderRadius: '10px', transition: 'width 0.8s ease' 
//                         }} />
//                       </div>
//                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
//                         <span style={{ color: '#94a3b8' }}>{order.progress}%</span>
//                         <span style={{ color: '#64748b' }}>
//                           Due: {new Date(order.dueDate).toLocaleDateString('en-GB')}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal for Creating New Orders */}
     
//     </div>
//   );
// }

// export default Orders;