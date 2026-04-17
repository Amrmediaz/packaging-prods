// src/front-end/pages/roles/RoleComponents.jsx
import React from 'react';
import { T } from '../styles.js'; 

export const ConfirmDeleteModal = ({ role, onCancel, onConfirm, loading }) => (
  <div style={modalOverlayStyle} onClick={onCancel}>
    <div style={confirmCardStyle} onClick={e => e.stopPropagation()}>
      <h3>Delete "{role?.name}"?</h3>
      <p>This action is permanent and cannot be undone.</p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onCancel} style={secondaryBtn}>Cancel</button>
        <button onClick={onConfirm} disabled={loading} style={dangerBtn}>
          {loading ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  </div>
);

// Add your Modal styles here or import from styles.js
const modalOverlayStyle = { position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 };
const confirmCardStyle = { background: T.card, padding: '30px', borderRadius: '15px', border: `1px solid ${T.danger}40`, maxWidth: '400px' };
const secondaryBtn = { flex: 1, padding: '10px', cursor: 'pointer', background: T.cardHi, color: T.textSub, border: `1px solid ${T.border}` };
const dangerBtn = { flex: 1, padding: '10px', cursor: 'pointer', background: T.danger, color: '#fff', border: 'none' };