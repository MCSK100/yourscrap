import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { applySessionUserToStorage } from '../services/auth.js';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        await applySessionUserToStorage();
        if (cancelled) return;

        const raw = localStorage.getItem('eco-scrap-user');
        const user = raw ? JSON.parse(raw) : null;

        if (!user) {
          navigate('/login', { replace: true });
          return;
        }

        navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
      } catch (e) {
        if (cancelled) return;
        navigate('/login', { replace: true });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="text-white text-xl font-semibold mb-2">Signing you in…</div>
        <div className="text-slate-400 text-sm">Please wait.</div>
      </motion.div>
    </div>
  );
}

