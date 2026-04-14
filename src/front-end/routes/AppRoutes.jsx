import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AdminLayout from '../layouts/AdminLayout';
import { ROUTES } from '../utils/constants';

// Lazy loading pages
const Login = lazy(() => import('../pages/login/Login'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const ProductionLines = lazy(() => import('../pages/production_lines/Production_Lines'));
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
            
            {/* 1. صفحة تسجيل الدخول */}
            <Route
              path={ROUTES.LOGIN || '/'}
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* 2. مسار الداشبورد */}
            <Route
              path={ROUTES.DASHBOARD }
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* 3. مسار خطوط الإنتاج - مكتوب يدوياً للتأكد من الربط */}
            <Route
              path={ROUTES.PRODUCTION || '/production'}
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ProductionLines />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
            path={ROUTES.USERS || '/users'}
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Users />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* 4. صفحة اختبار (لو ظهرت لك يعني المسار شغال بس الصفحة فيها مشكلة) */}
            <Route 
              path="/test" 
              element={<div style={{color: 'white', padding: '50px'}}>Test Route is Working!</div>} 
            />

            {/* 5. التعامل مع أي مسار غير معروف */}
            {/* غيرنا التوجيه ليكون واضحاً لو المسار غير موجود */}
            <Route
              path="*"
              element={
                <div style={styles.errorPage}>
                  <h1 style={{color: '#fff'}}>404 - Page Not Found</h1>
                  <p style={{color: '#94a3b8'}}>المسار الذي تحاول الوصول إليه غير موجود.</p>
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