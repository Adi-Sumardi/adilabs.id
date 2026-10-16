import React from 'react';
import ProfileHeroSection from '../components/sections/ProfileHeroSection';
import MotionSection from '../components/sections/MotionSection';
import ContactSection from '../components/sections/ContactSection';
import '../styles/sections.css';

export default function Landing() {
  return (
    <div className="landing-page-root">
      <ProfileHeroSection />
      <MotionSection />
      <ContactSection />
    </div>
  );
}
