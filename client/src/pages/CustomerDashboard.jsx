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
  { value: 'iron', label: 'Iron & Steel', icon: '🔩' },
  { value: 'copper', label: 'Copper', icon: '🔌' },
  { value: 'aluminum', label: 'Aluminum', icon: '⚙️' },
  { value: 'brass', label: 'Brass', icon: '🎺' },
  { value: 'plastic', label: 'Plastic', icon: '🧴' },
  { value: 'paper', label: 'Paper & Cardboard', icon: '📰' },
  { value: 'ewaste', label: 'E-Waste', icon: '💻' },
  { value: 'other', label: 'Other', icon: '📦' },
];

const COINS_PER_PICKUP = 10;

const initialForm = {
  fullName: '',
  selectedCategories: [],
  otherCategory: '',
  item_name: '',
  weight_kg: '',
  pickup_address: '',
  notes: '',
};

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [pickups, setPickups] = useState([]);
  const [coinBalance, setCoinBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setForm((prev) => ({ ...prev, fullName: user?.fullName || '' }));
    fetchPickups();
    fetchCoins();
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

  const fetchCoins = async () => {
    if (!user?.id) return;
    const { data: profile } = await supabase
      .from('profiles')
      .select('coins')
      .eq('user_id', user.id)
      .single();
    if (profile) setCoinBalance(profile.coins || 0);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (value) => {
    setForm((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(value)
        ? prev.selectedCategories.filter((c) => c !== value)
        : [...prev.selectedCategories, value],
    }));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }
    setGeolocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await res.json();
          handleChange('pickup_address', data.display_name || `${latitude}, ${longitude}`);
        } catch {
          handleChange('pickup_address', `${latitude}, ${longitude}`);
        }
        setGeolocating(false);
      },
      () => {
        setError('Could not detect location. Please enter manually.');
        setGeolocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.fullName.trim()) { setError('Please enter your name.'); return; }
    if (form.selectedCategories.length === 0) { setError('Please select at least one category.'); return; }
    if (!form.pickup_address.trim()) { setError('Please enter your pickup address.'); return; }

    setSubmitting(true);
    try {
      const categories = form.selectedCategories.includes('other')
        ? [...form.selectedCategories.filter((c) => c !== 'other'), `other:${form.otherCategory || 'misc'}`]
        : form.selectedCategories;

      const payload = {
        user_id: user.id,
        category: categories[0],
        categories: JSON.stringify(categories),
        item_name: form.item_name || categories.join(', '),
        estimated_weight: Number(form.weight_kg) || null,
        pickup_address: form.pickup_address,
        notes: form.notes || null,
        status: 'pending',
        coins_earned: 0,
        pickup_date: new Date().toISOString().slice(0, 10),
        created_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase.from('pickups').insert([payload]);
      if (insertError) throw insertError;

      const earnedText = `+${COINS_PER_PICKUP} coins on completion`;
      setSuccess(`Pickup booked successfully! ${earnedText}`);
      setForm((prev) => ({ ...initialForm, fullName: prev.fullName }));
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Welcome, {form.fullName || 'User'}!</h1>
              <p className="text-slate-400 text-sm">Book a pickup and earn rewards.</p>
            </div>
            <div className="shrink-0 px-4 py-3 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 text-center">
              <p className="text-xs text-yellow-400 font-medium">Your Coins</p>
              <p className="text-2xl font-bold text-yellow-400">{coinBalance}</p>
              <p className="text-[10px] text-yellow-500/70">{COINS_PER_PICKUP} coins per pickup</p>
            </div>
          </div>
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
          <h2 className="text-xl font-bold text-white mb-1">Book a Pickup</h2>
          <p className="text-slate-400 text-sm mb-6">Earn <span className="text-yellow-400 font-semibold">{COINS_PER_PICKUP} coins</span> on every completed pickup. Redeem them for cashback on future bookings!</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
              <input value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} required placeholder="Enter your name" className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none placeholder:text-slate-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Select Categories <span className="text-slate-500 font-normal">(pick all that apply)</span></label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categoryOptions.map((opt) => {
                  const selected = form.selectedCategories.includes(opt.value);
                  return (
                    <button key={opt.value} type="button" onClick={() => toggleCategory(opt.value)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-medium transition-all ${
                        selected ? 'border-[#98FF98] bg-[#98FF98]/10 text-[#98FF98]' : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              {form.selectedCategories.includes('other') && (
                <input value={form.otherCategory} onChange={(e) => handleChange('otherCategory', e.target.value)} placeholder="Describe other scrap type" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white focus:border-[#98FF98] focus:outline-none placeholder:text-slate-500" />
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Weight (kg) — optional</label>
                <input type="number" value={form.weight_kg} onChange={(e) => handleChange('weight_kg', e.target.value)} placeholder="e.g. 5" min="0" className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none placeholder:text-slate-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Items Description</label>
                <input value={form.item_name} onChange={(e) => handleChange('item_name', e.target.value)} placeholder="e.g. Old newspapers, wires" className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none placeholder:text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Pickup Address</label>
              <div className="flex gap-2">
                <input value={form.pickup_address} onChange={(e) => handleChange('pickup_address', e.target.value)} required placeholder="Full address for pickup" className="flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none placeholder:text-slate-500" />
                <button type="button" onClick={detectLocation} disabled={geolocating} className="shrink-0 px-4 rounded-2xl bg-[#98FF98]/10 border border-[#98FF98]/30 text-[#98FF98] text-sm font-medium hover:bg-[#98FF98]/20 transition-colors disabled:opacity-50">
                  {geolocating ? 'Detecting...' : '📍 Locate'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Notes (optional)</label>
              <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={2} placeholder="Any special instructions" className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none placeholder:text-slate-500 resize-none" />
            </div>

            {error && <p className="text-sm text-red-400 bg-red-900/20 p-3 rounded-xl">{error}</p>}
            {success && <p className="text-sm text-[#98FF98] bg-[#98FF98]/10 p-3 rounded-xl">{success}</p>}

            <button type="submit" disabled={submitting || form.selectedCategories.length === 0} className="w-full rounded-2xl bg-gradient-to-r from-[#98FF98] to-[#B2AC88] px-5 py-3.5 text-sm font-semibold text-black hover:opacity-90 transition-all disabled:opacity-50">
              {submitting ? 'Booking...' : `Book Pickup ${form.selectedCategories.length > 0 ? `(${form.selectedCategories.length} items)` : ''}`}
            </button>
          </form>
        </motion.div>

        <div className="p-6 rounded-3xl bg-[#0a150a] border border-[#98FF98]/20">
          <h2 className="text-xl font-semibold text-white mb-4">Your Bookings</h2>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : pickups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-2">No bookings yet.</p>
              <p className="text-sm text-slate-500">Book your first pickup above and earn {COINS_PER_PICKUP} coins!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pickups.map((pickup) => {
                const categories = pickup.categories ? JSON.parse(pickup.categories) : [pickup.category];
                return (
                  <div key={pickup.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="min-w-0 flex-1 mr-4">
                      <div className="flex flex-wrap gap-1.5 mb-1">
                        {categories.map((cat) => {
                          const opt = categoryOptions.find((o) => o.value === cat.split(':')[0]);
                          return opt ? (
                            <span key={cat} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-300">
                              {opt.icon} {opt.label}
                            </span>
                          ) : (
                            <span key={cat} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-300">📦 {cat.split(':')[1] || cat}</span>
                          );
                        })}
                      </div>
                      <p className="text-sm text-slate-400 truncate">{pickup.pickup_address}{pickup.estimated_weight ? ` • ${pickup.estimated_weight} kg` : ''}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{new Date(pickup.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        pickup.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        pickup.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                        pickup.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {pickup.status}
                      </span>
                      {pickup.coins_earned > 0 && (
                        <span className="text-xs text-yellow-400">+{pickup.coins_earned} coins</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {coinBalance > 0 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="p-5 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 text-center">
            <p className="text-yellow-400 font-semibold">You have {coinBalance} coins!</p>
            <p className="text-xs text-slate-400 mt-1">Use them for cashback on your next booking. More features coming soon.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
