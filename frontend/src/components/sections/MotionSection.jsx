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
            <div className="m-mascot wave">
              <svg viewBox="0 0 120 140" role="img" aria-label="Maskot robot AdiLabs">
                <defs>
                  <linearGradient id="m-gHead" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#ffe9e7" /></linearGradient>
                  <linearGradient id="m-gBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff6a52" /><stop offset=".55" stopColor="#e3122b" /><stop offset="1" stopColor="#9b0a1d" /></linearGradient>
                </defs>
                <ellipse className="m-shadow" cx="60" cy="134" rx="26" ry="4" fill="#9b0a1d" opacity=".18" />
                <g className="m-bot">
                  <line x1="60" y1="22" x2="60" y2="11" stroke="#9b0a1d" strokeWidth="3" strokeLinecap="round" />
                  <circle className="m-bulb" cx="60" cy="8" r="5" fill="#e3122b" />
                  <rect x="12" y="42" width="10" height="20" rx="5" fill="#e3122b" />
                  <rect x="98" y="42" width="10" height="20" rx="5" fill="#e3122b" />
                  <rect x="26" y="88" width="10" height="24" rx="5" fill="#9b0a1d" />
                  <g className="m-arm-r"><rect x="83" y="88" width="10" height="24" rx="5" fill="#9b0a1d" /><circle cx="88" cy="113" r="6" fill="#e3122b" /></g>
                  <rect x="36" y="84" width="48" height="38" rx="14" fill="url(#m-gBody)" />
                  <circle className="m-chest" cx="60" cy="103" r="6" fill="#ffffff" />
                  <rect x="20" y="20" width="80" height="64" rx="24" fill="url(#m-gHead)" stroke="#f0c4c1" strokeWidth="2" />
                  <rect x="29" y="33" width="62" height="38" rx="17" fill="#1c0b0e" />
                  <g className="m-eyes">
                    <g className="m-lids">
                      <rect className="m-eye" x="42" y="44" width="10" height="16" rx="5" fill="#ff6a52" />
                      <rect className="m-eye" x="68" y="44" width="10" height="16" rx="5" fill="#ff6a52" />
                    </g>
                    <path className="m-happy" d="M41 55 q6 -9 12 0 M67 55 q6 -9 12 0" stroke="#ff6a52" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </g>
                  <ellipse cx="34" cy="76" rx="5" ry="2.6" fill="#ff8a7a" opacity=".55" />
                  <ellipse cx="86" cy="76" rx="5" ry="2.6" fill="#ff8a7a" opacity=".55" />
                </g>
              </svg>
              <div className="m-bubble"><span className="m-bubble-text">Halo! Aku Adi.</span><span className="m-caret" /></div>
            </div>
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
