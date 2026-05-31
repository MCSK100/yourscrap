import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const WHATSAPP_NUMBER = '9080405581';

const contactInfo = [
  { icon: Phone, label: 'Phone', value: `+91 ${WHATSAPP_NUMBER}`, href: `tel:+91${WHATSAPP_NUMBER}` },
  { icon: MessageCircle, label: 'WhatsApp', value: `+91 ${WHATSAPP_NUMBER}`, href: `https://wa.me/${WHATSAPP_NUMBER}` },
  { icon: MapPin, label: 'Location', value: 'Coimbatore, Tamilnadu' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Hi! I'm ${form.name}. ${form.message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    setSent(true);
    setForm({ name: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="bg-black min-h-screen">
      <SeoHead
        title="Contact YourScrap - Scrap Pickup Service Coimbatore | Get in Touch"
        description="Contact YourScrap for free scrap pickup in Coimbatore. Call or WhatsApp us to book pickup, check prices, or ask any questions. We're here to help."
        keywords="contact YourScrap, scrap pickup Coimbatore contact, scrap buyer phone number, scrap pickup near me"
        canonical="/contact"
      />

      <Navbar />

      <section className="relative pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-scrap-green/5 via-transparent to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Get in <span className="bg-gradient-to-r from-scrap-green to-scrap-gold bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
              Have questions? Need a pickup? We're here to help. Reach out to us anytime.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-4 sm:space-y-6">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-center gap-4 p-4 sm:p-6 rounded-2xl glass hover:bg-white/[0.03] transition-all">
                      <div className="w-12 h-12 rounded-xl bg-scrap-green/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-scrap-green" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">{item.label}</div>
                        <div className="text-sm sm:text-base text-white font-medium">{item.value}</div>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                      {content}
                    </a>
                  ) : (
                    <div key={item.label}>{content}</div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl glass">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-6">Send us a Message</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-scrap-green/50 transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-scrap-green/50 transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-scrap-green/50 transition-colors resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-scrap-green text-black font-semibold text-sm hover:shadow-glow-green transition-all"
                  >
                    <Send className="w-4 h-4" />
                    {sent ? 'Message Sent!' : 'Send via WhatsApp'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
