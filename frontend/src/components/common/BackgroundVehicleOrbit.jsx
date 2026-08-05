import React, { useEffect, useRef } from 'react';
import { VEHICLES, makeUFO } from '../hero/vehicles';

export default function BackgroundVehicleOrbit({ activeVehicle = 'rocket' }) {
  const containerRef = useRef(null);
  const vehicleRef = useRef(null);
  const ufo1Ref = useRef(null);
  const ufo2Ref = useRef(null);
  const ufo3Ref = useRef(null);
  const canvasRef = useRef(null);

  const angleRef = useRef(0);
  const opacityRef = useRef(0);
  const fullSquadAssembledAtRef = useRef(null);

  // Initialize SVGs
  useEffect(() => {
    if (vehicleRef.current) {
      const vObj = VEHICLES[activeVehicle] || VEHICLES.rocket;
      vehicleRef.current.innerHTML = vObj.fn();
      vehicleRef.current.className = 'mini-orbit-vehicle flying';
    }

    const ufoSvg = makeUFO();
    if (ufo1Ref.current) ufo1Ref.current.innerHTML = ufoSvg;
    if (ufo2Ref.current) ufo2Ref.current.innerHTML = ufoSvg;
    if (ufo3Ref.current) ufo3Ref.current.innerHTML = ufoSvg;
  }, [activeVehicle]);

  useEffect(() => {
    let rafId;
    let laserBolts = [];
    let explosionParticles = [];
    let shockwaves = [];
    let lastUFOShotTime = 0;
    let lastVehicleShotTime = 0;

    const ufoStates = [
      {
        id: 1,
        ref: ufo1Ref,
        angleOffset: -0.32,
        radiusOffset: 75,
        targetScale: 0.28,
        color: '#ff0055',
        isAlive: true,
        respawnAt: 0,
        x: 0,
        y: 0,
      },
      {
        id: 2,
        ref: ufo2Ref,
        angleOffset: -0.48,
        radiusOffset: 0,
        targetScale: 0.26,
        color: '#00ffcc',
        isAlive: true,
        respawnAt: 0,
        x: 0,
        y: 0,
      },
      {
        id: 3,
        ref: ufo3Ref,
        angleOffset: -0.32,
        radiusOffset: -75,
        targetScale: 0.28,
        color: '#ffcc00',
        isAlive: true,
        respawnAt: 0,
        x: 0,
        y: 0,
      },
    ];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function animate(now) {
      const windowW = (canvas.width = window.innerWidth);
      const windowH = (canvas.height = window.innerHeight);

      angleRef.current += 0.012;
      const scrollY = window.scrollY;

      // Show in lower sections (when scrollY > 30% of viewport height)
      const targetOpacity = scrollY > windowH * 0.3 ? 0.9 : 0;
      opacityRef.current += (targetOpacity - opacityRef.current) * 0.08;

      const isVisible = opacityRef.current > 0.01;

      if (containerRef.current) {
        containerRef.current.style.opacity = opacityRef.current;
      }

      ctx.clearRect(0, 0, windowW, windowH);

      if (isVisible) {
        const rx = Math.min(windowW * 0.4, 520);
        const ry = Math.min(windowH * 0.28, 220);
        const centerX = windowW / 2;
        const centerY = windowH / 2;

        const mainAngle = angleRef.current;

        // 1. Lead Vehicle Position & Rotation
        const leadX = centerX + rx * Math.cos(mainAngle);
        const leadY = centerY + ry * Math.sin(mainAngle);
        const leadNextX = centerX + rx * Math.cos(mainAngle + 0.012);
        const leadNextY = centerY + ry * Math.sin(mainAngle + 0.012);
        const leadRot = (Math.atan2(leadNextY - leadY, leadNextX - leadX) * 180) / Math.PI + 90;

        if (vehicleRef.current) {
          vehicleRef.current.style.transform = `translate3d(${leadX - 80}px, ${leadY - 120}px, 0) scale(0.35) rotate(${leadRot}deg)`;
        }

        // 2. Update UFO Positions & Respawn Timers (Hold 3 seconds for respawn)
        ufoStates.forEach((ufo) => {
          if (!ufo.isAlive && now > ufo.respawnAt) {
            ufo.isAlive = true;
            // Warp shockwave on respawn
            shockwaves.push({
              x: ufo.x,
              y: ufo.y,
              radius: 5,
              maxRadius: 40,
              color: '#00f0ff',
              lineWidth: 3,
              alpha: 1,
            });
          }

          const uAngle = mainAngle + ufo.angleOffset;
          const uRx = rx + ufo.radiusOffset;
          const uRy = ry + ufo.radiusOffset * (ry / rx);

          ufo.x = centerX + uRx * Math.cos(uAngle);
          ufo.y = centerY + uRy * Math.sin(uAngle);
          const uNextX = centerX + uRx * Math.cos(uAngle + 0.012);
          const uNextY = centerY + uRy * Math.sin(uAngle + 0.012);
          const uRot = (Math.atan2(uNextY - ufo.y, uNextX - ufo.x) * 180) / Math.PI + 90;

          if (ufo.ref.current) {
            if (ufo.isAlive) {
              ufo.ref.current.style.opacity = 1;
              ufo.ref.current.style.transform = `translate3d(${ufo.x - 80}px, ${ufo.y - 120}px, 0) scale(${ufo.targetScale}) rotate(${uRot}deg)`;
            } else {
              ufo.ref.current.style.opacity = 0;
            }
          }
        });

        const aliveUFOs = ufoStates.filter((u) => u.isAlive);
        const isFullSquad = aliveUFOs.length === 3;

        // Track when all 3 UFOs became fully active together
        if (!isFullSquad) {
          fullSquadAssembledAtRef.current = null;
        } else if (fullSquadAssembledAtRef.current === null) {
          fullSquadAssembledAtRef.current = now;
        }

        // 3. UFOs Fire Lasers at Lead Vehicle
        if (aliveUFOs.length > 0 && now - lastUFOShotTime > 320) {
          lastUFOShotTime = now;
          const shooter = aliveUFOs[Math.floor(Math.random() * aliveUFOs.length)];

          laserBolts.push({
            type: 'ufo',
            sx: shooter.x,
            sy: shooter.y,
            cx: shooter.x,
            cy: shooter.y,
            tx: leadX,
            ty: leadY,
            progress: 0,
            speed: 0.12,
            color: shooter.color,
            targetUFO: null,
          });
        }

        // 4. Lead Vehicle COUNTER-ATTACK Fire:
        // Require all 3 UFOs to be assembled AND wait EXACTLY 2 seconds of chase before firing!
        if (
          isFullSquad &&
          fullSquadAssembledAtRef.current !== null &&
          now - fullSquadAssembledAtRef.current >= 2000 &&
          now - lastVehicleShotTime >= 2000
        ) {
          lastVehicleShotTime = now;
          fullSquadAssembledAtRef.current = null; // Reset squad timer until next full assembly

          const targetUFO = aliveUFOs[Math.floor(Math.random() * aliveUFOs.length)];

          laserBolts.push({
            type: 'hero',
            sx: leadX,
            sy: leadY,
            cx: leadX,
            cy: leadY,
            tx: targetUFO.x,
            ty: targetUFO.y,
            progress: 0,
            speed: 0.16,
            color: '#00f0ff',
            targetUFO: targetUFO,
          });
        }

        // 5. Update & Draw Laser Bolts
        laserBolts.forEach((bolt) => {
          bolt.progress += bolt.speed;

          // If hero laser targeting a moving UFO, dynamically update target position
          if (bolt.type === 'hero' && bolt.targetUFO) {
            bolt.tx = bolt.targetUFO.x;
            bolt.ty = bolt.targetUFO.y;
          }

          bolt.cx = bolt.sx + (bolt.tx - bolt.sx) * bolt.progress;
          bolt.cy = bolt.sy + (bolt.ty - bolt.sy) * bolt.progress;

          const tailX = bolt.sx + (bolt.tx - bolt.sx) * Math.max(0, bolt.progress - 0.28);
          const tailY = bolt.sy + (bolt.ty - bolt.sy) * Math.max(0, bolt.progress - 0.28);

          // Render Laser Line Beam
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(bolt.cx, bolt.cy);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = bolt.color;
          ctx.lineWidth = bolt.type === 'hero' ? 4.5 : 3.2;
          ctx.lineCap = 'round';
          ctx.shadowColor = bolt.color;
          ctx.shadowBlur = bolt.type === 'hero' ? 18 : 12;
          ctx.stroke();

          // Laser Core Light
          ctx.beginPath();
          ctx.moveTo(bolt.cx, bolt.cy);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.8;
          ctx.stroke();
          ctx.restore();

          // 6. Impact Detection & UFO Explosion!
          if (bolt.progress >= 0.95 && !bolt.hitDone) {
            bolt.hitDone = true;

            if (bolt.type === 'hero' && bolt.targetUFO && bolt.targetUFO.isAlive) {
              // DETONATE UFO! 💥
              const destroyedUFO = bolt.targetUFO;
              destroyedUFO.isAlive = false;
              destroyedUFO.respawnAt = now + 3000; // Hold fire / respawn delay of EXACTLY 3 SECONDS!

              // Add Shockwave Explosion Ring
              shockwaves.push({
                x: destroyedUFO.x,
                y: destroyedUFO.y,
                radius: 10,
                maxRadius: 75,
                color: '#ff3300',
                lineWidth: 5,
                alpha: 1,
              });
              shockwaves.push({
                x: destroyedUFO.x,
                y: destroyedUFO.y,
                radius: 5,
                maxRadius: 50,
                color: '#ffe600',
                lineWidth: 3,
                alpha: 1,
              });

              // Add 30 Explosive Firework Spark Particles
              for (let s = 0; s < 32; s++) {
                const spAngle = Math.random() * Math.PI * 2;
                const spSpeed = Math.random() * 7 + 2.5;
                const pColor = Math.random() > 0.4 ? '#ff3300' : Math.random() > 0.5 ? '#ffe600' : '#ffffff';
                explosionParticles.push({
                  x: destroyedUFO.x,
                  y: destroyedUFO.y,
                  vx: Math.cos(spAngle) * spSpeed,
                  vy: Math.sin(spAngle) * spSpeed,
                  alpha: 1,
                  color: pColor,
                  size: Math.random() * 3.5 + 2,
                });
              }
            } else if (bolt.type === 'ufo') {
              // Minor Spark on Lead Vehicle Hit Shield
              for (let s = 0; s < 6; s++) {
                const spAngle = Math.random() * Math.PI * 2;
                const spSpeed = Math.random() * 4 + 1.5;
                explosionParticles.push({
                  x: bolt.tx,
                  y: bolt.ty,
                  vx: Math.cos(spAngle) * spSpeed,
                  vy: Math.sin(spAngle) * spSpeed,
                  alpha: 1,
                  color: bolt.color,
                  size: Math.random() * 2 + 1,
                });
              }
            }
          }
        });

        laserBolts = laserBolts.filter((b) => b.progress < 1.05);

        // 7. Render & Update Shockwave Expansion Rings
        shockwaves.forEach((sw) => {
          sw.radius += 2.8;
          sw.alpha -= 0.035;

          if (sw.alpha <= 0) return;

          ctx.save();
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = sw.color;
          ctx.lineWidth = sw.lineWidth;
          ctx.globalAlpha = Math.max(0, sw.alpha);
          ctx.shadowColor = sw.color;
          ctx.shadowBlur = 16;
          ctx.stroke();
          ctx.restore();
        });

        shockwaves = shockwaves.filter((sw) => sw.alpha > 0 && sw.radius < sw.maxRadius);

        // 8. Render & Update Explosion Particles
        explosionParticles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.alpha -= 0.03;

          if (p.alpha <= 0) return;

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        });

        explosionParticles = explosionParticles.filter((p) => p.alpha > 0);
      }

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
        opacity: 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      {/* Laser Combat Canvas Overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          width: '100vw',
          height: '100vh',
        }}
      />

      {/* Lead Orbit Vehicle */}
      <div
        ref={vehicleRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '160px',
          height: '240px',
          willChange: 'transform',
          filter: 'drop-shadow(0 0 16px rgba(0, 180, 216, 0.7)) drop-shadow(0 0 32px rgba(41, 212, 240, 0.45))',
        }}
      />

      {/* Chasing UFO 1 (Left Flank) */}
      <div
        ref={ufo1Ref}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '160px',
          height: '240px',
          willChange: 'transform, opacity',
          filter: 'drop-shadow(0 0 16px rgba(255, 0, 85, 0.85)) drop-shadow(0 0 28px rgba(255, 0, 85, 0.5))',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Chasing UFO 2 (Center Rear) */}
      <div
        ref={ufo2Ref}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '160px',
          height: '240px',
          willChange: 'transform, opacity',
          filter: 'drop-shadow(0 0 16px rgba(0, 255, 204, 0.85)) drop-shadow(0 0 28px rgba(0, 255, 204, 0.5))',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Chasing UFO 3 (Right Flank) */}
      <div
        ref={ufo3Ref}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '160px',
          height: '240px',
          willChange: 'transform, opacity',
          filter: 'drop-shadow(0 0 16px rgba(255, 204, 0, 0.85)) drop-shadow(0 0 28px rgba(255, 204, 0, 0.5))',
          transition: 'opacity 0.2s ease',
        }}
      />
    </div>
  );
}
