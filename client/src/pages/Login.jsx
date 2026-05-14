import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../services/auth.js';

import Toast from '../components/Toast.jsx';

const BRAND_NAME = 'YourScrap';

const LeafIcon = () => (
  <img src="/scraplogo.png" alt="YourScrap" className="w-[17rem]" />
);

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ message: '', type: 'success' });
    try {
      const user = await login({ email, password });
      setToast({ message: 'Login successful!', type: 'success' });
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      setToast({ message: error.message || 'Login failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <LeafIcon />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Login to manage your pickups</p>
        </div>

        <div className="p-8 rounded-3xl bg-[#0a150a] border border-[#98FF98]/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-[#98FF98] to-[#B2AC88] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>
          <p className="mt-6 text-sm text-slate-500 text-center">
            New here?{' '}
            <Link to="/register" className="font-semibold text-[#98FF98] hover:text-[#7bdc78]">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}