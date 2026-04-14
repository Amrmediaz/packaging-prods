import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();

  // If already logged in → go to dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} />;
  }

  // If not logged in → show the page (Login)
  return children;
}

export default PublicRoute;