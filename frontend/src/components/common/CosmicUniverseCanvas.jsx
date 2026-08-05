import React, { useEffect, useRef } from 'react';

export default function CosmicUniverseCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let rafId;
    let stars = [];
    let meteors = [];
    let comets = [];
    let lastMeteorSpawn = 0;
    let lastCometSpawn = 0;

    function initStars() {
      stars = Array.from({ length: 320 }, () => {
        const colors = ['#ffffff', '#88e7ff', '#ffeaa7', '#a29bfe', '#29d4f0', '#fd79a8'];
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.6 + 0.4,
          alpha: Math.random(),
          dAlpha: (Math.random() - 0.5) * 0.015,
          color: colors[Math.floor(Math.random() * colors.length)],
          isCrossStar: Math.random() > 0.92,
        };
      });
    }

    function spawnMeteor() {
      const startX = Math.random() * width * 1.2 - width * 0.1;
      const startY = Math.random() * height * 0.4 - height * 0.1;
      const length = Math.random() * 140 + 90;
      const speed = Math.random() * 9 + 11;
      const angle = (Math.PI / 180) * (Math.random() * 20 + 35);

      meteors.push({
        x: startX,
        y: startY,
        length,
        speed,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        alpha: 1,
        width: Math.random() * 1.8 + 1.2,
      });
    }

    function spawnComet() {
      const startX = Math.random() * width * 0.5 - 100;
      const startY = Math.random() * height * 0.2;
      const speed = Math.random() * 2.5 + 2.5;
      const angle = (Math.PI / 180) * (Math.random() * 15 + 25);

      comets.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length: Math.random() * 200 + 170,
        radius: Math.random() * 3.5 + 3.5,
        alpha: 1,
      });
    }

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    }

    function drawNebulae() {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#04050d');
      bgGrad.addColorStop(0.5, '#060919');
      bgGrad.addColorStop(1, '#03040a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const neb1 = ctx.createRadialGradient(
        width * 0.25,
        height * 0.3,
        20,
        width * 0.25,
        height * 0.3,
        width * 0.45
      );
      neb1.addColorStop(0, 'rgba(0, 180, 216, 0.14)');
      neb1.addColorStop(0.5, 'rgba(15, 76, 129, 0.07)');
      neb1.addColorStop(1, 'transparent');
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, width, height);

      const neb2 = ctx.createRadialGradient(
        width * 0.8,
        height * 0.65,
        40,
        width * 0.8,
        height * 0.65,
        width * 0.5
      );
      neb2.addColorStop(0, 'rgba(114, 9, 183, 0.16)');
      neb2.addColorStop(0.6, 'rgba(67, 97, 238, 0.06)');
      neb2.addColorStop(1, 'transparent');
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, width, height);
    }

    function drawStars() {
      stars.forEach((s) => {
        s.alpha += s.dAlpha;
        if (s.alpha < 0.15 || s.alpha > 0.95) s.dAlpha *= -1;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.fill();

        if (s.isCrossStar && s.alpha > 0.6) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(s.x - s.r * 3.5, s.y);
          ctx.lineTo(s.x + s.r * 3.5, s.y);
          ctx.moveTo(s.x, s.y - s.r * 3.5);
          ctx.lineTo(s.x, s.y + s.r * 3.5);
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;
    }

    function drawMeteors(now) {
      if (now - lastMeteorSpawn > 1400 && Math.random() < 0.65) {
        lastMeteorSpawn = now;
        spawnMeteor();
      }

      meteors.forEach((m) => {
        m.x += m.dx;
        m.y += m.dy;
        m.alpha -= 0.012;

        if (m.alpha <= 0) return;

        const tailX = m.x - m.dx * (m.length / m.speed);
        const tailY = m.y - m.dy * (m.length / m.speed);

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
        grad.addColorStop(0.3, `rgba(41, 212, 240, ${m.alpha * 0.85})`);
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.width;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.width * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
        ctx.fill();
      });

      meteors = meteors.filter((m) => m.alpha > 0 && m.x < width * 1.3 && m.y < height * 1.3);
    }

    function drawComets(now) {
      if (now - lastCometSpawn > 7000 && Math.random() < 0.6) {
        lastCometSpawn = now;
        spawnComet();
      }

      comets.forEach((c) => {
        c.x += c.dx;
        c.y += c.dy;
        c.alpha -= 0.003;

        if (c.alpha <= 0) return;

        const tailX = c.x - c.dx * (c.length / c.speed);
        const tailY = c.y - c.dy * (c.length / c.speed);

        const tailGrad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
        tailGrad.addColorStop(0, `rgba(255, 255, 255, ${c.alpha * 0.95})`);
        tailGrad.addColorStop(0.2, `rgba(0, 212, 255, ${c.alpha * 0.75})`);
        tailGrad.addColorStop(0.6, `rgba(138, 43, 226, ${c.alpha * 0.4})`);
        tailGrad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = c.radius * 2.2;
        ctx.lineCap = 'round';
        ctx.stroke();

        const headGlow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.radius * 3.2);
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${c.alpha})`);
        headGlow.addColorStop(0.4, `rgba(41, 212, 240, ${c.alpha * 0.85})`);
        headGlow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = headGlow;
        ctx.fill();
      });

      comets = comets.filter((c) => c.alpha > 0 && c.x < width * 1.4 && c.y < height * 1.4);
    }

    function render(now) {
      ctx.clearRect(0, 0, width, height);
      drawNebulae();
      drawStars();
      drawMeteors(now);
      drawComets(now);

      rafId = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener('resize', resize);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}
