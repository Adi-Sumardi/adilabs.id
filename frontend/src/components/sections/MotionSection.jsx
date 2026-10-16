import { useEffect, useRef } from 'react';
import { initHeroMotion } from '../motion/heroMotion';
import '../../styles/motion.css';

export default function MotionSection() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;
    return initHeroMotion(rootRef.current, {
      onCta: () => document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' }),
    });
  }, []);

  return (
    <section className="motion-section" ref={rootRef}>
      <div className="m-wrap">
        <div className="m-stage">
          <div className="m-blob m-b1" />
          <div className="m-blob m-b2" />
          <div className="m-blob m-b3" />
          <div className="m-grid" />
          <canvas
            className="m-canvas"
            role="img"
            aria-label="Partikel merah membentuk layar aplikasi, tumpukan database, diagram alur, roket rilis, lalu logo AdiLabs"
          />
          <div className="m-flash" />
          <div className="m-notif" aria-hidden="true">
            <div className="m-ic">a</div>
            <div><b>AdiLabs App</b><span>Versi 1.0 sudah tersedia. Ketuk untuk memasang.</span></div>
            <time>baru saja</time>
          </div>
          <div className="m-cta">
            <button type="button">Mulai proyek →</button>
            <span>Ceritakan ide aplikasi Anda</span>
          </div>
          <div className="m-copy">
            <div className="m-eyebrow">01 · Desain aplikasi</div>
            <h2 className="m-title">
              Dari ide jadi aplikasi yang{' '}
              <span className="m-swapbox"><span className="m-swap">enak dipakai</span></span>
            </h2>
            <p className="m-sub">Kami merancang tampilan dan prototipe yang bisa diuji sebelum satu baris kode ditulis.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
