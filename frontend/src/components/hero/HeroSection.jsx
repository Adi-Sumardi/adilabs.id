import { useEffect, useRef, useState } from 'react';
import { VEHICLES } from './vehicles';
import { spawnExhaust } from './smoke';
import { contentListApi, heroSettingsApi } from '../../api/client';
import '../../styles/hero.css';

// Fallbacks shown until the dashboard-managed content loads (or if the API
// is unreachable) — keeps the hero from ever rendering empty.
const DEFAULT_ROTATING_WORDS = ['Mobile Apps', 'Website', 'Landing Page', 'Mail Engine', 'WhatsApp Gateway'];
const DEFAULT_PRODUCTS = [
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

const EXHAUST_INTERVAL_MS = 40;

export default function HeroSection({ activeVehicle: externalVehicle, setActiveVehicle: setExternalVehicle }) {
  const [internalVehicle, setInternalVehicle] = useState('rocket');
  const activeVehicle = externalVehicle || internalVehicle;
  const setActiveVehicle = (v) => {
    setInternalVehicle(v);
    if (setExternalVehicle) setExternalVehicle(v);
  };
  const [headingPrefix, setHeadingPrefix] = useState('We Build');
  const [rotatingWords, setRotatingWords] = useState(DEFAULT_ROTATING_WORDS);
  const [marqueeItems, setMarqueeItems] = useState(DEFAULT_PRODUCTS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navRef = useRef(null);
  const heroRef = useRef(null);
  const wrapperRef = useRef(null);
  const starfieldRef = useRef(null);
  const smokeCanvasRef = useRef(null);
  const rotElRef = useRef(null);

  const currentVehicleRef = useRef(activeVehicle);
  const launchedRef = useRef(false);
  const lastProgressRef = useRef(0);
  const exhaustActiveRef = useRef(false);

  useEffect(() => { currentVehicleRef.current = activeVehicle; }, [activeVehicle]);

  // Pull dashboard-managed hero copy. Failures are swallowed on purpose —
  // the hardcoded defaults above already cover that case.
  useEffect(() => {
    heroSettingsApi.get().then((s) => setHeadingPrefix(s.heading_prefix)).catch(() => {});
    contentListApi.list('rotating_word').then((rows) => {
      if (rows.length) setRotatingWords(rows.map((r) => r.text));
    }).catch(() => {});
    contentListApi.list('marquee_item').then((rows) => {
      if (rows.length) setMarqueeItems(rows.map((r) => r.text));
    }).catch(() => {});
  }, []);

  const applyScrollTransform = (progress) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const translateY = -progress * window.innerHeight * 1.1;
    const opacity = 1 - progress * 1.4;
    const scale = 1 + progress * 0.15;
    wrapper.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
    wrapper.style.opacity = Math.max(opacity, 0);
  };

  // Render the chosen vehicle SVG + animation class
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    wrapper.innerHTML = VEHICLES[activeVehicle].fn();
    wrapper.className = launchedRef.current ? 'flying' : VEHICLES[activeVehicle].anim;
    applyScrollTransform(lastProgressRef.current);
  }, [activeVehicle]);

  // Rotating hero headline word — imperative crossfade+slide, same technique
  // as the vanilla version, so the swap is a single smooth motion instead of
  // a plain opacity toggle that visually "jumps" when the text width changes.
  useEffect(() => {
    const el = rotElRef.current;
    el.textContent = rotatingWords[0];
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % rotatingWords.length;
      el.style.opacity = 0;
      el.style.transform = 'translateY(-8px)';
      setTimeout(() => {
        el.textContent = rotatingWords[idx];
        el.style.transition = 'none';
        el.style.transform = 'translateY(8px)';
        void el.offsetWidth; // force reflow so the next transition actually animates
        el.style.transition = '';
        requestAnimationFrame(() => {
          el.style.opacity = 1;
          el.style.transform = 'translateY(0)';
        });
      }, 400);
    }, 2200);
    return () => clearInterval(id);
  }, [rotatingWords]);

  // Starfield background
  useEffect(() => {
    const canvas = starfieldRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let rafId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 2.5;
      stars = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random(),
        da: (Math.random() - 0.5) * 0.008,
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.a += s.da; if (s.a < 0.1 || s.a > 1) s.da *= -1;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a})`; ctx.fill();
      });
      rafId = requestAnimationFrame(draw);
    }

    resize(); draw();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Smoke / exhaust particle system
  useEffect(() => {
    const smokeCanvas = smokeCanvasRef.current;
    const sCtx = smokeCanvas.getContext('2d');
    let particles = [];
    let rafId;
    let lastExhaustTime = 0;

    function resize() {
      smokeCanvas.width = window.innerWidth;
      smokeCanvas.height = window.innerHeight;
    }
    function frame(ts) {
      if (exhaustActiveRef.current && (ts - lastExhaustTime) > EXHAUST_INTERVAL_MS) {
        lastExhaustTime = ts;
        const rect = wrapperRef.current.getBoundingClientRect();
        spawnExhaust(currentVehicleRef.current, (p) => particles.push(p), rect.left + rect.width / 2, rect.bottom);
      }

      sCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
      particles.forEach((p) => {
        p.vx += p.ax; p.vy += p.ay;
        p.vx *= .97; p.vy *= .99;
        p.x += p.vx; p.y += p.vy;
        p.r += (p.maxR - p.r) * .035;
        p.alpha -= p.decay;
        if (p.alpha <= 0) return;
        const [r, g, b] = p.color;
        const grad = sCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `rgba(${r},${g},${b},${p.alpha})`);
        grad.addColorStop(.45, `rgba(${r},${g},${b},${p.alpha * .45})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        sCtx.beginPath(); sCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        sCtx.fillStyle = grad; sCtx.fill();
      });
      particles = particles.filter((p) => p.alpha > 0);
      rafId = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    rafId = requestAnimationFrame(frame);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Scroll-driven launch sequence (smooth flight animation into space)
  useEffect(() => {
    const nav = navRef.current;
    const hero = heroRef.current;
    const wrapper = wrapperRef.current;
    let scrollRafId = null;

    function handleScroll() {
      if (scrollRafId) return;

      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = null;
        if (!hero || !wrapper || !nav) return;

        const scrollY = window.scrollY;
        const heroH = hero.offsetHeight || window.innerHeight;
        const progress = Math.min(Math.max(scrollY / (heroH * 0.6), 0), 1);
        lastProgressRef.current = progress;

        if (scrollY > 40) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }

        if (progress > 0.03 && !launchedRef.current) {
          launchedRef.current = true;
          wrapper.className = 'flying';
          exhaustActiveRef.current = true;
        } else if (progress <= 0.03 && launchedRef.current) {
          launchedRef.current = false;
          wrapper.className = VEHICLES[currentVehicleRef.current].anim;
          exhaustActiveRef.current = false;
        }
        applyScrollTransform(progress);
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRafId) cancelAnimationFrame(scrollRafId);
    };
  }, []);

  return (
    <>
      <nav id="nav" ref={navRef} className={mobileMenuOpen ? 'mobile-open' : ''}>
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/logo-panjang.png" alt="AdilLabs" className="nav-logo-img" />
          </div>

          <ul className="nav-links desktop-only">
            <li><a href="#produk">Produk</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#kontak">Kontak</a></li>
          </ul>

          <button 
            className="mobile-menu-btn mobile-only" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`hamburger-icon ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-nav-dropdown mobile-only">
            <a href="#produk" onClick={() => setMobileMenuOpen(false)}>Produk</a>
            <a href="#blog" onClick={() => setMobileMenuOpen(false)}>Blog</a>
            <a href="#kontak" onClick={() => setMobileMenuOpen(false)}>Kontak</a>
          </div>
        )}
      </nav>

      <canvas id="starfield" ref={starfieldRef} />
      <canvas id="smokeCanvas" ref={smokeCanvasRef} style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }} />

      <section id="hero" ref={heroRef}>
        <div id="vehicle-wrapper" className="hovering" ref={wrapperRef} />

        <div id="vehicle-picker">
          <div className="vp-label">Pilih Kendaraan</div>
          <div className="vp-options">
            {Object.entries(VEHICLES).map(([key, v]) => (
              <button
                key={key}
                className={`vp-btn${activeVehicle === key ? ' active' : ''}`}
                onClick={() => setActiveVehicle(key)}
              >
                <span className="vp-icon">{key === 'rocket' ? '🚀' : key === 'jet' ? '✈️' : '🛸'}</span> {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-text">
          <h1>{headingPrefix}<br /><span id="rotating-text" ref={rotElRef}>{rotatingWords[0]}</span></h1>
          <div className="marquee">
            <div className="marquee-track" id="marquee-track">
              {[...marqueeItems, ...marqueeItems].map((p, i) => (
                <div className="marquee-item" key={i}><span className="dot" />{p}</div>
              ))}
            </div>
          </div>
          <div className="cta-row">
            <a href="#kontak" className="btn btn-primary">Mulai Sekarang</a>
            <a href="#produk" className="btn btn-outline">Lihat Produk Kami</a>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="mouse"><div className="wheel" /></div>
          <span>Scroll</span>
        </div>
      </section>
    </>
  );
}
