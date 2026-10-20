import { useState, useEffect, useRef } from 'react';
import '../../styles/profile-hero.css';

export default function ProfileHeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <header id="tentang" className="profile-hero-wrapper" ref={heroRef} onMouseMove={handleMouseMove}>
      {/* Navigation Header matching Madison reference */}
      <nav className={`profile-nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="profile-nav-container">
          <a href="#" className="brand-logo-wrap">
            <img src="/logo-adilabs.png" alt="AdilLabs" className="brand-logo-img" />
          </a>

          <ul className="profile-nav-links desktop-only">
            <li><a href="#" className="active">Beranda</a></li>
            <li><a href="#layanan">Solusi</a></li>
            <li><a href="#proses">Cara Kerja</a></li>
            <li><a href="#tentang">Tentang AdiLabs</a></li>
          </ul>

          <div className="nav-action-wrap desktop-only">
            <a href="#kontak" className="btn-nav-contact">Kontak</a>
          </div>

          <button 
            className="mobile-toggle-btn mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span className={`menu-bars ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="profile-mobile-menu mobile-only">
            <a href="#" onClick={() => setMobileMenuOpen(false)}>Beranda</a>
            <a href="#layanan" onClick={() => setMobileMenuOpen(false)}>Solusi</a>
            <a href="#proses" onClick={() => setMobileMenuOpen(false)}>Cara Kerja</a>
            <a href="#tentang" onClick={() => setMobileMenuOpen(false)}>Tentang AdiLabs</a>
            <a href="#kontak" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e63946', fontWeight: 700 }}>Kontak</a>
          </div>
        )}
      </nav>

      {/* Hero Body Stage */}
      <div className="profile-hero-stage">
        {/* Radiant Warm Ambient Sunbeam Glow */}
        <div 
          className="hero-warm-glow"
          style={{
            transform: `translate(calc(-50% + ${mousePos.x * 30}px), calc(-50% + ${mousePos.y * 30}px))`
          }}
        />
        <div className="hero-sunbeam-aura" />

        {/* Top Script Text "Hey, there" */}
        <div className="hero-script-container">
          <span className="hero-script-text">Hey, there</span>
        </div>

        {/* 3-Column Visual Presentation */}
        <div className="hero-content-grid">
          
          {/* Left Column */}
          <div className="hero-column hero-col-left">
            <div className="hero-heading-block hero-heading-left">
              <span className="hero-intro-prefix">I am</span>
              <h2 className="hero-huge-title">
                <span className="title-row title-highlight">ADI SUMARDI</span>
              </h2>
            </div>

            <div className="hero-stats-capsule">
              <div className="stat-box">
                <span className="stat-number">5+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-line" />
              <div className="stat-box">
                <span className="stat-number">20+</span>
                <span className="stat-label">Active Products</span>
              </div>
            </div>

            {/* LinkedIn Profile Link */}
            <a
              href="https://www.linkedin.com/in/adi-sumardi-9037b0156"
              target="_blank"
              rel="noreferrer"
              className="hero-linkedin-btn"
              title="Connect on LinkedIn"
            >
              <div className="linkedin-icon-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <span className="linkedin-btn-text">Connect on LinkedIn</span>
              <svg className="linkedin-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
          </div>

          {/* Center Column: Portrait Image */}
          <div className="hero-column hero-col-center">
            <div 
              className="portrait-frame"
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 6}deg)`
              }}
            >
              <img 
                src="/adi.png" 
                alt="Adi Sumardi - Software Developer & Architect" 
                className="hero-portrait-image"
              />
              <div className="portrait-feather-overlay" />
            </div>
          </div>

          {/* Right Column */}
          <div className="hero-column hero-col-right">
            <p className="hero-bio-summary">
              Specialized in Full-Stack Web & Mobile Apps, AI Integrations, and Scalable Cloud Architecture.
            </p>

            <div className="hero-heading-block hero-heading-right">
              <h2 className="hero-huge-title">
                <span className="title-row">SOFTWARE</span>
                <span className="title-row title-role-accent">DEVELOPER</span>
              </h2>
            </div>

            <div className="hero-skills-row">
              <span className="skill-chip">Full-Stack</span>
              <span className="skill-chip">Web & Mobile</span>
              <span className="skill-chip">AI Integrations</span>
              <span className="skill-chip">Cloud Architecture</span>
            </div>
          </div>

        </div>

        {/* Scroll down trigger */}
        <a href="#kontak" className="hero-scroll-indicator" aria-label="Scroll to contact">
          <div className="scroll-arrow-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </div>
          <span className="scroll-caption">GET IN TOUCH</span>
        </a>
      </div>
    </header>
  );
}
