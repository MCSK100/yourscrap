import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Phone } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import SeoHead from '../components/SeoHead';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const WHATSAPP_NUMBER = '9080405581';

const scrapCategories = [
  { id: 'iron', label: 'Iron & Steel', icon: '🔩' },
  { id: 'copper', label: 'Copper', icon: '🔌' },
  { id: 'aluminum', label: 'Aluminum', icon: '⚙️' },
  { id: 'brass', label: 'Brass', icon: '🎺' },
  { id: 'plastic', label: 'Plastic', icon: '🧴' },
  { id: 'paper', label: 'Paper', icon: '📰' },
  { id: 'ewaste', label: 'E-Waste', icon: '💻' },
  { id: 'other', label: 'Other', icon: '📦' },
];

const timeSlots = [
  '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM',
];

const areas = [
  'Peelamedu', 'Gandhipuram', 'RS Puram', 'Singanallur',
  'Saravanampatti', 'Ukkadam', 'Vadavalli', 'Saibaba Colony',
  'Kuniyamuthur', 'Podanur', 'Other',
];

export default function BookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    address: '', area: '', landmark: '',
    items: [], notes: '',
    date: '', time: '',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleItem = (id) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.includes(id) ? prev.items.filter((i) => i !== id) : [...prev.items, id],
    }));
  };

  const canProceed = () => {
    if (step === 1) return form.name && form.phone && form.phone.length >= 10;
    if (step === 2) return form.items.length > 0 && form.address;
    if (step === 3) return form.date && form.time;
    return false;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email || undefined,
        pickup_address: `${form.address}, ${form.area}${form.landmark ? `, near ${form.landmark}` : ''}`,
        items: form.items.map((id) => {
          const cat = scrapCategories.find((c) => c.id === id);
          return cat ? { type: cat.label, icon: cat.icon } : { type: id };
        }),
        notes: form.notes || undefined,
        preferred_date: form.date,
        preferred_time: form.time,
      };

      const { error: insertError } = await supabase.from('pickups').insert(payload);
      if (insertError) throw insertError;

      const msg = `Hi YourScrap! I've booked a pickup.%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AAddress: ${form.address}, ${form.area}%0ADate: ${form.date}%0ATime: ${form.time}%0AItems: ${form.items.map((id) => scrapCategories.find((c) => c.id === id)?.label).join(', ')}`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');

      setSuccess(true);
    } catch {
      setError('Failed to submit. Please try again or contact us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-black min-h-screen">
        <SeoHead title="Booking Confirmed - YourScrap" canonical="/book" />
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-scrap-green/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-scrap-green" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Booking Confirmed!</h1>
            <p className="text-sm sm:text-base text-slate-400 mb-6">
              We've sent the details to your WhatsApp. Our team will arrive at {form.time} on {form.date}.
            </p>
            <p className="text-xs text-slate-500 mb-8">
              Need to reschedule? WhatsApp us at +91 {WHATSAPP_NUMBER}
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-full bg-scrap-green text-black font-semibold text-sm hover:shadow-glow-green transition-all"
            >
              Back to Home
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <SeoHead
        title="Book Free Scrap Pickup in Coimbatore - YourScrap"
        description="Schedule a free scrap pickup in Coimbatore. Select your items, choose a time slot, and get instant cash. Same-day pickup available."
        canonical="/book"
      />

      <Navbar />

      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-10"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              Book Free Scrap Pickup
            </h1>
            <p className="text-sm text-slate-500">Fill in your details and we'll be at your doorstep.</p>
          </motion.div>

          <div className="flex items-center justify-center gap-2 mb-8 sm:mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  s <= step ? 'bg-scrap-green text-black' : 'bg-white/[0.03] text-slate-600'
                }`}>
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && <div className={`w-12 sm:w-20 h-[2px] ${s < step ? 'bg-scrap-green' : 'bg-white/[0.06]'}`} />}
              </div>
            ))}
          </div>

          <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl glass">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-lg font-semibold text-white mb-6">Your Contact Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">Full Name *</label>
                      <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-scrap-green/50 transition-colors"
                        placeholder="Enter your name" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">Phone Number *</label>
                      <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-scrap-green/50 transition-colors"
                        placeholder="10-digit phone number" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">Email (optional)</label>
                      <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-scrap-green/50 transition-colors"
                        placeholder="your@email.com" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-lg font-semibold text-white mb-4">What are you selling?</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mb-4">Select all the types of scrap you have.</p>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
                    {scrapCategories.map((cat) => {
                      const selected = form.items.includes(cat.id);
                      return (
                        <button key={cat.id} onClick={() => toggleItem(cat.id)}
                          className={`flex items-center gap-2 p-3 sm:p-4 rounded-xl text-sm transition-all ${
                            selected
                              ? 'bg-scrap-green/20 border border-scrap-green/50 text-white'
                              : 'bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:border-white/20'
                          }`}>
                          <span className="text-lg">{cat.icon}</span>
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>

                  <h2 className="text-lg font-semibold text-white mb-4">Pickup Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">Area *</label>
                      <select value={form.area} onChange={(e) => update('area', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-scrap-green/50 transition-colors">
                        <option value="" className="bg-black">Select your area</option>
                        {areas.map((a) => <option key={a} value={a} className="bg-black">{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">Full Address *</label>
                      <textarea value={form.address} onChange={(e) => update('address', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-scrap-green/50 transition-colors resize-none"
                        rows={3} placeholder="Door number, street, building name" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">Landmark (optional)</label>
                      <input type="text" value={form.landmark} onChange={(e) => update('landmark', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-scrap-green/50 transition-colors"
                        placeholder="Nearby landmark" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-lg font-semibold text-white mb-4">Select Date & Time</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Preferred Date *</label>
                      <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-scrap-green/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Preferred Time *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot) => (
                          <button key={slot} onClick={() => update('time', slot)}
                            className={`p-2.5 rounded-xl text-xs transition-all ${
                              form.time === slot
                                ? 'bg-scrap-green/20 border border-scrap-green/50 text-scrap-green'
                                : 'bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:border-white/20'
                            }`}>
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">Notes (optional)</label>
                      <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-scrap-green/50 transition-colors resize-none"
                        rows={3} placeholder="Any special instructions?" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && <p className="text-red-400 text-xs mt-4">{error}</p>}

            <div className="flex justify-between mt-8 pt-6 border-t border-white/[0.06]">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.06] text-sm text-slate-400 hover:text-white transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <button onClick={() => canProceed() && setStep(step + 1)}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    canProceed() ? 'bg-scrap-green text-black hover:shadow-glow-green' : 'bg-white/[0.03] text-slate-600 cursor-not-allowed'
                  }`}>
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting || !canProceed()}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    submitting ? 'bg-white/[0.03] text-slate-600' : 'bg-scrap-green text-black hover:shadow-glow-green'
                  }`}>
                  {submitting ? 'Submitting...' : 'Confirm Booking'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
