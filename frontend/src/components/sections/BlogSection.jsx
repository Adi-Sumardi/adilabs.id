import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { articlesApi } from '../../api/client';

export default function BlogSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0.5);
  const sectionRef = useRef(null);

  useEffect(() => {
    articlesApi.list().then(setArticles).catch(() => {}).finally(() => setLoading(false));
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
      id="blog" 
      ref={sectionRef} 
      className={`public-section animated-section ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="section-header">
        <span className="section-badge">BLOG & INSIGHT</span>
        <h2>Blog & Artikel</h2>
        <p>Insight teknologi, update produk, dan cerita menarik dari balik layar AdilLabs.</p>
      </div>

      {loading && <p className="section-empty-hint">Memuat artikel…</p>}
      {!loading && articles.length === 0 && <p className="section-empty-hint">Belum ada artikel yang diterbitkan.</p>}

      <div 
        className="blog-grid"
        style={{ transform: `translate3d(0, ${parallaxShift}px, 0)` }}
      >
        {articles.map((a, idx) => (
          <Link 
            to={`/blog/${a.slug}`} 
            className="blog-card animated-card" 
            key={a.id}
            style={{ transitionDelay: `${idx * 0.1}s` }}
          >
            {a.cover_image && (
              <div className="blog-card-img-wrapper">
                <img src={a.cover_image} alt={a.title} className="blog-card-img" />
                <div className="blog-card-overlay"></div>
              </div>
            )}
            <div className="blog-card-body">
              <h3>{a.title}</h3>
              {a.excerpt && <p>{a.excerpt}</p>}
              <div className="blog-card-meta">
                <span>{a.author_name || 'Tim AdilLabs'}</span>
                <span className="meta-dot">•</span>
                <span>{new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
