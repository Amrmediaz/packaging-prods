import React, { useState, useEffect } from 'react';
import {
  getUsersRequest,
  createUserRequest,
  deleteUserRequest,
  updateUserRequest,
} from '../../api/users.api';
import styles from './styles.js';

const roleColors = {
  admin:   { bg: '#1e1b4b', color: '#a5b4fc' },
  manager: { bg: '#0c4a6e', color: '#7dd3fc' },
  viewer:  { bg: '#064e3b', color: '#6ee7b7' },
};

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'viewer',
};

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Fetch users on page load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersRequest();
      setUsers(data.users);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
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

    // Validate
    if (!form.name || !form.email) {
      setFormError('Name and email are required');
      return;
    }
    if (!editingUser && !form.password) {
      setFormError('Password is required');
      return;
    }
    if (!editingUser && form.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    setFormLoading(true);

    try {
      if (editingUser) {
        // Update
        const updated = await updateUserRequest(editingUser._id, {
          name: form.name,
          email: form.email,
          role: form.role,
        });
        setUsers(users.map(u =>
          u._id === editingUser._id ? updated.user : u
        ));
      } else {
        // Create
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
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
        Loading users...
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Users</h1>
        <button style={styles.addBtn} onClick={handleOpenAdd}>
          + Add User
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Table */}
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <div style={styles.tableCell}>Name</div>
          <div style={styles.tableCell}>Email</div>
          <div style={styles.tableCell}>Role</div>
          <div style={styles.tableCell}>Status</div>
          <div style={styles.tableCell}>Actions</div>
        </div>

        {users.length === 0 ? (
          <div style={styles.emptyState}>
            No users found. Add your first user!
          </div>
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
              <div style={styles.tableCell}>
                <button
                  style={{
                    ...styles.actionBtn,
                    backgroundColor: '#1e3a5f',
                    color: '#60a5fa',
                  }}
                  onClick={() => handleOpenEdit(user)}
                >
                  Edit
                </button>
                <button
                  style={{
                    ...styles.actionBtn,
                    backgroundColor: '#2d0a0a',
                    color: '#f87171',
                  }}
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>

            {formError && (
              <div style={styles.error}>{formError}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Name</label>
                <input
                  style={styles.input}
                  name="name"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              {!editingUser && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    style={styles.input}
                    name="password"
                    type="password"
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div style={styles.inputGroup}>
                <label style={styles.label}>Role</label>
                <select
                  style={styles.select}
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="viewer">Viewer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={styles.modalButtons}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.submitBtn,
                    opacity: formLoading ? 0.7 : 1,
                    cursor: formLoading ? 'not-allowed' : 'pointer',
                  }}
                  disabled={formLoading}
                >
                  {formLoading
                    ? 'Saving...'
                    : editingUser ? 'Update User' : 'Add User'
                  }
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