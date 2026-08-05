import { useEffect, useState, useRef } from 'react';
import { adsApi } from '../../api/client';

const FALLBACK_ADS = [
  { 
    id: 'f1', 
    title: 'Mail Engine - Notifikasi Email Otomatis', 
    target_url: '#', 
    image_path: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', 
    tag: 'PROMO' 
  },
  { 
    id: 'f2', 
    title: 'WhatsApp Gateway - Automation & AI Alert', 
    target_url: '#', 
    image_path: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80', 
    tag: 'FEATURED' 
  },
];

export default function AdsSection() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0.5);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    adsApi
      .list()
      .then((data) => setAds(Array.isArray(data) ? data : []))
      .catch(() => setAds([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const totalRange = windowHeight + rect.height;
      const currentPos = windowHeight - rect.top;
      const progress = Math.min(Math.max(currentPos / totalRange, 0), 1);

      rafId = requestAnimationFrame(() => {
        setScrollProgress(progress);
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  // Ensure EXACTLY 2 cards displayed
  const displayAds = (() => {
    if (ads.length >= 2) return ads.slice(0, 2);
    if (ads.length === 1) return [ads[0], FALLBACK_ADS[1]];
    return FALLBACK_ADS;
  })();

  // Smooth scroll offset for 2 cards
  const card1Shift = (scrollProgress - 0.5) * -30;
  const card2Shift = (scrollProgress - 0.5) * 30;

  return (
    <section 
      id="iklan" 
      ref={sectionRef} 
      className={`public-section ads-two-cards-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="ads-header">
        <span className="ads-badge">IKLAN & LAYANAN</span>
        <h2>Butuh Aplikasi Notifikasi & Layanan Digital?</h2>
        <p>Jelajahi berbagai solusi terintegrasi dan layanan khusus yang siap mendukung kebutuhan Anda.</p>
      </div>

      {loading && ads.length === 0 ? (
        <p className="section-empty-hint">Memuat iklan…</p>
      ) : (
        <div className="ads-two-cards-grid">
          {/* Card 1 */}
          <a
            href={displayAds[0].target_url || '#'}
            target="_blank"
            rel="noreferrer"
            className="ad-two-card ad-card-left"
            style={{ transform: `translate3d(${card1Shift}px, 0, 0)` }}
          >
            <div className="ad-card-img-wrapper">
              <img src={displayAds[0].image_path} alt={displayAds[0].title} className="ad-card-img" />
              <div className="ad-card-overlay"></div>
            </div>
            <div className="ad-card-body">
              <span className="ad-card-tag">{displayAds[0].tag || 'PROMO'}</span>
              <h4>{displayAds[0].title}</h4>
              <span className="ad-card-link-btn">
                Lihat Detail 
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>

          {/* Card 2 */}
          <a
            href={displayAds[1].target_url || '#'}
            target="_blank"
            rel="noreferrer"
            className="ad-two-card ad-card-right"
            style={{ transform: `translate3d(${card2Shift}px, 0, 0)` }}
          >
            <div className="ad-card-img-wrapper">
              <img src={displayAds[1].image_path} alt={displayAds[1].title} className="ad-card-img" />
              <div className="ad-card-overlay"></div>
            </div>
            <div className="ad-card-body">
              <span className="ad-card-tag">{displayAds[1].tag || 'FEATURED'}</span>
              <h4>{displayAds[1].title}</h4>
              <span className="ad-card-link-btn">
                Lihat Detail 
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>
        </div>
      )}
    </section>
  );
}
