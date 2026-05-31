import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function formatValue(value, suffix) {
  if (suffix === '%') return `${Math.round(value)}${suffix}`;
  if (value >= 1000) return `${Math.round(value / 1000)}K+`;
  return `${Math.round(value)}${suffix || '+'}`;
}

export default function AnimatedCounter({ end, suffix = '+', label, duration = 2, prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationId;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / (duration * 1000);
      const progress = Math.min(elapsed, 1);
      const easedProgress = easeOutQuart(progress);

      setCount(easedProgress * end);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-scrap-green to-scrap-gold bg-clip-text text-transparent">
          {prefix}{formatValue(count, suffix)}
        </div>
        <div className="text-xs sm:text-sm text-slate-500 mt-1">{label}</div>
      </motion.div>
    </div>
  );
}
