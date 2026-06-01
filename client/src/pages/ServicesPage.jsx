import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, ChevronRight } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { services } from '../data/services';

const WHATSAPP_NUMBER = '9080405581';

export default function ServicesPage() {
  return (
    <div className="bg-black min-h-screen">
      <SeoHead
        title="Scrap Pickup Services in Coimbatore | YourScrap"
        description="YourScrap offers free scrap pickup services in Coimbatore for Iron, Steel, Copper, Aluminum, Paper, Plastic, and E-Waste. Best market rates. Instant payment."
        keywords="scrap pickup services Coimbatore, scrap collection Coimbatore, free scrap pickup, scrap removal service"
        canonical="/services"
      />

      <Navbar />

      <section className="relative pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-scrap-green/5 via-transparent to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-400">Services</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Our Scrap Pickup{' '}
              <span className="bg-gradient-to-r from-scrap-green to-scrap-gold bg-clip-text text-transparent">Services</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-500 max-w-2xl mb-10 leading-relaxed">
              From household scrap to industrial waste, we buy it all. Free doorstep pickup across Coimbatore with best market rates and instant payment.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-80`} />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>

                  <div className="relative p-5 sm:p-6 lg:p-8 min-h-[240px] flex flex-col justify-end">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-scrap-green" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{service.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 mb-3 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-scrap-green">{service.price}</span>
                      <Link
                        to="/book"
                        className="inline-flex items-center gap-1 text-xs text-white/60 group-hover:text-white transition-colors"
                      >
                        Book Now <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="p-6 sm:p-8 rounded-2xl glass inline-block">
              <p className="text-sm text-slate-400 mb-4">
                Not sure what category your scrap falls under?
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-scrap-green text-black font-semibold text-sm hover:shadow-glow-green transition-all"
              >
                <Phone className="w-4 h-4" />
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
