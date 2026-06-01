import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, ChevronRight, CheckCircle } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const WHATSAPP_NUMBER = '9080405581';

export default function IronScrapPage() {
  return (
    <div className="bg-black min-h-screen">
      <SeoHead
        title="Iron Scrap Buyers in Coimbatore | Best Price for Iron | YourScrap"
        description="Sell iron scrap in Coimbatore at premium rates. YourScrap buys old iron, steel, construction scrap, machinery parts. Free pickup. Instant cash payment."
        keywords="iron scrap buyers Coimbatore, steel scrap buyer, old iron rate Coimbatore, construction scrap pickup"
        canonical="/iron-scrap"
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
              <Link to="/services" className="hover:text-white transition-colors">Services</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-400">Iron Scrap</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Iron Scrap{' '}
              <span className="bg-gradient-to-r from-scrap-green to-scrap-gold bg-clip-text text-transparent">Buyers</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-500 max-w-2xl mb-8 leading-relaxed">
              YourScrap is the leading iron and steel scrap buyer in Coimbatore. We purchase all types of ferrous scrap including old iron, steel beams, construction waste, machinery parts, pipes, rods, and industrial scrap at the best market rates.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 sm:p-8 rounded-2xl glass mb-8"
          >
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">What We Buy</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Old iron gates & railings',
                'Steel beams & rods',
                'Construction scrap',
                'Machinery parts',
                'Pipes & tubes',
                'Industrial waste',
                'Almirahs & cupboards',
                'Vehicle scrap',
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
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Current Iron Scrap Rates</h2>
            <div className="space-y-3">
              {[
                { type: 'Heavy Iron Scrap', rate: '₹22-25/kg' },
                { type: 'Light Iron Scrap', rate: '₹18-22/kg' },
                { type: 'Steel Scrap', rate: '₹25-30/kg' },
                { type: 'Cast Iron', rate: '₹20-24/kg' },
              ].map((item) => (
                <div key={item.type} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                  <span className="text-sm text-slate-400">{item.type}</span>
                  <span className="text-sm font-semibold text-scrap-green">{item.rate}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 mt-3">*Rates vary daily based on market prices</p>
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
              Get Rate on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
