import { useEffect, useRef, useState } from 'react';
import '../../styles/profile-intro.css';

export default function ProfileIntroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section 
      id="about-intro" 
      ref={sectionRef} 
      className={`profile-intro-section ${isVisible ? 'is-visible' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {/* Background warm radiant glow matching reference */}
      <div 
        className="profile-glow-backdrop" 
        style={{
          transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`
        }}
      />
      <div className="profile-ambient-sun" />

      <div className="profile-container">
        {/* Top Script Greeting "Hey, there" */}
        <div className="profile-script-wrap">
          <span className="profile-script-text">Hey, there</span>
        </div>

        {/* Main 3-Column / Overlay Stage */}
        <div className="profile-stage">
          
          {/* Left Column Content */}
          <div className="profile-col profile-col-left">
            <div className="profile-status-pill">
              <span className="status-indicator-dot">
                <span className="pulse-wave"></span>
              </span>
              <span className="status-label">Available for new opportunities</span>
            </div>

            <div className="profile-title-block profile-title-left">
              <h2 className="profile-huge-heading">
                <span className="heading-line">I AM</span>
                <span className="heading-line highlight-name">ADI SUMARDI</span>
              </h2>
            </div>

            <div className="profile-metrics-row">
              <div className="metric-item">
                <span className="metric-value">8+</span>
                <span className="metric-desc">Tahun Pengalaman</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-item">
                <span className="metric-value">50+</span>
                <span className="metric-desc">Sistem & Web App</span>
              </div>
            </div>
          </div>

          {/* Center Column: Portrait Photo with Feathered Bottom */}
          <div className="profile-center-portrait-wrap">
            <div 
              className="portrait-card"
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 8}deg)`
              }}
            >
              <div className="portrait-image-frame">
                <img 
                  src="/profile-portrait.jpg" 
                  alt="Adi Sumardi - Digital Product Designer & Developer" 
                  className="profile-portrait-img"
                  loading="lazy"
                />
                <div className="portrait-bottom-feather" />
              </div>
            </div>
          </div>

          {/* Right Column Content */}
          <div className="profile-col profile-col-right">
            <p className="profile-specialization-text">
              Specialized in Web Design, UX / UI, Full-Stack Architecture, and Scalable Digital Product Development.
            </p>

            <div className="profile-title-block profile-title-right">
              <h2 className="profile-huge-heading">
                <span className="heading-line">DIGITAL</span>
                <span className="heading-line">PRODUCT</span>
                <span className="heading-line highlight-role">DESIGNER</span>
              </h2>
            </div>

            <div className="profile-tags-wrap">
              <span className="tech-tag">UI / UX</span>
              <span className="tech-tag">React & Next.js</span>
              <span className="tech-tag">AI Engineering</span>
              <span className="tech-tag">Cloud Architecture</span>
            </div>
          </div>

        </div>

        {/* Action button row */}
        <div className="profile-action-row">
          <a href="#produk" className="btn-profile-explore">
            <span>Lihat Recent Projects</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
