// import React, { useState } from 'react';
// import { createOrderRequest } from '../../api/';
// import styles from './styles.js'; // Assuming you have shared form styles

// // Standard product lines for Packn Oman catalog
// const packnProducts = [
//   'SOS Paper Bags (Small)',
//   'SOS Paper Bags (Medium)',
//   'Luxury Corrugated Gift Boxes',
//   'Heavy Duty Shipping Cartons',
//   'Biodegradable Takeaway Trays'
// ];

// function CreateOrder({ onClose, onOrderCreated }) {
//   // Initialize form state
//   const [form, setForm] = useState({
//     client: '',
//     product: packnProducts[0],
//     quantity: '',
//     notes: ''
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     // Basic validation
//     if (!form.client || !form.quantity) {
//       setError('Client Name and Quantity are required.');
//       return;
//     }

//     setLoading(true);

//     try {
//       // 1. Backend Guard check (API Call)
//       // The Backend Middleware will check `orders.create: true` here
//       const createdOrder = await createOrderRequest(form);
      
//       // 2. Success Logic
//       onOrderCreated(createdOrder.order); // Update main table
//       onClose(); // Hide form
//     } catch (err) {
//       // 3. Error Logic: Display server error (e.g., 403 Forbidden)
//       setError(err.response?.data?.message || 'Failed to create order. Check permissions.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.modal}>
//         <h2 style={styles.modalTitle}>New Custom Order</h2>
//         <p style={styles.modalSubtitle}>Configure job specs for Packn Oman production floor.</p>

//         {error && <div style={styles.error}>{error}</div>}

//         <form onSubmit={handleSubmit}>
//           {/* Client Input */}
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Client Name</label>
//             <input
//               style={styles.input}
//               name="client"
//               placeholder="e.g., Muscat Coffee Roasters"
//               value={form.client}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Product Dropdown (Catalog) */}
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Product Specification</label>
//             <select style={styles.select} name="product" value={form.product} onChange={handleChange}>
//               {packnProducts.map(p => <option key={p} value={p}>{p}</option>)}
//             </select>
//           </div>

//           {/* Quantity */}
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Quantity (OMR)</label>
//             <input
//               style={styles.input}
//               name="quantity"
//               type="number"
//               placeholder="e.g., 10000"
//               value={form.quantity}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Actions */}
//           <div style={styles.modalButtons}>
//             <button type="button" style={styles.cancelBtn} onClick={onClose}>
//               Cancel
//             </button>
//             <button
//               type="submit"
//               style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
//               disabled={loading}
//             >
//               {loading ? 'Creating Job...' : '+ Create Job'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default CreateOrder;