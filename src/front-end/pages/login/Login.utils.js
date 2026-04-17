// src/front-end/pages/login/login.utils.js

export const validateLoginForm = (email, password) => {
  if (!email || !password) return 'Please fill in all fields';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  
  if (password.length < 6) return 'Password must be at least 6 characters';
  
  return null; // No errors
};