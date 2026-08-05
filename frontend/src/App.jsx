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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/produk/:id" element={<ProductDetail />} />
          <Route path="/blog/:slug" element={<ArticleDetail />} />
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
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
