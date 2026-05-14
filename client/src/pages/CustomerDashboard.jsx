import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseClient.js';
import { getCurrentUser, logout } from '../services/auth.js';

const BRAND_NAME = 'YourScrap';

const LeafIcon = () => (
  <img src="/scraplogo.png" alt="YourScrap" className="w-[17rem]" />
);

const categoryOptions = [
  { value: 'iron', label: 'Iron & Steel' },
  { value: 'copper', label: 'Copper' },
  { value: 'aluminum', label: 'Aluminum' },
  { value: 'brass', label: 'Brass' },
  { value: 'plastic', label: 'Plastic' },
  { value: 'paper', label: 'Paper & Cardboard' },
  { value: 'ewaste', label: 'E-Waste' },
  { value: 'other', label: 'Other' },
];

const initialForm = {
  category: 'iron',
  item_name: '',
  weight_kg: '',
  pickup_address: '',
  notes: '',
};

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.pickup_address) { setError('Please enter your pickup address.'); return; }
    if (!form.item_name) { setError('Please describe the items.'); return; }
    setSubmitting(true);
    try {
      const payload = {
        user_id: user.id,
        category: form.category,
        item_name: form.item_name,
        estimated_weight: Number(form.weight_kg) || null,
        pickup_address: form.pickup_address,
        notes: form.notes || null,
        status: 'pending',
        pickup_date: new Date().toISOString().slice(0, 10),
        created_at: new Date().toISOString(),
      };
      const { error: insertError } = await supabase.from('pickups').insert([payload]);
      if (insertError) throw insertError;
      setSuccess('Pickup booked successfully! We will contact you soon.');
      setForm(initialForm);
      fetchPickups();
    } catch (err) {
      setError(err?.message || 'Failed to book pickup.');
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = pickups.filter((p) => p.status === 'pending').length;
  const completedCount = pickups.filter((p) => p.status === 'completed').length;

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <LeafIcon />
          </Link>
          <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-[#98FF98] text-black text-sm font-semibold hover:bg-[#7bdc78] transition-colors">
            Logout
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 rounded-3xl bg-[#0a150a] border border-[#98FF98]/20">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Welcome, {user?.fullName || 'User'}!</h1>
          <p className="text-slate-400 text-sm">Book a pickup or track your existing requests.</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-5 rounded-2xl bg-[#0a150a] border border-[#98FF98]/20">
            <p className="text-xs text-slate-400 mb-1">Total Pickups</p>
            <p className="text-2xl font-bold text-white">{pickups.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0a150a] border border-[#98FF98]/20">
            <p className="text-xs text-slate-400 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0a150a] border border-[#98FF98]/20">
            <p className="text-xs text-slate-400 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-400">{completedCount}</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 md:p-8 rounded-3xl bg-[#0a150a] border border-[#98FF98]/20">
          <h2 className="text-xl font-bold text-white mb-6">Book a Pickup</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
              <input value={user?.fullName || ''} readOnly className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white/60 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Pickup Address</label>
              <input value={form.pickup_address} onChange={(e) => handleChange('pickup_address', e.target.value)} required placeholder="Full address for pickup" className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none placeholder:text-slate-500" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select value={form.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none">
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Weight (kg) — optional</label>
                <input type="number" value={form.weight_kg} onChange={(e) => handleChange('weight_kg', e.target.value)} placeholder="0.00" min="0" className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none placeholder:text-slate-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Items Description</label>
              <input value={form.item_name} onChange={(e) => handleChange('item_name', e.target.value)} required placeholder="e.g. Old newspapers, copper wires, plastic bottles" className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none placeholder:text-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Notes (optional)</label>
              <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={2} placeholder="Any special instructions" className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none placeholder:text-slate-500 resize-none" />
            </div>
            {error && <p className="text-sm text-red-400 bg-red-900/20 p-3 rounded-xl">{error}</p>}
            {success && <p className="text-sm text-[#98FF98] bg-[#98FF98]/10 p-3 rounded-xl">{success}</p>}
            <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-gradient-to-r from-[#98FF98] to-[#B2AC88] px-5 py-3 text-sm font-semibold text-black hover:opacity-90 transition-all disabled:opacity-50">
              {submitting ? 'Booking...' : 'Book Pickup'}
            </button>
          </form>
        </motion.div>

        <div className="p-6 rounded-3xl bg-[#0a150a] border border-[#98FF98]/20">
          <h2 className="text-xl font-semibold text-white mb-4">Your Bookings</h2>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : pickups.length === 0 ? (
            <p className="text-slate-400">No bookings yet. Fill the form above to book your first pickup!</p>
          ) : (
            <div className="space-y-3">
              {pickups.map((pickup) => (
                <div key={pickup.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="font-medium text-white capitalize truncate">{pickup.category}{pickup.item_name ? ` — ${pickup.item_name}` : ''}</p>
                    <p className="text-sm text-slate-400 truncate">{pickup.pickup_address}{pickup.estimated_weight ? ` • ${pickup.estimated_weight} kg` : ''}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{pickup.pickup_date}</p>
                  </div>
                  <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                    pickup.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    pickup.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                    pickup.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
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
