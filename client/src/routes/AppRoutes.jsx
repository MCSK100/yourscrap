import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Loader from '../components/Loader.jsx';

const Landing = lazy(() => import('../pages/Landing.jsx'));
const BookingPage = lazy(() => import('../pages/BookingPage.jsx'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard.jsx'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader message="Loading..." />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path="book" element={<BookingPage />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
