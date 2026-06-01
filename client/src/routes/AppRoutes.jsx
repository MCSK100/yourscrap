import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Loader from '../components/Loader.jsx';
import { getSeoPagesSlugs } from '../data/localSeoPages.js';

const Landing = lazy(() => import('../pages/Landing.jsx'));
const BookingPage = lazy(() => import('../pages/BookingPage.jsx'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard.jsx'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage.jsx'));
const TermsPage = lazy(() => import('../pages/TermsPage.jsx'));
const ContactPage = lazy(() => import('../pages/ContactPage.jsx'));
const LocalSeoPage = lazy(() => import('../pages/LocalSeoPage.jsx'));
const ServicesPage = lazy(() => import('../pages/ServicesPage.jsx'));
const IronScrapPage = lazy(() => import('../pages/IronScrapPage.jsx'));
const PaperScrapPage = lazy(() => import('../pages/PaperScrapPage.jsx'));
const EWastePage = lazy(() => import('../pages/EWastePage.jsx'));
const ScrapBuyersPage = lazy(() => import('../pages/ScrapBuyersPage.jsx'));

const seoSlugs = getSeoPagesSlugs();

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader message="Loading..." />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/iron-scrap" element={<IronScrapPage />} />
        <Route path="/paper-scrap" element={<PaperScrapPage />} />
        <Route path="/e-waste" element={<EWastePage />} />
        <Route path="/scrap-buyers" element={<ScrapBuyersPage />} />

        {seoSlugs.map((slug) => (
          <Route key={slug} path={`/${slug}`} element={<LocalSeoPage />} />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
