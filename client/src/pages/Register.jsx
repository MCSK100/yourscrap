import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { register } from '../services/auth.js';
import Toast from '../components/Toast.jsx';

const BRAND_NAME = 'YourScrap';

const LeafIcon = () => (
  <img src="/scraplogo.png" alt="YourScrap" className="w-[17rem]" />
);

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ message: '', type: 'success' });
    try {
      const user = await register({ fullName, email, phone, password, role: 'user' });
      setToast({ message: 'Registered successfully!', type: 'success' });
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      setToast({ message: error.message || 'Registration failed', type: 'error' });
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
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Start recycling with us</p>
        </div>

        <div className="p-8 rounded-3xl bg-[#0a150a] border border-[#98FF98]/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none"
                placeholder="Jane Doe"
              />
            </div>
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
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone (optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none"
                placeholder="9876543210"
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
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-500 text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#98FF98] hover:text-[#7bdc78]">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}