import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Card.jsx';

const BRAND_NAME = 'YourScrap';
const WHATSAPP_NUMBER = '9080405581';
const API_URL = import.meta.env.VITE_API_URL || '';

const categoryOptions = [
  { value: 'iron', label: 'Iron & Steel', icon: '🔩' },
  { value: 'copper', label: 'Copper', icon: '🔌' },
  { value: 'aluminum', label: 'Aluminum', icon: '⚙️' },
  { value: 'brass', label: 'Brass', icon: '🎺' },
  { value: 'plastic', label: 'Plastic', icon: '🧴' },
  { value: 'paper', label: 'Paper', icon: '📰' },
  { value: 'ewaste', label: 'E-Waste', icon: '💻' },
  { value: 'other', label: 'Other', icon: '📦' },
];

const timeSlots = [
  '09:00-11:00', '11:00-13:00', '13:00-15:00', '15:00-17:00', '17:00-19:00',
];

const initialItem = { category: 'iron', name: '', weight_kg: '' };

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    pickup_address: '',
    preferred_date: '',
    preferred_time: '',
    notes: '',
    items: [{ ...initialItem }],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [lang, setLang] = useState('en');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { ...initialItem }],
    }));
  };

  const removeItem = (index) => {
    if (form.items.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const getCategoryLabel = (value) => {
    const cat = categoryOptions.find((c) => c.value === value);
    return cat ? cat.label : value;
  };

  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!form.customer_name || !form.customer_phone) {
        setError(lang === 'en' ? 'Please enter your name and phone number.' : 'தயவுசெய்து உங்கள் பெயர் மற்றும் தொலைபேசி எண்ணை உள்ளிடவும்.');
        return false;
      }
      return true;
    }
    if (step === 2) {
      const hasEmpty = form.items.some((item) => !item.name);
      if (hasEmpty) {
        setError(lang === 'en' ? 'Please fill in all item names.' : 'தயவுசெய்து எல்லா பொருட்களின் பெயர்களையும் நிரப்பவும்.');
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!form.pickup_address || !form.preferred_date || !form.preferred_time) {
        setError(lang === 'en' ? 'Please complete address, date, and time.' : 'தயவுசெய்து முகவரி, தேதி மற்றும் நேரத்தை முடிக்கவும்.');
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleWhatsAppRedirect = (pickup) => {
    const itemList = form.items.map((i) => `${i.name} (${i.weight_kg || '?'}kg)`).join(', ');
    const message = lang === 'en'
      ? `Hi ${BRAND_NAME}! I just booked a pickup.\nName: ${pickup.customer_name}\nPhone: ${pickup.customer_phone}\nItems: ${itemList}\nAddress: ${pickup.pickup_address}\nDate: ${pickup.preferred_date}\nTime: ${pickup.preferred_time}\nPlease confirm.`
      : `வணக்கம் ${BRAND_NAME}! நான் pickup புக் செய்துள்ளேன்.\nபெயர்: ${pickup.customer_name}\nதொலைபேசி: ${pickup.customer_phone}\nபொருட்கள்: ${itemList}\nமுகவரி: ${pickup.pickup_address}\nதேதி: ${pickup.preferred_date}\nநேரம்: ${pickup.preferred_time}\nஉறுதிப்படுத்தவும்.`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        pickup_address: form.pickup_address,
        preferred_date: form.preferred_date || null,
        preferred_time: form.preferred_time || null,
        notes: form.notes || null,
        items: form.items.map((item) => ({
          category: item.category,
          name: item.name,
          weight_kg: item.weight_kg ? Number(item.weight_kg) : null,
        })),
      };

      const res = await fetch(`${API_URL}/api/pickups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to book pickup');
      }

      setSuccess(data.pickup);
      handleWhatsAppRedirect(data.pickup);
      setForm({
        customer_name: '',
        customer_phone: '',
        pickup_address: '',
        preferred_date: '',
        preferred_time: '',
        notes: '',
        items: [{ ...initialItem }],
      });
      setStep(1);
    } catch (err) {
      setError(err?.message || (lang === 'en' ? 'Unable to submit booking.' : 'முன்பதிவு செய்யமுடியவில்லை.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
          <Card title={lang === 'en' ? 'Pickup Booked!' : 'முன்பதிவு உறுதி!'}
            description={lang === 'en' ? 'Your request is received. We will contact you shortly.' : 'உங்கள் கோரிக்கை பெறப்பட்டது. நாங்கள் விரைவில் தொடர்புகொள்வோம்.'}>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#98FF98]/10 border border-[#98FF98]/30">
                <p className="text-[#98FF98] font-medium">{lang === 'en' ? 'Booking ID' : 'முன்பதிவு எண்'}</p>
                <p className="mt-1 text-slate-400 text-sm break-all">{success.id}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-2 text-sm">
                <p><span className="text-slate-400">{lang === 'en' ? 'Name' : 'பெயர்'}:</span> <span className="text-white">{success.customer_name}</span></p>
                <p><span className="text-slate-400">{lang === 'en' ? 'Phone' : 'தொலைபேசி'}:</span> <span className="text-white">{success.customer_phone}</span></p>
                <p><span className="text-slate-400">{lang === 'en' ? 'Address' : 'முகவரி'}:</span> <span className="text-white">{success.pickup_address}</span></p>
                <p><span className="text-slate-400">{lang === 'en' ? 'Date' : 'தேதி'}:</span> <span className="text-white">{success.preferred_date}</span></p>
              </div>
              <p className="text-slate-400 text-sm text-center">
                {lang === 'en'
                  ? 'We will confirm via WhatsApp. Save our number for updates.'
                  : 'WhatsApp இல் உறுதிப்படுத்துவோம்.'}
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <a href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
            &larr; {lang === 'en' ? 'Back to Home' : 'முகப்புக்கு'}
          </a>
          <div className="flex gap-2">
            <button onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-sm ${lang === 'en' ? 'bg-[#98FF98] text-black' : 'text-slate-400'}`}>EN</button>
            <button onClick={() => setLang('ta')}
              className={`px-3 py-1 rounded-full text-sm ${lang === 'ta' ? 'bg-[#98FF98] text-black' : 'text-slate-400'}`}>TA</button>
          </div>
        </div>

        <section className="rounded-3xl bg-[#0a150a] border border-[#98FF98]/20 p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#98FF98]">
                {lang === 'en' ? 'Schedule Pickup' : 'pickup முன்பதிவு'}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">{BRAND_NAME}</h2>
              <p className="text-slate-500 text-sm mt-1">Coimbatore, Tamilnadu</p>
            </div>
            <div className="rounded-3xl bg-[#98FF98]/10 px-4 py-3 text-sm text-[#98FF98]">
              {lang === 'en' ? `Step ${step} of 3` : `படி ${step} / 3`}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card title={`${lang === 'en' ? 'Step' : 'படி'} ${step}`}
            description={lang === 'en' ? 'Fill in your details to book a pickup.' : 'pickup பதிவு செய்ய விவரங்களை நிரப்பவும்.'}>
            <div className="space-y-6">
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {lang === 'en' ? 'Your Name' : 'உங்கள் பெயர்'}
                    </label>
                    <input value={form.customer_name} onChange={(e) => handleChange('customer_name', e.target.value)}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none"
                      placeholder={lang === 'en' ? 'Enter your full name' : 'உங்கள் முழு பெயரை உள்ளிடவும்'} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {lang === 'en' ? 'Phone Number' : 'தொலைபேசி எண்'}
                    </label>
                    <input value={form.customer_phone} onChange={(e) => handleChange('customer_phone', e.target.value)}
                      type="tel"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none"
                      placeholder={lang === 'en' ? 'e.g. 9080405581' : 'எ.கா. 9080405581'} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-300">
                      {lang === 'en' ? 'Items for Pickup' : 'பொருட்கள்'}
                    </label>
                    <button type="button" onClick={addItem}
                      className="text-xs px-3 py-1.5 rounded-full bg-[#98FF98]/10 text-[#98FF98] hover:bg-[#98FF98]/20 transition-colors">
                      + {lang === 'en' ? 'Add Item' : 'பொருள் சேர்'}
                    </button>
                  </div>

                  {form.items.map((item, index) => (
                    <div key={index} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{lang === 'en' ? `Item ${index + 1}` : `பொருள் ${index + 1}`}</span>
                        {form.items.length > 1 && (
                          <button type="button" onClick={() => removeItem(index)}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors">
                            {lang === 'en' ? 'Remove' : 'நீக்கு'}
                          </button>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{lang === 'en' ? 'Category' : 'வகை'}</label>
                          <select value={item.category} onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-[#98FF98] focus:outline-none">
                            {categoryOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{lang === 'en' ? 'Item Name' : 'பொருள் பெயர்'}</label>
                          <input value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-[#98FF98] focus:outline-none"
                            placeholder={lang === 'en' ? 'e.g. Copper wire' : 'எ.கா. செம்பு கம்பி'} />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{lang === 'en' ? 'Weight (kg)' : 'எடை (கி.கி)'}</label>
                          <input type="number" value={item.weight_kg} onChange={(e) => handleItemChange(index, 'weight_kg', e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-[#98FF98] focus:outline-none"
                            placeholder="0.00" min="0" step="0.1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {lang === 'en' ? 'Pickup Address' : 'pickup முகவரி'}
                    </label>
                    <textarea value={form.pickup_address} onChange={(e) => handleChange('pickup_address', e.target.value)}
                      rows={3}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none resize-none"
                      placeholder={lang === 'en' ? 'Full address with landmark' : 'முழு முகவரி'} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {lang === 'en' ? 'Pickup Date' : 'pickup தேதி'}
                      </label>
                      <input type="date" value={form.preferred_date}
                        onChange={(e) => handleChange('preferred_date', e.target.value)}
                        min={new Date().toISOString().slice(0, 10)}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none [color-scheme:dark]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {lang === 'en' ? 'Preferred Time' : 'விருப்ப நேரம்'}
                      </label>
                      <select value={form.preferred_time} onChange={(e) => handleChange('preferred_time', e.target.value)}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none">
                        <option value="">{lang === 'en' ? 'Select time' : 'நேரம் தேர்வு'}</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {lang === 'en' ? 'Notes (optional)' : 'குறிப்புகள்'}
                    </label>
                    <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)}
                      rows={2}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none resize-none"
                      placeholder={lang === 'en' ? 'Special instructions...' : 'சிறப்பு அறிவுறுத்தல்கள்...'} />
                  </div>
                </div>
              )}

              {error && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 bg-red-900/20 p-3 rounded-xl">{error}</motion.p>
              )}

              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={prevStep} disabled={step === 1 || submitting}
                  className="rounded-3xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
                  {lang === 'en' ? 'Back' : 'மீண்டும்'}
                </button>
                <div className="flex gap-3">
                  {step < 3 ? (
                    <button type="button" onClick={nextStep} disabled={submitting}
                      className="rounded-3xl bg-gradient-to-r from-[#98FF98] to-[#B2AC88] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                      {lang === 'en' ? 'Continue' : 'தொடர'}
                    </button>
                  ) : (
                    <button type="button" onClick={handleSubmit} disabled={submitting}
                      className="rounded-3xl bg-gradient-to-r from-[#98FF98] to-[#B2AC88] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                      {submitting ? (lang === 'en' ? 'Booking...' : 'சமர்ப்பிக்கிறோம்...') : (lang === 'en' ? 'Book Pickup' : 'pickup முன்பதிவு')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card title={lang === 'en' ? 'Summary' : 'சுருக்கம்'}
            description={lang === 'en' ? 'Review your booking details.' : 'உங்கள் விவரங்களைப் பார்க்கவும்.'}>
            <div className="space-y-4 text-slate-300 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Your Details' : 'உங்கள் விவரங்கள்'}</p>
                <p className="mt-1 text-white">{form.customer_name || '—'}</p>
                <p className="text-slate-400">{form.customer_phone || '—'}</p>
              </div>
              {form.items.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{lang === 'en' ? 'Items' : 'பொருட்கள்'}</p>
                  {form.items.map((item, i) => (
                    <p key={i} className="text-white">
                      {getCategoryLabel(item.category)}: {item.name || '—'} {item.weight_kg ? `(${item.weight_kg} kg)` : ''}
                    </p>
                  ))}
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Address' : 'முகவரி'}</p>
                <p className="mt-1 text-white">{form.pickup_address || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{lang === 'en' ? 'Date & Time' : 'தேதி & நேரம்'}</p>
                <p className="mt-1 text-white">{form.preferred_date || '—'} {form.preferred_time || ''}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
