import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { articlesApi } from '../api/client';
import '../styles/hero.css';
import '../styles/sections.css';
import '../styles/detail.css';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError('');
    articlesApi.getBySlug(slug)
      .then(setArticle)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

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
        <Link to="/#blog" className="detail-back">← Kembali ke Blog</Link>

        {loading && <p className="section-empty-hint">Memuat…</p>}
        {error && <p className="section-empty-hint">{error}</p>}

        {article && (
          <article className="detail-article">
            {article.cover_image && <img src={article.cover_image} alt={article.title} className="detail-cover-img" />}
            <h1>{article.title}</h1>
            <div className="blog-card-meta">
              {article.author_name} · {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="detail-content">
              {article.content.split('\n').map((line, i) => (
                line.trim() ? <p key={i}>{line}</p> : null
              ))}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
