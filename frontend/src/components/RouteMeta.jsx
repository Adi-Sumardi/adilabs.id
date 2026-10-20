import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Canonical mengikuti halaman yang sedang dibuka (bukan selalu ke beranda),
// dan halaman internal ditandai noindex.
export default function RouteMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const link = document.querySelector('link[rel="canonical"]');
    if (link) link.setAttribute('href', 'https://adilabs.id' + (pathname === '/' ? '/' : pathname.replace(/\/+$/, '')));
    // halaman internal (login & dashboard) tidak perlu masuk hasil pencarian
    const robots = document.querySelector('meta[name="robots"]');
    if (robots && /^\/(login|dashboard)(\/|$)/.test(pathname)) robots.setAttribute('content', 'noindex, nofollow');
  }, [pathname]);
  return null;
}
