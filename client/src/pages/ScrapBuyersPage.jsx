import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, ChevronRight, CheckCircle, Star } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const WHATSAPP_NUMBER = '9080405581';

const areas = [
  'Peelamedu', 'Gandhipuram', 'RS Puram', 'Singanallur',
  'Saravanampatti', 'Ukkadam', 'Vadavalli', 'Saibaba Colony',
  'Kuniyamuthur', 'Podanur',
];

export default function ScrapBuyersPage() {
  return (
    <div className="bg-black min-h-screen">
      <SeoHead
        title="Best Scrap Buyers in Coimbatore | YourScrap"
        description="Looking for reliable scrap buyers in Coimbatore? YourScrap offers free doorstep pickup, best market rates for Iron, Steel, Copper, Aluminum, Paper & Plastic. Instant cash payment."
        keywords="scrap buyers Coimbatore, scrap dealer Coimbatore, scrap collection Coimbatore, best scrap buyers"
        canonical="/scrap-buyers"
      />

      <Navbar />

      <section className="relative pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-scrap-green/5 via-transparent to-transparent" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-400">Scrap Buyers</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Best Scrap{' '}
              <span className="bg-gradient-to-r from-scrap-green to-scrap-gold bg-clip-text text-transparent">Buyers</span>
              <br />
              in Coimbatore
            </h1>

            <p className="text-sm sm:text-base text-slate-500 max-w-2xl mb-8 leading-relaxed">
              YourScrap is the most trusted scrap buying service in Coimbatore. We offer free doorstep pickup across all major areas of the city. Whether you have old iron, steel, copper wires, aluminum utensils, paper waste, or plastic scrap, we provide the best market rates with instant cash payment.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 sm:p-8 rounded-2xl glass mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-5 h-5 text-scrap-green fill-scrap-green" />
              <h2 className="text-lg sm:text-xl font-bold text-white">Why Choose YourScrap?</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Free doorstep pickup across all areas',
                'Best market rates guaranteed',
                'Digital weighing for accuracy',
                'Instant payment via UPI / Cash',
                'Same-day pickup available',
                '10,000+ satisfied customers',
                'Verified & trusted business',
                'Eco-friendly recycling partner',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle className="w-4 h-4 text-scrap-green shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 sm:p-8 rounded-2xl glass mb-8"
          >
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Scrap Types We Buy</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { type: 'Iron & Steel', rate: '₹18-30/kg' },
                { type: 'Copper', rate: '₹350-450/kg' },
                { type: 'Aluminum', rate: '₹80-120/kg' },
                { type: 'Brass', rate: '₹250-320/kg' },
                { type: 'Paper & Cardboard', rate: '₹6-12/kg' },
                { type: 'Plastic', rate: '₹8-15/kg' },
                { type: 'E-Waste', rate: 'Varies' },
                { type: 'Other Scrap', rate: 'Contact us' },
              ].map((item) => (
                <div key={item.type} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                  <span className="text-sm text-slate-400">{item.type}</span>
                  <span className="text-sm font-semibold text-scrap-green">{item.rate}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-6 sm:p-8 rounded-2xl glass mb-8"
          >
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Areas We Serve</h2>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <span
                  key={area}
                  className="px-3 py-1 rounded-full glass text-xs text-slate-400"
                >
                  {area}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Link
              to="/book"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-scrap-green text-black font-semibold text-sm hover:shadow-glow-green transition-all"
            >
              Book Free Pickup
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full glass-strong text-white text-sm font-medium hover:bg-white/[0.08] transition-all"
            >
              <Phone className="w-4 h-4" />
              WhatsApp Now
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
