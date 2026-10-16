import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { portfolioApi, contentListApi } from '../../api/client';

const DEFAULT_MARQUEE_ITEMS = [
  'AI Custom',
  'Scan PDF Rekening Koran AI',
  'Dashboard Kolaborasi',
  'Sistem Budget Manajemen + Approval + Report Budget',
  'Sistem Aset Manajemen + Aset Depreciation + Aset QRCode',
  'Sistem Activity Mahasiswa',
  'Sistem Mail Engine untuk notifikasi email',
  'Sistem WhatsApp Gateway untuk notifikasi WhatsApp + AI Automation',
  'Sistem Notulensi Rapat + Followup + Undangan Digital',
];

export default function ProductsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marqueeItems, setMarqueeItems] = useState(DEFAULT_MARQUEE_ITEMS);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    portfolioApi.list().then(setItems).catch(() => {}).finally(() => setLoading(false));
    contentListApi.list('marquee_item').then((rows) => {
      if (Array.isArray(rows) && rows.length > 0) {
        setMarqueeItems(rows.map((r) => r.text));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Parse tech_stack string into array of chips
  const parseTechStack = (str) => {
    if (!str) return [];
    return str.split(/[,;|]/).map((s) => s.trim()).filter(Boolean).slice(0, 4);
  };

  // Pick the best thumbnail image for a project
  const getThumbnail = (item) => {
    if (item.images?.length) return item.images[0];
    if (item.image_path) return item.image_path;
    return null;
  };

  return (
    <section
      id="produk"
      ref={sectionRef}
      className={`public-section pj-section ${isVisible ? 'pj-visible' : ''}`}
    >
      {/* Header */}
      <div className="pj-header">
        <span className="pj-badge">PORTFOLIO</span>
        <h2 className="pj-heading">RECENT PROJECTS</h2>
        <p className="pj-sub">Sebagian aplikasi dan sistem unggulan yang telah kami bangun.</p>
      </div>

      {loading && <p className="section-empty-hint">Memuat produk…</p>}
      {!loading && items.length === 0 && (
        <p className="section-empty-hint">Belum ada produk yang ditampilkan.</p>
      )}

      {/* Project Grid */}
      {!loading && items.length > 0 && (
        <div className="pj-grid">
          {items.map((item, idx) => {
            const thumb = getThumbnail(item);
            const techs = parseTechStack(item.tech_stack);
            const num = String(idx + 1).padStart(2, '0');

            return (
              <Link
                key={item.id}
                to={`/produk/${item.id}`}
                className="pj-card"
                style={{ transitionDelay: `${idx * 0.08}s` }}
              >
                {/* Image / Live preview area */}
                <div className="pj-img-wrap">
                  {item.product_url?.trim() ? (
                    /* Live iframe preview */
                    <div className="pj-iframe-shell">
                      <iframe
                        src={item.product_url}
                        title={item.title}
                        className="pj-iframe"
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin"
                        scrolling="no"
                      />
                      {/* Overlay to prevent iframe capturing clicks → card link still works */}
                      <div className="pj-iframe-overlay" />
                    </div>
                  ) : thumb ? (
                    <img src={thumb} alt={item.title} className="pj-img" />
                  ) : (
                    <div className="pj-img-placeholder" />
                  )}
                  {/* Big stroke number overlay */}
                  <span className="pj-num" aria-hidden="true">{num}</span>
                  {/* Red top border line on hover */}
                  <div className="pj-top-line" />
                </div>


                {/* Card body */}
                <div className="pj-body">
                  <h3 className="pj-title">{item.title}</h3>
                  {item.description && (
                    <p className="pj-desc">{item.description}</p>
                  )}

                  {techs.length > 0 && (
                    <div className="pj-tags">
                      {techs.map((t) => (
                        <span key={t} className="pj-tag">{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Live URL chip – only shown if product_url is set */}
                  {item.product_url?.trim() && (
                    <a
                      href={item.product_url}
                      target="_blank"
                      rel="noreferrer"
                      className="pj-live-url"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                      {(() => {
                        try {
                          return new URL(item.product_url).hostname.replace('www.', '');
                        } catch {
                          return item.product_url;
                        }
                      })()}
                    </a>
                  )}

                  <span className="pj-link">
                    View Detail
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Running Text / Project Ticker */}
      {marqueeItems.length > 0 && (
        <div className="pj-marquee-section">
          <div className="pj-marquee-label-row">
            <span className="pj-marquee-dot-ping" />
            <span className="pj-marquee-label">PROYEK &amp; SISTEM LAINNYA YANG TELAH DIKERJAKAN</span>
          </div>

          <div className="pj-marquee-mask">
            <div className="pj-marquee-track">
              {/* Group 1 */}
              <div className="pj-marquee-group">
                {marqueeItems.map((itemText, idx) => (
                  <div className="pj-marquee-card" key={`g1-${itemText}-${idx}`}>
                    <span className="pj-marquee-icon">⚡</span>
                    <span className="pj-marquee-text">{itemText}</span>
                  </div>
                ))}
              </div>
              {/* Group 2 (Duplicate for 100% seamless hardware-accelerated infinite loop) */}
              <div className="pj-marquee-group" aria-hidden="true">
                {marqueeItems.map((itemText, idx) => (
                  <div className="pj-marquee-card" key={`g2-${itemText}-${idx}`}>
                    <span className="pj-marquee-icon">⚡</span>
                    <span className="pj-marquee-text">{itemText}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ─── Section wrapper ─── */
        .pj-section {
          padding: 70px 0 16px;
        }

        /* ─── Header ─── */
        .pj-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 52px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pj-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 16px;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #e63946;
          background: rgba(230, 57, 70, 0.08);
          border: 1px solid rgba(230, 57, 70, 0.2);
          border-radius: 99px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .pj-heading {
          font-family: 'Bebas Neue', 'Anton', sans-serif;
          font-size: clamp(3rem, 6vw, 4.8rem);
          font-weight: 900;
          letter-spacing: 0.02em;
          color: #0a0a0a;
          line-height: 1.05;
          margin: 0 0 12px 0;
        }
        .pj-sub {
          font-size: 1.02rem;
          color: #666666;
          max-width: 540px;
          margin: 0 auto;
          text-align: center;
          line-height: 1.65;
        }

        /* ─── Grid ─── */
        .pj-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 28px;
        }

        /* ─── Card ─── */
        .pj-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          border-radius: 16px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #f0f0f0;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          transition: transform 0.38s cubic-bezier(0.16,1,0.3,1),
                      box-shadow 0.38s ease,
                      border-color 0.3s ease;
          /* Animation in */
          opacity: 0;
          transform: translateY(32px);
        }
        .pj-visible .pj-card {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1),
                      box-shadow 0.38s ease, border-color 0.3s ease;
        }
        .pj-card:hover {
          transform: translateY(-8px) !important;
          border-color: rgba(230, 57, 70, 0.3);
          box-shadow: 0 20px 48px rgba(230, 57, 70, 0.12), 0 4px 16px rgba(0,0,0,0.06);
        }

        /* ─── Image area ─── */
        .pj-img-wrap {
          position: relative;
          height: 210px;
          background: #111;
          overflow: hidden;
        }
        .pj-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0.85;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease;
        }
        .pj-card:hover .pj-img {
          transform: scale(1.06);
          opacity: 1;
        }
        .pj-img-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        }

        /* ─── iframe live preview ─── */
        .pj-iframe-shell {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #f8f9fa;
        }
        .pj-iframe {
          /* Render at full 1280px desktop width then scale down ~0.31x to fit ~400px card */
          width: 1280px;
          height: 640px;          /* 640 * 0.3125 = 200px visible height */
          border: none;
          display: block;
          transform-origin: top left;
          transform: scale(0.3125);
          pointer-events: none;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .pj-card:hover .pj-iframe {
          transform: scale(0.33);
        }
        /* Invisible overlay so card <a> catches the click, not the iframe */
        .pj-iframe-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          cursor: pointer;
        }

        /* Big stroke number */
        .pj-num {
          position: absolute;
          bottom: -14px;
          left: 12px;
          font-family: 'Bebas Neue', 'Anton', sans-serif;
          font-size: 7rem;
          font-weight: 900;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 2px rgba(230, 57, 70, 0.7);
          pointer-events: none;
          z-index: 2;
          user-select: none;
          letter-spacing: -0.02em;
          transition: -webkit-text-stroke-color 0.3s ease;
        }
        .pj-card:hover .pj-num {
          -webkit-text-stroke-color: rgba(230, 57, 70, 1);
        }

        /* Top red line that slides in on hover */
        .pj-top-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 0%;
          height: 3px;
          background: #e63946;
          transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
          z-index: 3;
        }
        .pj-card:hover .pj-top-line {
          width: 100%;
        }

        /* ─── Card body ─── */
        .pj-body {
          padding: 28px 24px 24px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .pj-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0a0a0a;
          margin: 0 0 10px;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .pj-desc {
          font-size: 0.875rem;
          color: #666;
          line-height: 1.65;
          margin: 0 0 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Tech tags */
        .pj-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }
        .pj-tag {
          background: #f3f4f6;
          color: #374151;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 4px 10px;
          border-radius: 99px;
          text-transform: uppercase;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .pj-card:hover .pj-tag {
          background: #fff0f0;
          color: #e63946;
        }

        /* Live URL chip */
        .pj-live-url {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 12px;
          padding: 4px 10px 4px 8px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 99px;
          font-size: 11.5px;
          font-weight: 600;
          color: #16a34a;
          text-decoration: none;
          width: fit-content;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
          white-space: nowrap;
          overflow: hidden;
          max-width: 100%;
          text-overflow: ellipsis;
        }
        .pj-live-url:hover {
          background: #dcfce7;
          border-color: #86efac;
          color: #15803d;
        }
        .pj-live-url svg {
          flex-shrink: 0;
        }

        /* View link */
        .pj-link {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.875rem;
          font-weight: 700;
          color: #e63946;
          transition: gap 0.2s ease;
        }
        .pj-card:hover .pj-link {
          gap: 10px;
        }

        /* ─── Running Text / Marquee Ticker (Ultra Smooth 60fps GPU) ─── */
        .pj-marquee-section {
          margin-top: 64px;
          padding-top: 36px;
          border-top: 1px dashed rgba(0, 0, 0, 0.09);
          width: 100%;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pj-marquee-label-row {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          padding: 6px 18px;
          border-radius: 99px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }
        .pj-marquee-dot-ping {
          position: relative;
          display: flex;
          width: 8px;
          height: 8px;
        }
        .pj-marquee-dot-ping::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #e63946;
          animation: pjPing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .pj-marquee-dot-ping::after {
          content: '';
          position: relative;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e63946;
        }
        @keyframes pjPing {
          75%, 100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        .pj-marquee-label {
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4b5563;
        }
        .pj-marquee-mask {
          width: 100%;
          overflow: hidden;
          padding: 12px 0;
          position: relative;
          -webkit-mask-image: linear-gradient(to right, transparent, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, transparent);
          mask-image: linear-gradient(to right, transparent, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, transparent);
        }
        .pj-marquee-track {
          display: flex;
          width: max-content;
          user-select: none;
          gap: 16px;
        }
        .pj-marquee-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
          will-change: transform;
          animation: pjMarqueeScroll 52s linear infinite;
          transform: translate3d(0, 0, 0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .pj-marquee-mask:hover .pj-marquee-group {
          animation-play-state: paused;
        }
        @keyframes pjMarqueeScroll {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(calc(-100% - 16px), 0, 0);
          }
        }
        .pj-marquee-card {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 99px;
          padding: 10px 22px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
          white-space: nowrap;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          cursor: default;
          user-select: none;
          will-change: transform;
          transform: translateZ(0);
        }
        .pj-marquee-card:hover {
          transform: translateY(-2px);
          border-color: rgba(230, 57, 70, 0.4);
          box-shadow: 0 6px 20px rgba(230, 57, 70, 0.12);
          background: #fffafa;
        }
        .pj-marquee-icon {
          font-size: 0.88rem;
          color: #e63946;
          line-height: 1;
        }
        .pj-marquee-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1f2937;
          letter-spacing: -0.01em;
        }
        .pj-marquee-card:hover .pj-marquee-text {
          color: #e63946;
        }

        /* ─── Mobile ─── */
        @media (max-width: 640px) {
          .pj-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .pj-num {
            font-size: 5rem;
          }
          .pj-marquee-section {
            margin-top: 48px;
            padding-top: 28px;
          }
          .pj-marquee-label {
            font-size: 0.68rem;
          }
        }
      `}</style>
    </section>
  );
}
