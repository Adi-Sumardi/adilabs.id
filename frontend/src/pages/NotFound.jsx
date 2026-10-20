import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Halaman untuk URL yang tidak ada. Server mengembalikan status 404 (lihat .htaccess),
// dan di sini halaman ditandai noindex supaya tidak ikut terindeks.
export default function NotFound() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Halaman tidak ditemukan – AdiLabs';
    const robots = document.querySelector('meta[name="robots"]');
    const prevRobots = robots?.getAttribute('content');
    robots?.setAttribute('content', 'noindex, follow');
    return () => {
      document.title = prevTitle;
      if (robots && prevRobots) robots.setAttribute('content', prevRobots);
    };
  }, []);

  return (
    <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '80px 20px', textAlign: 'center', background: '#fff', color: '#1c0b0e' }}>
      <div>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e3122b', letterSpacing: '.12em' }}>404</p>
        <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(26px,4vw,40px)', margin: '8px 0 12px' }}>Halaman tidak ditemukan</h1>
        <p style={{ color: '#6a4a4f', marginBottom: 24 }}>Alamat yang Anda buka tidak tersedia atau sudah dipindahkan.</p>
        <Link to="/" style={{ display: 'inline-block', background: '#e3122b', color: '#fff', padding: '12px 22px', borderRadius: 999, fontWeight: 700, textDecoration: 'none' }}>Kembali ke beranda</Link>
      </div>
    </main>
  );
}
