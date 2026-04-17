import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AdminLayout from '../layouts/AdminLayout';
import { ROUTES } from '../utils/constants';
import RolesPermissions from '../pages/roles&permissions/RolesPermissions';

// Lazy loading pages
const Login = lazy(() => import('../pages/login/Login'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Orders = lazy(() => import('../pages/orders/orders'));
const Users = lazy(() => import('../pages/users/Users'));

// مكون التحميل البسيط
function PageLoader() {
  return (
    <div style={styles.loader}>
      <div style={styles.spinner} />
      <p style={{ color: '#fff', marginTop: '10px' }}>Loading Packn Oman...</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* 1. Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 2. صفحة تسجيل الدخول */}
            <Route
              path={ROUTES.LOGIN}
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* 3. مسار الداشبورد */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

             <Route
              path={ROUTES.RolesPermissions}
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <RolesPermissions />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

         
 <Route
              path={ROUTES.Orders}
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Orders />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            {/* 5. مسار المستخدمين */}
            <Route
              path={ROUTES.USERS}
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Users />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* 6. صفحة اختبار */}
            <Route
              path="/test"
              element={<div style={{ color: 'white', padding: '50px' }}>Test Route is Working!</div>}
            />

            {/* 7. التعامل مع أي مسار غير معروف */}
            <Route
              path="*"
              element={
                <div style={styles.errorPage}>
                  <h1 style={{ color: '#fff' }}>404 - Page Not Found</h1>
                  <p style={{ color: '#94a3b8' }}>المسار الذي تحاول الوصول إليه غير موجود.</p>
                  <button
                    onClick={() => window.location.href = ROUTES.DASHBOARD}
                    style={styles.backBtn}
                  >
                    العودة للرئيسية
                  </button>
                </div>
              }
            />

          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

const styles = {
  loader: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #334155',
    borderTop: '3px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  errorPage: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    textAlign: 'center'
  },
  backBtn: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

// إضافة الـ CSS للـ Spinner
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(styleSheet);
}

export default AppRoutes;