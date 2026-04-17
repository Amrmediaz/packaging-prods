import React, { useState } from 'react';
import { createUserRequest, updateUserRequest } from '../../api/users.api.js';
import styles from '../../pages/users/styles.js';
import { roleColors } from '../../pages/users/Users.jsx'; // if in separate file

const emptyForm = { name: '', email: '', password: '', role: 'viewer' };

function UserModal({ editingUser, roles, onClose, onSaved }) {
  const [form, setForm] = useState(
    editingUser
      ? { name: editingUser.name, email: editingUser.email,
          password: '', role: editingUser.role }
      : emptyForm
  );
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError('Name and email are required.'); return;
    }
    setLoading(true); setError('');
    try {
      if (editingUser) {
        await updateUserRequest(editingUser._id,
          { name: form.name, email: form.email, role: form.role });
      } else {
        await createUserRequest(form);
      }
      await onSaved(); // re-fetch from parent
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>
          {editingUser ? 'Edit User' : 'Add New User'}
        </h2>
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input style={styles.input} name="name"
              value={form.name} onChange={handleChange} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} name="email"
              type="email" value={form.email} onChange={handleChange} />
          </div>
          {!editingUser && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} name="password"
                type="password" value={form.password} onChange={handleChange} />
            </div>
          )}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <select style={styles.select} name="role"
              value={form.role} onChange={handleChange}>
              <option value="">Select a role</option>
              {roles.map(r => (
                <option key={r._id ?? r.name} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>
          <div style={styles.modalButtons}>
            <button type="button" style={styles.cancelBtn}
              onClick={onClose}>Cancel</button>
            <button type="submit" style={styles.submitBtn}
              disabled={loading}>
              {loading ? 'Saving...' : editingUser ? 'Update' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



function UserRow({ user, canEdit, canDelete, onEdit, onDelete }) {
  return (
    <div style={styles.tableRow}>
      <div style={styles.tableCellBold}>{user.name}</div>
      <div style={styles.tableCell}>{user.email}</div>

      <div style={styles.tableCell}>
        <span style={{
          ...styles.badge,
          backgroundColor: roleColors[user.role]?.bg || '#1e293b',
          color: roleColors[user.role]?.color || '#94a3b8',
        }}>
          {user.role}
        </span>
      </div>

      <div style={styles.tableCell}>
        <span style={{
          ...styles.badge,
          backgroundColor: user.isActive ? '#052e16' : '#450a0a',
          color: user.isActive ? '#4ade80' : '#f87171',
        }}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {(canEdit || canDelete) && (
        <div style={styles.tableCell}>
          {canEdit && (
            <button
              style={{ ...styles.actionBtn, backgroundColor: '#1e3a5f', color: '#60a5fa' }}
              onClick={onEdit}
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button
              style={{ ...styles.actionBtn, backgroundColor: '#2d0a0a', color: '#f87171' }}
              onClick={onDelete}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
export default UserModal;