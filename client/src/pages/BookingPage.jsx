import { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';
import Loader from '../components/Loader.jsx';
import { supabase } from '../services/supabaseClient.js';
import { getCurrentUser } from '../services/auth.js';

const BRAND_NAME = 'YourScrap';
const WHATSAPP_NUMBER = '9080405581'; // Replace with your WhatsApp number

const categoryOptions = [
  { value: 'electronics', label: 'Electronics', ta: 'மின்னணுக்கு' },
  { value: 'metal', label: 'Metal', ta: 'உலோகம்' },
  { value: 'plastic', label: 'Plastic', ta: 'பிளாஸ்டிக்' },
  { value: 'glass', label: 'Glass', ta: 'கண்ணாடி' },
  { value: 'paper', label: 'Paper', ta: 'காகிதம்' }
];

const initialForm = {
  category: 'electronics',
  item_name: '',
  weight_kg: '',
  estimated_value_cents: '',
  pickup_address: '',
  schedule_at: null,
  notes: '',
  image_url: '',
  image_file: null
};

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [lang, setLang] = useState('en');

  const selectedCategory = useMemo(
    () => categoryOptions.find((item) => item.value === form.category),
    [form.category]
  );

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const filePath = `images/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pickups-images')
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = await supabase.storage
        .from('pickups-images')
        .getPublicUrl(uploadData.path);
      setForm((current) => ({ ...current, image_file: file, image_url: urlData.publicURL }));
    } catch {
      setError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const validateStep = () => {
    setError('');
    if (step === 1) return true;
    if (step === 2) {
      if (!form.item_name || !form.weight_kg || !form.estimated_value_cents) {
        setError(lang === 'en' ? 'Please complete all item details.' : 'தயவுச செய்து எல்லா விவரங்களையும் நிரப்புங்கள்.');
        return false;
      }
      if (!form.image_url) {
        setError(lang === 'en' ? 'Please upload an image for the item.' : 'தயவுச செய்து படத்தை அப்லோட் செய்யுங்கள்.');
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!form.pickup_address || !form.schedule_at) {
        setError(lang === 'en' ? 'Please select pickup address and date.' : 'தயவுச செய்து முகவரி மற்று தேதியைத் தேர்ந்தெடுங்கள்.');
        return false;
      }
      if (!isWeekend(form.schedule_at)) {
        setError(lang === 'en' ? 'We only collect on weekends (Saturday & Sunday).' : 'நாங்கள் வாராந்த்தத் தவுமே (சனி அல்லது ஞாயிறு) எடுக்கிறோம்.');
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, 3));
  };

  const previousStep = () => {
    setError('');
    setStep((current) => Math.max(current - 1, 1));
  };

  const handleWhatsAppRedirect = (pickup) => {
    const dateStr = pickup.pickup_date ? new Date(pickup.pickup_date).toLocaleDateString('en-IN') : '';
    const message = lang === 'en'
      ? `Hi ${BRAND_NAME}! I just scheduled a pickup for ${selectedCategory?.label || 'Scrap'} (${pickup.weight_kg}kg) on ${dateStr}. Please confirm.`
      : `வணக்கம் ${BRAND_NAME}! ${selectedCategory?.ta || 'குப்பை'} (${pickup.weight_kg}கிகி) ${dateStr}இல் pickupக்கு முன்பதிவு செய்துவிட்டேன். உறுதிப்படுத்துங்கள்.`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setError('');

    try {
      const currentUser = getCurrentUser();
      const payload = {
        user_id: currentUser?.id || null,
        category: form.category,
        estimated_weight: Number(form.weight_kg) || null,
        weight_kg: Number(form.weight_kg) || null,
        pickup_date: form.schedule_at ? new Date(form.schedule_at).toISOString().slice(0, 10) : null,
        status: 'pending',
        image_url: form.image_url || null,
        created_at: new Date().toISOString()
      };

      const { data: insertData, error: insertError } = await supabase.from('pickups').insert([payload]);
      if (insertError) throw insertError;

      const pickup = insertData?.[0] || payload;
      setSuccess(pickup);
      handleWhatsAppRedirect(pickup);
      setForm(initialForm);
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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card title={lang === 'en' ? 'Pickup Booked!' : 'முன்பதிவு உறுதி!'} description={lang === 'en' ? 'Your request is received. Check WhatsApp for confirmation.' : 'உங்கள் கோரிக்கை பெறப்பட்டது. WhatsAppஇல் உறுதிப்படுத்துங்கள்.'}>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#98FF98]/10 border border-[#98FF98]/30">
                <p className="text-[#98FF98] font-medium">{lang === 'en' ? 'Pickup Details' : 'pickup விவரங்கள்'}</p>
                <p className="mt-1 text-slate-400 text-sm break-all">{success.id}</p>
              </div>
              <p className="text-slate-400 text-sm">
                {lang === 'en' 
                  ? 'We will confirm your pickup via WhatsApp. Save our number for updates.' 
                  : 'WhatsAppஇல் pickupஐ உறுதிப்படுத்துவோம். எண்ணை சேமியுங்கள்.'}
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
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-full text-sm ${lang === 'en' ? 'bg-[#98FF98] text-black' : 'text-slate-400'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('ta')}
            className={`px-3 py-1 rounded-full text-sm ${lang === 'ta' ? 'bg-[#98FF98] text-black' : 'text-slate-400'}`}
          >
            TA
          </button>
        </div>

        <section className="rounded-3xl bg-[#0a150a] border border-[#98FF98]/20 p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#98FF98]">
                {lang === 'en' ? 'Schedule Pickup' : 'pickup முன்பதிவு'}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">
                {BRAND_NAME}
              </h2>
            </div>
            <div className="rounded-3xl bg-[#98FF98]/10 px-4 py-3 text-sm text-[#98FF98]">
              {lang === 'en' ? `Step ${step} of 3` : `படி ${step} / 3`}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card title={`${lang === 'en' ? 'Step' : 'படி'} ${step}`} description={lang === 'en' ? 'Complete the form to create your pickup request.' : 'pickup கோரிக்கையை உருவாக்குங்கள்.'}>
            <div className="space-y-6">
              {step === 1 && (
                <div className="space-y-5">
                  <label className="block text-sm font-medium text-slate-300">
                    {lang === 'en' ? 'Category' : 'வகை'}
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {categoryOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleChange('category', option.value)}
                        className={`rounded-3xl border px-4 py-4 text-left transition ${
                          form.category === option.value
                            ? 'border-[#98FF98] bg-[#98FF98]/10 text-[#98FF98]'
                            : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-[#98FF98]'
                        }`}
                      >
                        <p className="font-semibold">{option.label}</p>
                        <p className="text-xs text-slate-500">{option.ta}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300">
                      {lang === 'en' ? 'Item name' : 'பொருள் பெயர்'}
                    </label>
                    <input
                      value={form.item_name}
                      onChange={(e) => handleChange('item_name', e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none"
                      placeholder={lang === 'en' ? 'e.g. Laptop, copper wire' : 'எ.கா. லேப்டாப், செம்பு வயர்'}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-300">
                        {lang === 'en' ? 'Weight (kg)' : 'எights (கி.கி)'}
                      </label>
                      <input
                        type="number"
                        value={form.weight_kg}
                        onChange={(e) => handleChange('weight_kg', e.target.value)}
                        className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none"
                        placeholder="0.00"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300">
                        {lang === 'en' ? 'Estimated value (₹)' : 'மதிப்பு (₹)'}
                      </label>
                      <input
                        type="number"
                        value={form.estimated_value_cents}
                        onChange={(e) => handleChange('estimated_value_cents', e.target.value)}
                        className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">
                      {lang === 'en' ? 'Upload photo' : 'படம் அப்லோட்'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-2 w-full text-sm text-slate-400"
                    />
                    {uploading && <p className="mt-2 text-sm text-[#98FF98]">Uploading...</p>}
                    {form.image_url && (
                      <img
                        src={form.image_url}
                        alt="Preview"
                        className="mt-4 max-h-48 w-full rounded-3xl object-cover"
                      />
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300">
                      {lang === 'en' ? 'Pickup Address' : 'pickup முகவரி'}
                    </label>
                    <input
                      value={form.pickup_address}
                      onChange={(e) => handleChange('pickup_address', e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none"
                      placeholder={lang === 'en' ? 'Full address for pickup' : 'முழு முகவரி'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">
                      {lang === 'en' ? 'Pickup Date (Weekend Only)' : 'pickup தேதி (வாராந்த்தத் மட்டும்)'}
                    </label>
                    <DatePicker
                      selected={form.schedule_at}
                      onChange={(date) => handleChange('schedule_at', date)}
                      filterDate={isWeekend}
                      selectsStart
                      startDate={form.schedule_at}
                      minDate={new Date()}
                      placeholderText={lang === 'en' ? 'Select Saturday or Sunday' : 'சனி அல்லது ஞாயிறு'}
                      className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-[#98FF98] focus:outline-none"
                      dateFormat="dd/MM/yyyy"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      {lang === 'en' ? 'We only collect on Saturdays and Sundays' : 'நாங்கள் சனி மற்று ஞாயிறு அன்று மட்டும் எடுக்கிறோம்'}
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 bg-red-900/20 p-3 rounded-xl"
                >
                  {error}
                </motion.p>
              )}

              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={previousStep}
                  disabled={step === 1 || submitting}
                  className="rounded-3xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {lang === 'en' ? 'Back' : 'மீண்டும்'}
                </button>
                <div className="flex gap-3">
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={submitting}
                      className="rounded-3xl bg-gradient-to-r from-[#98FF98] to-[#B2AC88] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {lang === 'en' ? 'Continue' : 'தொடர'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="rounded-3xl bg-gradient-to-r from-[#98FF98] to-[#B2AC88] px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting 
                        ? (lang === 'en' ? 'Booking...' : 'சமர்ப்பிக்கிறோம்...') 
                        : (lang === 'en' ? 'Book Pickup' : 'pickup முன்பதிவு')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card title={lang === 'en' ? 'Summary' : 'சுருக்கம்'} description={lang === 'en' ? 'Review your pickup details.' : 'pickup விவரங்களை பாருங்கள்.'}>
            <div className="space-y-4 text-slate-300">
              <div>
                <p className="text-sm font-semibold text-white">{lang === 'en' ? 'Category' : 'வகை'}</p>
                <p className="mt-1">{selectedCategory?.label}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{lang === 'en' ? 'Item' : 'பொருள்'}</p>
                <p className="mt-1">{form.item_name || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{lang === 'en' ? 'Weight' : 'எights்'}</p>
                <p className="mt-1">{form.weight_kg ? `${form.weight_kg} kg` : '—'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{lang === 'en' ? 'Date' : 'தேதி'}</p>
                <p className="mt-1">
                  {form.schedule_at 
                    ? new Date(form.schedule_at).toLocaleDateString('en-IN') 
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{lang === 'en' ? 'Address' : 'முகவரி'}</p>
                <p className="mt-1">{form.pickup_address || '—'}</p>
              </div>
            </div>
          </Card>
        </div>

        {uploading && <Loader message={lang === 'en' ? 'Uploading image...' : 'படம் அப்லோட் ஆகிறது...'} />}
      </div>
    </div>
  );
}