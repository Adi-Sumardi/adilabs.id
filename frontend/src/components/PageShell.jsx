import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/solution.css';

export const WA_GENERAL = 'https://wa.me/6285121379697?text=Halo%20AdiLabs%2C%20saya%20ingin%20membahas%20aplikasi%20untuk%20%5Bnama%20instansi%5D.%20Proses%20yang%20ingin%20kami%20rapikan%3A%20%5Bmasalah%20utama%5D.%20Saat%20ini%20kami%20memakai%20%5Bcara/sistem%20saat%20ini%5D.%20Apakah%20bisa%20dijadwalkan%20diskusi%20kebutuhan%3F';

// Judul & deskripsi per halaman (canonical diatur RouteMeta)
export function usePageMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    const desc = document.querySelector('meta[name="description"]');
    const prevDesc = desc?.getAttribute('content');
    document.title = title;
    desc?.setAttribute('content', description);
    window.scrollTo(0, 0);
    return () => {
      document.title = prevTitle;
      if (desc && prevDesc) desc.setAttribute('content', prevDesc);
    };
  }, [title, description]);
}

export default function PageShell({ children, waUrl = WA_GENERAL }) {
  return (
    <div className="sol-page">
      <header className="sol-top">
        <Link to="/" className="sol-logo" aria-label="AdiLabs – kembali ke beranda">
          <img src="/logo-adilabs.png" alt="AdiLabs" />
        </Link>
        <nav className="sol-nav" aria-label="Navigasi">
          <a href="/#layanan">Solusi</a>
          <a href="/#proses">Cara Kerja</a>
          <a href="/#kontak">Kontak</a>
        </nav>
        <a className="sol-btn sol-btn-sm" href={waUrl} target="_blank" rel="noreferrer" data-track="whatsapp_click" data-loc="topbar">WhatsApp</a>
      </header>
      <main>{children}</main>
      <footer className="sol-foot">
        <span><b>adi</b>labs · Aplikasi &amp; otomasi untuk kantor dan yayasan</span>
        <nav aria-label="Navigasi bawah">
          <Link to="/solusi/tagihan-spp">Tagihan SPP</Link>
          <Link to="/solusi/approval-anggaran">Approval anggaran</Link>
          <Link to="/sianggar">SIANGGAR</Link>
          <Link to="/kebijakan-privasi">Kebijakan Privasi</Link>
        </nav>
        <span>© 2026 AdiLabs</span>
      </footer>
    </div>
  );
}
