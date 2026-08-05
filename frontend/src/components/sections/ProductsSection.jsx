import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { portfolioApi } from '../../api/client';
import ImageCarousel from '../ImageCarousel';

export default function ProductsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0.5);
  const sectionRef = useRef(null);

  useEffect(() => {
    portfolioApi.list().then(setItems).catch(() => {}).finally(() => setLoading(false));
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
      { threshold: 0.08 }
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

  // Calculate subtle vertical float offset based on scroll progress
  const parallaxShift = (scrollProgress - 0.5) * -20;

  return (
    <section 
      id="produk" 
      ref={sectionRef} 
      className={`public-section animated-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="section-header">
        <span className="section-badge">PORTOFOLIO</span>
        <h2>Produk & Portofolio</h2>
        <p>Sebagian aplikasi dan sistem unggulan yang telah kami bangun untuk klien kami.</p>
      </div>

      {loading && <p className="section-empty-hint">Memuat produk…</p>}
      {!loading && items.length === 0 && <p className="section-empty-hint">Belum ada produk yang ditampilkan.</p>}

      <div 
        className="product-grid"
        style={{ transform: `translate3d(0, ${parallaxShift}px, 0)` }}
      >
        {items.map((item, idx) => (
          <Link 
            to={`/produk/${item.id}`} 
            className="product-card animated-card" 
            key={item.id}
            style={{ transitionDelay: `${idx * 0.1}s` }}
          >
            <ImageCarousel images={item.images?.length ? item.images : [item.image_path]} alt={item.title} />
            <div className="product-card-body">
              <h3>{item.title}</h3>
              {item.description && <p>{item.description}</p>}
              <span className="product-card-link">
                Lihat Detail 
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
