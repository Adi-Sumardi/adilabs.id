import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { portfolioApi } from '../api/client';
import ImageCarousel from '../components/ImageCarousel';
import '../styles/hero.css';
import '../styles/sections.css';
import '../styles/detail.css';

function isPdfUrl(url) {
  return url.toLowerCase().endsWith('.pdf');
}

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

            {item.diagrams?.length > 0 && (() => {
              const diagramImages = item.diagrams.filter((d) => !isPdfUrl(d));
              const diagramPdfs = item.diagrams.filter(isPdfUrl);
              return (
                <section className="detail-diagrams">
                  <h2>Desain &amp; Arsitektur</h2>
                  {diagramImages.length > 0 && (
                    <ImageCarousel images={diagramImages} alt={`Diagram ${item.title}`} />
                  )}
                  {diagramPdfs.length > 0 && (
                    <div className="detail-diagram-pdfs">
                      {diagramPdfs.map((url, i) => (
                        <a href={url} target="_blank" rel="noreferrer" className="detail-pdf-link" key={i}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                            <path d="M14 2v6h6" />
                          </svg>
                          Buka PDF Diagram {diagramPdfs.length > 1 ? i + 1 : ''}
                        </a>
                      ))}
                    </div>
                  )}
                </section>
              );
            })()}
          </article>
        )}
      </div>
    </div>
  );
}
