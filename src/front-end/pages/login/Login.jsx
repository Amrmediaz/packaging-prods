import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginRequest } from '../../api/auth.api.js';
import { ROUTES } from '../../utils/constants';
import { validateLoginForm } from '../login/Login.utils.js'; 
import InputField from '../login/Components/InputField.js'; 

import styles from './styles.js';



function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // 1. Validate
    const errorMsg = validateLoginForm(formData.email, formData.password);
    if (errorMsg) return setStatus({ loading: false, error: errorMsg });

    // 2. Attempt Request
    setStatus({ loading: true, error: '' });
    try {
      const data = await loginRequest(formData.email, formData.password);

      login(data.user, data.token);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
  setStatus({ 
    loading: false, 
    error: err.response?.data?.message || 'Network error: Is the server running?' 
  });
}
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <p style={styles.subtitle}>Welcome back to Packin 👋</p>

        {status.error && <div style={styles.error} role="alert">{status.error}</div>}

        <form onSubmit={handleLogin}>
          <InputField 
            label="Email"
            name="email"
            type="email"
            placeholder="admin@packin.com"
            value={formData.email}
            onChange={handleChange}
            disabled={status.loading}
          />

          <InputField 
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={status.loading}
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: status.loading ? 0.7 : 1,
              cursor: status.loading ? 'not-allowed' : 'pointer',
            }}
            disabled={status.loading}
          >
            {status.loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;