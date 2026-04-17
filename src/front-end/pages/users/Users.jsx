import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getUsersRequest,
  createUserRequest,
  deleteUserRequest,
  updateUserRequest,
} from '../../api/users.api.js';
import { getRolesRequest } from '../../api/role.ap.js';
import styles from './styles.js';

// Expanded role colors to include your new Super Admin
const roleColors = {
  'Super Admin': { bg: '#4c1d95', color: '#ede9fe' },
  admin:         { bg: '#1e1b4b', color: '#a5b4fc' },
  manager:       { bg: '#0c4a6e', color: '#7dd3fc' },
  viewer:        { bg: '#064e3b', color: '#6ee7b7' },
};

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'viewer',
};

function Users() {
  // 1. Hook into AuthContext for dynamic permission checking
  const { can } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  // Permission shortcuts for cleaner JSX
  const canCreate = can('users', 'create');
  const canEdit   = can('users', 'edit');
  const canDelete = can('users', 'delete');

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersRequest();
      setUsers(data.users);
    } catch (err) {
      setError('Failed to load users. You might not have permission.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getRolesRequest();
      setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name || !form.email) {
      setFormError('Name and email are required');
      return;
    }

    setFormLoading(true);

    try {
      if (editingUser) {
        const updated = await updateUserRequest(editingUser._id, {
          name: form.name,
          email: form.email,
          role: form.role,
        });
        setUsers(users.map(u => u._id === editingUser._id ? updated.user : u));
      } else {
        const created = await createUserRequest(form);
        setUsers([...users, created.user]);
      }
      handleCloseModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUserRequest(id);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading users...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Users</h1>
        {/* DYNAMIC VIEW: Hide 'Add User' button if unauthorized */}
        {canCreate && (
          <button style={styles.addBtn} onClick={handleOpenAdd}>
            + Add User
          </button>
        )}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Table */}
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <div style={styles.tableCell}>Name</div>
          <div style={styles.tableCell}>Email</div>
          <div style={styles.tableCell}>Role</div>
          <div style={styles.tableCell}>Status</div>
          {/* DYNAMIC VIEW: Only show column header if user can do actions */}
          {(canEdit || canDelete) && <div style={styles.tableCell}>Actions</div>}
        </div>

        {users.length === 0 ? (
          <div style={styles.emptyState}>No users found.</div>
        ) : (
          users.map((user) => (
            <div key={user._id} style={styles.tableRow}>
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

              {/* DYNAMIC VIEW: Only show Action buttons user is allowed to use */}
              {(canEdit || canDelete) && (
                <div style={styles.tableCell}>
                  {canEdit && (
                    <button
                      style={{ ...styles.actionBtn, backgroundColor: '#1e3a5f', color: '#60a5fa' }}
                      onClick={() => handleOpenEdit(user)}
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      style={{ ...styles.actionBtn, backgroundColor: '#2d0a0a', color: '#f87171' }}
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal - only accessible if canCreate or canEdit is true */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>

            {formError && <div style={styles.error}>{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Name</label>
                <input style={styles.input} name="name" value={form.name} onChange={handleChange} />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input style={styles.input} name="email" type="email" value={form.email} onChange={handleChange} />
              </div>

              {!editingUser && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Password</label>
                  <input style={styles.input} name="password" type="password" value={form.password} onChange={handleChange} />
                </div>
              )}

              <div style={styles.inputGroup}>
                <label style={styles.label}>Role</label>
                <select style={styles.select} name="role" value={form.role} onChange={handleChange}>
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.name} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.modalButtons}>
                <button type="button" style={styles.cancelBtn} onClick={handleCloseModal}>Cancel</button>
                <button type="submit" style={styles.submitBtn} disabled={formLoading}>
                  {formLoading ? 'Saving...' : editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;