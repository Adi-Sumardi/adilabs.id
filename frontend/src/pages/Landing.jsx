import React, { useState } from 'react';
import HeroSection from '../components/hero/HeroSection';
import CosmicUniverseCanvas from '../components/common/CosmicUniverseCanvas';
import BackgroundVehicleOrbit from '../components/common/BackgroundVehicleOrbit';
import ProductsSection from '../components/sections/ProductsSection';
import BlogSection from '../components/sections/BlogSection';
import AdsSection from '../components/sections/AdsSection';
import ContactSection from '../components/sections/ContactSection';
import '../styles/sections.css';

export default function Landing() {
  const [activeVehicle, setActiveVehicle] = useState('rocket');

  return (
    <>
      <CosmicUniverseCanvas />
      <HeroSection activeVehicle={activeVehicle} setActiveVehicle={setActiveVehicle} />
      <BackgroundVehicleOrbit activeVehicle={activeVehicle} />
      <ProductsSection />
      <BlogSection />
      <AdsSection />
      <ContactSection />
    </>
  );
}
