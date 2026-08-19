import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { portfolioApi } from '../api/client';
import ImageCarousel from '../components/ImageCarousel';
import '../styles/hero.css';
import '../styles/sections.css';
import '../styles/detail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError('');
    portfolioApi.get(id)
      .then(setItem)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="detail-page">
      <nav id="nav" className="scrolled">
        <div className="nav-logo">
          <img src="/logo-panjang.png" alt="AdilLabs" className="nav-logo-img" />
        </div>
        <ul className="nav-links">
          <li><Link to="/#produk">Produk</Link></li>
          <li><Link to="/#blog">Blog</Link></li>
          <li><Link to="/#kontak">Kontak</Link></li>
        </ul>
      </nav>

      <div className="detail-body">
        <Link to="/#produk" className="detail-back">← Kembali ke Produk</Link>

        {loading && <p className="section-empty-hint">Memuat…</p>}
        {error && <p className="section-empty-hint">{error}</p>}

        {item && (
          <article className="detail-article">
            <ImageCarousel images={item.images?.length ? item.images : [item.image_path]} alt={item.title} />
            <h1>{item.title}</h1>
            {item.tech_stack && (
              <div className="detail-tech-row">
                {item.tech_stack.split(',').map((t) => t.trim()).filter(Boolean).map((t, i) => (
                  <span className="detail-tech-chip" key={i}>{t}</span>
                ))}
              </div>
            )}
            {item.description && <p className="detail-lead">{item.description}</p>}
            {item.product_url && (
              <a href={item.product_url} target="_blank" rel="noreferrer" className="btn btn-primary">
                Kunjungi Produk →
              </a>
            )}

            {item.diagrams?.length > 0 && (
              <section className="detail-diagrams">
                <h2>Desain &amp; Arsitektur</h2>
                <ImageCarousel images={item.diagrams} alt={`Diagram ${item.title}`} />
              </section>
            )}
          </article>
        )}
      </div>
    </div>
  );
}
