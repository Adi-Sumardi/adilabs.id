import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import ProductDetail from './pages/ProductDetail';
import ArticleDetail from './pages/ArticleDetail';
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import ArticlesPanel from './pages/ArticlesPanel';
import PortfolioPanel from './pages/PortfolioPanel';
import AdsPanel from './pages/AdsPanel';
import MarqueePanel from './pages/MarqueePanel';
import HeroTextPanel from './pages/HeroTextPanel';
import ChangePasswordPanel from './pages/ChangePasswordPanel';
import NotFound from './pages/NotFound';
import SolutionPage from './pages/solusi/SolutionPage';
import PrivacyPage from './pages/PrivacyPage';
import RouteMeta from './components/RouteMeta';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouteMeta />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/produk/:id" element={<ProductDetail />} />
          <Route path="/blog/:slug" element={<ArticleDetail />} />
          <Route path="/solusi/:slug" element={<SolutionPage />} />
          <Route path="/kebijakan-privasi" element={<PrivacyPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ArticlesPanel />} />
            <Route path="portofolio" element={<PortfolioPanel />} />
            <Route path="iklan" element={<AdsPanel />} />
            <Route path="running-teks" element={<MarqueePanel />} />
            <Route path="teks-hero" element={<HeroTextPanel />} />
            <Route path="ganti-password" element={<ChangePasswordPanel />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
