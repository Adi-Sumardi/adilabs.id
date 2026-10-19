import React, { useRef } from 'react';
import ProfileHeroSection from '../components/sections/ProfileHeroSection';
import MotionSection from '../components/sections/MotionSection';
import ContactSection from '../components/sections/ContactSection';
import '../styles/sections.css';

export default function Landing() {
  // footer motion (wordmark besar) dipasang paling bawah, tapi dikendalikan oleh MotionSection
  const footerRef = useRef(null);

  return (
    <div className="landing-page-root">
      <MotionSection footerRef={footerRef} />
      <ProfileHeroSection />
      <ContactSection />
      <footer className="motion-footer" ref={footerRef} />
    </div>
  );
}
