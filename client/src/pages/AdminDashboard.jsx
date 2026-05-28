import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseClient.js';

const BRAND_NAME = 'YourScrap';
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN;

const statusColors = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  confirmed: 'text-blue-400 bg-blue-400/10',
  in_progress: 'text-purple-400 bg-purple-400/10',
  completed: 'text-green-400 bg-green-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
};

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('pickups');

  useEffect(() => {
    const stored = sessionStorage.getItem('admin-authenticated');
    if (stored === 'true') {
      setAuthenticated(true);
      fetchPickups();
    } else {
      setLoading(false);
    }
  }, []);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setAuthenticated(true);
      sessionStorage.setItem('admin-authenticated', 'true');
      fetchPickups();
    } else {
      setPinError('Invalid PIN');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-authenticated');
    setAuthenticated(false);
    setPinInput('');
  };

  const fetchPickups = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('pickups')
      .select('*')
      .order('created_at', { ascending: false });
    setPickups(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    await supabase.from('pickups').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
    fetchPickups();
  };

  const deletePickup = async (id) => {
    if (!confirm('Delete this pickup?')) return;
    await supabase.from('pickups').delete().eq('id', id);
    fetchPickups();
  };

  const filtered = pickups.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || p.customer_name?.toLowerCase().includes(q) || p.customer_phone?.includes(q) || p.pickup_address?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm p-8 rounded-3xl bg-[#0a150a] border border-[#98FF98]/20">
          <div className="text-center mb-6">
            <img src="/scraplogo.png" alt="YourScrap" className="w-24 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-1">Admin Access</h1>
            <p className="text-sm text-slate-400">Enter the admin PIN to continue</p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white text-center text-lg tracking-widest focus:border-[#98FF98] focus:outline-none"
              placeholder="••••••" autoFocus />
            {pinError && <p className="text-sm text-red-400 text-center">{pinError}</p>}
            <button type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-[#98FF98] to-[#B2AC88] px-5 py-3 text-sm font-semibold text-black hover:opacity-90 transition-all">
              Unlock
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const pendingCount = pickups.filter((p) => p.status === 'pending').length;
  const totalCount = pickups.length;

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src="/scraplogo.png" alt="YourScrap" className="w-16 md:w-20" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {BRAND_NAME} <span className="text-[#98FF98]">Admin</span>
              </h1>
              <p className="text-slate-400 text-sm">Coimbatore, Tamilnadu</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-[#98FF98]/10 border border-[#98FF98]/20 text-[#98FF98] text-sm">
              {pendingCount} pending / {totalCount} total
            </div>
            <button onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-[#98FF98] text-black text-sm font-semibold hover:bg-[#7bdc78] transition-colors">
              Logout
            </button>
          </div>
        </motion.div>

        <div className="flex gap-2 border-b border-slate-800">
          <button onClick={() => setActiveTab('pickups')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'pickups' ? 'text-[#98FF98] border-b-2 border-[#98FF98]' : 'text-slate-400 hover:text-white'}`}>
            Pickups
          </button>
        </div>

        {activeTab === 'pickups' && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-[#0a150a] border border-[#98FF98]/20 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <input value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, phone, or address..."
                    className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white text-sm placeholder:text-slate-500 w-full sm:w-72" />
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white text-sm">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button onClick={fetchPickups}
                  className="p-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                </button>
              </div>
            </motion.div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-2 border-[#98FF98] border-t-transparent rounded-full" />
              </div>
            ) : filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-20 text-slate-500">
                <p>No pickups found</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {filtered.map((pickup, i) => (
                  <motion.div key={pickup.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="p-4 md:p-5 rounded-2xl bg-[#0a150a] border border-slate-800 hover:border-[#98FF98]/20 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-semibold text-white">{pickup.customer_name}</h3>
                            <a href={`tel:${pickup.customer_phone}`} className="text-sm text-[#98FF98] hover:underline">{pickup.customer_phone}</a>
                          </div>
                          <select value={pickup.status} onChange={(e) => updateStatus(pickup.id, e.target.value)}
                            className={`text-xs rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 ${statusColors[pickup.status]?.split(' ')[0] || 'text-white'}`}>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div className="text-sm text-slate-400 space-y-1">
                          <p className="flex items-start gap-2">
                            <span className="shrink-0 mt-0.5">📍</span>
                            <span>{pickup.pickup_address}</span>
                          </p>
                          {pickup.preferred_date && (
                            <p className="flex items-center gap-2">
                              <span>📅</span>
                              <span>{pickup.preferred_date} {pickup.preferred_time ? `• ${pickup.preferred_time}` : ''}</span>
                            </p>
                          )}
                        </div>

                        {pickup.items && pickup.items.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {pickup.items.map((item, idx) => (
                              <span key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-xs text-slate-300">
                                {item.name} {item.weight_kg ? `(${item.weight_kg} kg)` : ''}
                              </span>
                            ))}
                          </div>
                        )}

                        {pickup.notes && (
                          <p className="text-xs text-slate-500 italic">📝 {pickup.notes}</p>
                        )}
                      </div>

                      <div className="flex lg:flex-col gap-2 lg:shrink-0">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[pickup.status] || 'bg-slate-800 text-slate-400'}`}>
                          {pickup.status}
                        </span>
                        <button onClick={() => deletePickup(pickup.id)}
                          className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
