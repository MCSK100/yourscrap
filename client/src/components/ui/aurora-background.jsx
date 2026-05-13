import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function AuroraBackground({
  className = '',
  intensity = 1,
  enableMouseFollow = true,
}) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.4 });

  const cssVars = useMemo(() => {
    const x = clamp(mouse.x, 0, 1);
    const y = clamp(mouse.y, 0, 1);
    return {
      '--mx': `${x * 100}%`,
      '--my': `${y * 100}%`,
      '--ai': `${intensity}`,
    };
  }, [mouse.x, mouse.y, intensity]);

  useEffect(() => {
    if (!enableMouseFollow) return;

    let raf = 0;
    const onMove = (e) => {
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      const nx = e.clientX / vw;
      const ny = e.clientY / vh;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setMouse({ x: nx, y: ny }));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [enableMouseFollow]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={cssVars}
      aria-hidden="true"
    >
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_35%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.18)_45%,rgba(0,0,0,0.55)_100%)]" />

      {/* Center glow (breathes) */}
        <motion.div
          className="absolute left-1/2 top-[35%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(74,222,128,0.28), rgba(34,197,94,0.10) 35%, rgba(0,0,0,0) 62%)',
            filter: 'blur(18px)',
            opacity: 0.9,
          }}
          animate={{
            scale: [0.98, 1.03, 0.99],
            opacity: [0.82, 1, 0.86],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

      {/* Aurora blobs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -top-24 left-[-10%] h-[420px] w-[620px] rounded-full"
          style={{
            background:
              'radial-gradient(closest-side, rgba(34,197,94,0.35), rgba(34,197,94,0.10) 45%, rgba(0,0,0,0) 70%)',
            filter: 'blur(26px)',
            opacity: 0.95,
          }}
          animate={{
            x: [0, 60, 0],
            y: [0, 40, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute top-[-10%] right-[-15%] h-[520px] w-[520px] rounded-full"
          style={{
            background:
              'radial-gradient(closest-side, rgba(74,222,128,0.33), rgba(74,222,128,0.12) 45%, rgba(0,0,0,0) 70%)',
            filter: 'blur(28px)',
            opacity: 0.9,
          }}
          animate={{
            x: [0, -70, 0],
            y: [0, 35, 0],
            rotate: [0, -12, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />


        {/* Mouse-follow subtle beam */}
        <motion.div
          className="absolute left-[var(--mx)] top-[var(--my)] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.18), rgba(34,197,94,0.08) 30%, rgba(0,0,0,0) 60%)',
            filter: 'blur(22px)',
            opacity: 0.75,
          }}
          animate={{
            opacity: [0.55, 0.85, 0.6],
            scale: [0.98, 1.04, 0.99],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Soft grid / lines */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(74,222,128,0.20) 1px, rgba(0,0,0,0) 1px), linear-gradient(to bottom, rgba(74,222,128,0.16) 1px, rgba(0,0,0,0) 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(circle at 50% 35%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 35%, rgba(0,0,0,0) 70%)',
          WebkitMaskImage:
            'radial-gradient(circle at 50% 35%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 35%, rgba(0,0,0,0) 70%)',
        }}
      />

      {/* Moving streaks */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute left-[-30%] top-[20%] h-[140px] w-[160%]"
          style={{
            background:
              'linear-gradient(90deg, rgba(34,197,94,0) 0%, rgba(74,222,128,0.20) 35%, rgba(34,197,94,0) 70%)',
            filter: 'blur(8px)',
            opacity: 0.55,
          }}
          animate={{ x: ['-10%', '12%', '-10%'], rotate: ['-8deg', '0deg', '-8deg'] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute left-[-25%] top-[55%] h-[120px] w-[150%]"
          style={{
            background:
              'linear-gradient(90deg, rgba(16,185,129,0) 0%, rgba(34,197,94,0.16) 40%, rgba(16,185,129,0) 75%)',
            filter: 'blur(10px)',
            opacity: 0.45,
          }}
          animate={{ x: ['10%', '-18%', '10%'], rotate: ['6deg', '0deg', '6deg'] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 opacity-60">
        {[...Array(14)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#4ade80]"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              left: `${(i * 7) % 100}%`,
              top: `${(i * 13 + 18) % 100}%`,
              boxShadow: '0 0 10px rgba(74,222,128,0.35)',
              opacity: 0.25,
            }}
            animate={{
              y: [0, -18 - (i % 4) * 4, 0],
              opacity: [0.12, 0.5, 0.18],
              scale: [0.9, 1.15, 0.95],
            }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              delay: i * 0.25,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(" +
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E" +
            ")",
          backgroundSize: '160px 160px',
        }}
      />
    </div>
  );
}

