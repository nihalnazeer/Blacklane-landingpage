'use client';

import React, { useRef, useEffect, useState } from 'react';

const Hero: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [textVisible, setTextVisible] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    setTimeout(() => setTextVisible(true), 1500);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const ribbonCount = 3;

      for (let i = 0; i < ribbonCount; i++) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const colorShift = Math.sin(time * 0.0075) * 20;
        gradient.addColorStop(0, `rgba(${255 + colorShift}, ${255 + colorShift}, ${255 + colorShift}, ${0.4 - i * 0.12})`);
        gradient.addColorStop(0.2, `rgba(${230 + colorShift}, ${230 + colorShift}, ${230 + colorShift}, ${0.35 - i * 0.1})`);
        gradient.addColorStop(0.5, `rgba(${180 + colorShift}, ${180 + colorShift}, ${180 + colorShift}, ${0.3 - i * 0.09})`);
        gradient.addColorStop(0.8, `rgba(${120 + colorShift}, ${120 + colorShift}, ${120 + colorShift}, ${0.25 - i * 0.08})`);
        gradient.addColorStop(1, `rgba(${80 + colorShift}, ${80 + colorShift}, ${80 + colorShift}, ${0.2 - i * 0.07})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.12 - i * 0.03})`;

        const points: { x: number; y: number }[] = [];
        const segments = 100;
        const radius = 200 + i * 50;
        const heightVariation = 100 + i * 30;

        for (let j = 0; j <= segments; j++) {
          const angle = (j / segments) * Math.PI * 4 + time * 0.0075 + i * 0.5;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle * 2 + time * 0.015) * heightVariation + Math.sin(time * 0.0075 + i) * 50;
          points.push({ x, y });
        }

        if (points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let j = 1; j < points.length - 2; j++) {
            const cp1x = (points[j].x + points[j + 1].x) / 2;
            const cp1y = (points[j].y + points[j + 1].y) / 2;
            const cp2x = (points[j + 1].x + points[j + 2].x) / 2;
            const cp2y = (points[j + 1].y + points[j + 2].y) / 2;
            ctx.quadraticCurveTo(points[j + 1].x, points[j + 1].y, cp2x, cp2y);
          }
          ctx.stroke();

          ctx.shadowBlur = 20;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      time += 0.75;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="hero relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black text-white">
      <div className="hero-text relative z-20 px-4 py-16 text-center max-w-4xl mx-auto">
        <div
          className={`transition-all duration-1500 ease-out ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text leading-tight tracking-tight animate-moving-shade"
            style={{
              backgroundImage: `linear-gradient(
                ${mousePos.x / (typeof window !== 'undefined' ? window.innerWidth : 1000) * 360}deg,
                rgba(255, 255, 255, 0.9),
                rgba(180, 180, 180, 0.7) 50%,
                rgba(80, 80, 80, 0.5)
              )`,
              animation: 'movingShade 4s ease-in-out infinite',
            }}
          >
            Data Complexity to Intelligent
            <br />
            <span className="font-bold">Solutions.</span>
          </h1>
        </div>
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 z-10" />

      <div className="absolute inset-0 z-0">{children}</div>

      <style>{`
        @keyframes movingShade {
          0% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 10px rgba(200, 200, 200, 0.2);
          }
          50% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3), -2px -2px 10px rgba(200, 200, 200, 0.2);
          }
          100% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 10px rgba(200, 200, 200, 0.2);
          }
        }
        .animate-moving-shade {
          animation: movingShade 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;