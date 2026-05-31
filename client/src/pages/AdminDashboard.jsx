import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseClient.js';
import SeoHead from '../components/SeoHead';

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || 'Yashwanth@100';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  in_progress: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [analytics, setAnalytics] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('pickups')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPickups(data || []);

      const stats = {
        total: data?.length || 0,
        pending: data?.filter((p) => p.status === 'pending').length || 0,
        completed: data?.filter((p) => p.status === 'completed').length || 0,
        inProgress: data?.filter((p) => p.status === 'in_progress').length || 0,
      };
      setAnalytics(stats);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated, fetchData]);

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Invalid PIN');
    }
  };

  const updateStatus = async (id, newStatus) => {
    const { error: updateError } = await supabase
      .from('pickups')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      setError('Failed to update status');
    } else {
      fetchData();
    }
  };

  const deletePickup = async (id) => {
    if (!window.confirm('Delete this pickup?')) return;
    const { error: deleteError } = await supabase
      .from('pickups')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError('Failed to delete');
    } else {
      fetchData();
    }
  };

  const filteredPickups = pickups
    .filter((p) => filter === 'all' || p.status === filter)
    .filter((p) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        p.customer_name?.toLowerCase().includes(q) ||
        p.customer_phone?.includes(q) ||
        p.pickup_address?.toLowerCase().includes(q)
      );
    });

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <SeoHead title="Admin Login - YourScrap" robots="noindex" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl glass w-full max-w-sm mx-4"
        >
          <img src="/scraplogo.png" alt="YourScrap" className="h-12 mx-auto mb-6" />
          <h1 className="text-xl font-bold text-white text-center mb-6">Admin Access</h1>
          <div className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin PIN"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-scrap-green/50 text-center"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl bg-scrap-green text-black font-semibold text-sm hover:shadow-glow-green transition-all"
            >
              Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <SeoHead title="Admin Dashboard - YourScrap" robots="noindex" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-slate-500">Manage scrap pickups</p>
          </div>
          <button
            onClick={() => setAuthenticated(false)}
            className="px-4 py-2 rounded-xl border border-white/[0.06] text-sm text-slate-400 hover:text-white transition-all"
          >
            Logout
          </button>
        </div>

        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total', value: analytics.total, color: 'from-blue-500 to-blue-600' },
              { label: 'Pending', value: analytics.pending, color: 'from-yellow-500 to-yellow-600' },
              { label: 'Active', value: analytics.inProgress, color: 'from-purple-500 to-purple-600' },
              { label: 'Completed', value: analytics.completed, color: 'from-green-500 to-green-600' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-2xl glass">
                <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === s
                    ? 'bg-scrap-green text-black'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, address..."
            className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-scrap-green/50 w-full sm:w-64"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading...</div>
        ) : filteredPickups.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No pickups found</div>
        ) : (
          <div className="space-y-3">
            {filteredPickups.map((pickup) => (
              <motion.div
                key={pickup.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 sm:p-6 rounded-2xl glass"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{pickup.customer_name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[pickup.status] || 'bg-slate-500/20 text-slate-400'}`}>
                        {pickup.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 space-y-0.5">
                      <p>📞 {pickup.customer_phone}</p>
                      <p>📍 {pickup.pickup_address}</p>
                      {pickup.preferred_date && <p>📅 {pickup.preferred_date} {pickup.preferred_time && `at ${pickup.preferred_time}`}</p>}
                      {pickup.items?.length > 0 && <p>📦 {pickup.items.map((i) => i.type || i).join(', ')}</p>}
                      {pickup.notes && <p>📝 {pickup.notes}</p>}
                    </div>
                    <p className="text-[10px] text-slate-700 mt-1">
                      {new Date(pickup.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <select
                      value={pickup.status}
                      onChange={(e) => updateStatus(pickup.id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-xs focus:outline-none focus:border-scrap-green/50"
                    >
                      <option value="pending" className="bg-black">Pending</option>
                      <option value="confirmed" className="bg-black">Confirmed</option>
                      <option value="in_progress" className="bg-black">In Progress</option>
                      <option value="completed" className="bg-black">Completed</option>
                      <option value="cancelled" className="bg-black">Cancelled</option>
                    </select>
                    <button
                      onClick={() => {
                        const msg = `Hi ${pickup.customer_name}! Your YourScrap pickup scheduled for ${pickup.preferred_date} at ${pickup.preferred_time} is ${pickup.status}. Need help? Reply here.`;
                        window.open(`https://wa.me/91${pickup.customer_phone}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-scrap-green/20 text-scrap-green text-xs font-medium hover:bg-scrap-green/30 transition-all"
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={() => deletePickup(pickup.id)}
                      className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
