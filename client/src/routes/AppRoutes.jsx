import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Loader from '../components/Loader.jsx';
import { getCurrentUser } from '../services/auth.js';

const Landing = lazy(() => import('../pages/Landing.jsx'));
const Login = lazy(() => import('../pages/Login.jsx'));
const Register = lazy(() => import('../pages/Register.jsx'));
const AuthCallback = lazy(() => import('../pages/AuthCallback.jsx'));

const BookingPage = lazy(() => import('../pages/BookingPage.jsx'));
const CustomerDashboard = lazy(() => import('../pages/CustomerDashboard.jsx'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard.jsx'));

function ProtectedRoute({ children, adminOnly = false }) {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (!adminOnly && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader message="Loading interface..." />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="auth/callback" element={<AuthCallback />} />

          <Route
            path="book"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
