import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, MapPin, Calendar, Package, CheckCircle, Clock, RefreshCw, User, Phone } from 'lucide-react';
import { supabase } from '../services/supabaseClient.js';
import { getCurrentUser, logout } from '../services/auth.js';

const BRAND_NAME = 'YourScrap';

const statusConfig = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
  in_progress: { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: RefreshCw },
  completed: { label: 'Completed', color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [pickups, setPickups] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('pickups')
      .select('*')
      .order('pickup_date', { ascending: true })
      .order('created_at', { ascending: false });
    setPickups(data || []);

    const userIds = [...new Set((data || []).map((p) => p.user_id).filter(Boolean))];
    if (userIds.length > 0) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_id, full_name, phone, email, coins')
        .in('user_id', userIds);
      const profileMap = {};
      (profileData || []).forEach((p) => { profileMap[p.user_id] = p; });
      setProfiles(profileMap);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const updateStatus = async (id, newStatus, userId) => {
    await supabase.from('pickups').update({ status: newStatus }).eq('id', id);
    if (newStatus === 'completed' && userId && userId !== 'admin') {
      const COINS = 10;
      const { data: profile } = await supabase.from('profiles').select('coins').eq('user_id', userId).single();
      const currentCoins = profile?.coins || 0;
      await supabase.from('profiles').update({ coins: currentCoins + COINS }).eq('user_id', userId);
      await supabase.from('pickups').update({ coins_earned: COINS }).eq('id', id);
      await supabase.from('reward_transactions').insert({
        user_id: userId, amount: COINS, type: 'earned', description: 'Pickup completed', pickup_id: id,
      });
    }
    fetchPickups();
  };

  const filtered = pickups.filter((p) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      p.category?.toLowerCase().includes(q) ||
      (p.pickup_date ?? '').toString().includes(q);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const pendingCount = pickups.filter((p) => p.status === 'pending').length;
  const todayPickups = pickups.filter(
    (p) =>
      p.status === 'pending' &&
      p.pickup_date === new Date().toISOString().slice(0, 10)
  );

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <img src="/scraplogo.png" alt="YourScrap" className="w-16 md:w-20" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                {BRAND_NAME} <span className="text-[#98FF98]">Admin</span>
              </h1>
              <p className="text-slate-400">
                Manage weekend pickups and plan your route
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-[#98FF98]/10 border border-[#98FF98]/20 text-[#98FF98]">
              {pendingCount} pending
            </div>
            {todayPickups.length > 0 && (
              <div className="px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                {todayPickups.length} today
              </div>
            )}
            <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-[#98FF98] text-black text-sm font-semibold hover:bg-[#7bdc78] transition-colors">
              Logout
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-4"
        >
          <div className="p-4 rounded-2xl bg-[#0a150a] border border-[#98FF98]/20">
            <div className="flex items-center gap-2 text-[#98FF98] mb-1">
              <Clock size={16} />
              <span className="text-xs uppercase tracking-wider">Pending</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {pickups.filter((p) => p.status === 'pending').length}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#0a150a] border border-[#98FF98]/20">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <RefreshCw size={16} />
              <span className="text-xs uppercase tracking-wider">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {pickups.filter((p) => p.status === 'in_progress').length}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#0a150a] border border-[#98FF98]/20">
            <div className="flex items-center gap-2 text-green-400 mb-1">
              <CheckCircle size={16} />
              <span className="text-xs uppercase tracking-wider">Completed</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {pickups.filter((p) => p.status === 'completed').length}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#0a150a] border border-[#98FF98]/20">
            <div className="flex items-center gap-2 text-[#B2AC88] mb-1">
              <Truck size={16} />
              <span className="text-xs uppercase tracking-wider">Total</span>
            </div>
            <p className="text-2xl font-bold text-white">{pickups.length}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-[#0a150a] border border-[#98FF98]/20 p-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by category or date..."
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white text-sm placeholder:text-slate-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button
              onClick={fetchPickups}
              className="p-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-[#98FF98] border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-slate-500"
          >
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p>No pickups found</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((pickup, i) => {
              const StatusIcon = statusConfig[pickup.status]?.icon || Clock;
              return (
                <motion.div
                  key={pickup.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative p-5 rounded-2xl bg-[#0a150a] border border-slate-800 hover:border-[#98FF98]/30 transition-colorsgroup"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          pickup.status === 'pending'
                            ? 'bg-yellow-400'
                            : pickup.status === 'in_progress'
                            ? 'bg-blue-400'
                            : 'bg-green-400'
                        }`}
                      />
                      <span className="text-xs text-slate-500 font-mono">
                        {pickup.id?.slice(0, 8)}
                      </span>
                    </div>
                    <select
                      value={pickup.status}
                      onChange={(e) => updateStatus(pickup.id, e.target.value, pickup.user_id)}
                      className="text-xs rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 capitalize">
                    {pickup.category}
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Package size={14} />
                      <span>{pickup.weight_kg} kg</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#98FF98]">
                      <Calendar size={14} />
                      <span className="font-medium">
                        {pickup.pickup_date
                          ? new Date(pickup.pickup_date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })
                          : 'No date'}
                      </span>
                    </div>
                    {pickup.user_id && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin size={14} />
                        <span className="truncate text-xs">{pickup.user_id}</span>
                      </div>
                    )}
                    {pickup.pickup_address && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin size={14} />
                        <span className="truncate text-xs">{pickup.pickup_address}</span>
                      </div>
                    )}
                  </div>

                  {profiles[pickup.user_id] && (
                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-1">
                      <div className="flex items-center gap-2 text-slate-300 text-xs">
                        <User size={12} />
                        <span>{profiles[pickup.user_id].full_name || 'Unknown'}</span>
                      </div>
                      {profiles[pickup.user_id].phone && (
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <Phone size={12} />
                          <span>{profiles[pickup.user_id].phone}</span>
                        </div>
                      )}
                      {profiles[pickup.user_id].coins > 0 && (
                        <div className="text-yellow-500 text-xs">🪙 {profiles[pickup.user_id].coins} coins</div>
                      )}
                    </div>
                  )}

                  {pickup.image_url && (
                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <img
                        src={pickup.image_url}
                        alt="Scrap"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {pickup.coins_earned > 0 && (
                    <div className="mt-2 text-xs text-yellow-400">+{pickup.coins_earned} coins earned</div>
                  )}

                  <div className="mt-3 pt-3 border-t border-slate-800 flex gap-2">
                    <button
                      onClick={() => updateStatus(pickup.id, 'completed', pickup.user_id)}
                      className="flex-1 py-2 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() =>
                        updateStatus(
                          pickup.id,
                          pickup.status === 'pending'
                            ? 'in_progress'
                            : 'pending',
                          pickup.user_id
                        )
                      }
                      className="flex-1 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors"
                    >
                      {pickup.status === 'pending' ? 'Start' : 'Hold'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}