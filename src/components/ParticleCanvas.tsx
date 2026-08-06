import React, { useEffect, useRef } from 'react';

interface ParticleCanvasProps {
  enabled: boolean;
  themeMode?: 'dark' | 'light';
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ enabled, themeMode = 'dark' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // 鼠标坐标与斥力半径
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // 生成 65 个动态节点粒子
    const particles = Array.from({ length: 65 }, () => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2.2 + 1,
        alpha: Math.random() * 0.6 + 0.25
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = themeMode === 'dark';
      const particleColor = isDark ? '56, 189, 248' : '14, 165, 233'; // Sky blue in dark, slightly darker in light

      // 1. 绘制粒子之间以及粒子与鼠标之间的排斥/拉线
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // 鼠标互斥效果
        const dxMouse = mouse.x - p1.x;
        const dyMouse = mouse.y - p1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouse.radius) {
          const force = (mouse.radius - distMouse) / mouse.radius;
          const angle = Math.atan2(dyMouse, dxMouse);
          p1.x -= Math.cos(angle) * force * 3;
          p1.y -= Math.sin(angle) * force * 3;
        }

        // 粒子与鼠标连线
        if (distMouse < mouse.radius + 20) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${particleColor}, ${0.35 * (1 - distMouse / (mouse.radius + 20))})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // 粒子与粒子连线
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 135) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${particleColor}, ${0.2 * (1 - dist / 135)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 2. 移动与绘制粒子
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // 边缘碰撞反弹
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
        ctx.shadowBlur = isDark ? 10 : 0;
        ctx.shadowColor = `rgba(${particleColor}, 0.5)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, themeMode]);

  if (!enabled) return null;

  return (
    <canvas
      id="particleCanvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: themeMode === 'dark' ? 0.7 : 0.4 }}
    />
  );
};
