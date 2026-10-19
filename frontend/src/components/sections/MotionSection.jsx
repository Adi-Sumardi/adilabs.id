import { useEffect, useRef } from 'react';
import { initHeroMotion } from '../motion/heroMotion';
import '../../styles/motion.css';

export default function MotionSection() {
  const hostRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current) return;
    return initHeroMotion(hostRef.current, {
      onCta: () => document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' }),
    });
  }, []);

  return (
    <section className="motion-section">
      <div className="m-wrap" ref={hostRef} />
    </section>
  );
}
