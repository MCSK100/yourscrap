import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseClient.js';
import { getCurrentUser, logout } from '../services/auth.js';

const BRAND_NAME = 'YourScrap';

const LeafIcon = () => (
  <img src="/scraplogo.png" alt="YourScrap" className="w-[17rem]" />
);

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from('pickups')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setPickups(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const pendingCount = pickups.filter((p) => p.status === 'pending').length;
  const completedCount = pickups.filter((p) => p.status === 'completed').length;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <LeafIcon />
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-400 hover:text-white"
          >
            Logout
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-[#0a150a] border border-[#98FF98]/20"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="text-slate-400 mb-6">Manage your pickups and track progress.</p>
          <Link
            to="/book"
            className="inline-flex rounded-2xl bg-[#98FF98] px-6 py-3 text-sm font-semibold text-black hover:bg-[#7bdc78]"
          >
            Book New Pickup
          </Link>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-6 rounded-2xl bg-[#0a150a] border border-[#98FF98]/20">
            <p className="text-sm text-slate-400 mb-1">Total Pickups</p>
            <p className="text-2xl font-bold text-white">{pickups.length}</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0a150a] border border-[#98FF98]/20">
            <p className="text-sm text-slate-400 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0a150a] border border-[#98FF98]/20">
            <p className="text-sm text-slate-400 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-400">{completedCount}</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#0a150a] border border-[#98FF98]/20">
          <h2 className="text-xl font-semibold text-white mb-4">Your Pickups</h2>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : pickups.length === 0 ? (
            <p className="text-slate-400">No pickups yet. Book your first pickup!</p>
          ) : (
            <div className="space-y-3">
              {pickups.slice(0, 5).map((pickup) => (
                <div key={pickup.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div>
                    <p className="font-medium text-white capitalize">{pickup.category}</p>
                    <p className="text-sm text-slate-400">{pickup.estimated_weight} kg • {pickup.pickup_date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    pickup.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    pickup.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {pickup.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}