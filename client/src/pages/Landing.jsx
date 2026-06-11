import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

import {
  Truck, ShieldCheck, Leaf, Zap, Star, ChevronRight,
  ArrowRight, Clock, IndianRupee, Recycle, Users, Globe,
  ChevronDown, CheckCircle, Phone, MessageCircle, Menu, X,
  Award, Wallet, CalendarCheck, TrendingUp,
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingParticles from '../components/FloatingParticles';
import AnimatedCounter from '../components/AnimatedCounter';
import WhatsAppButton from '../components/WhatsAppButton';
import SeoHead from '../components/SeoHead';
import { services } from '../data/services';
import { testimonials } from '../data/testimonials';

const BRAND_NAME = 'YourScrap';
const WHATSAPP_NUMBER = '9080405581';

const heroBgImages = [
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617529497471-921863d0e0f4?w=1920&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1588803103006-2822e4b2619d?w=1920&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1920&q=85&auto=format&fit=crop',
];

const trustBadges = [
  { icon: ShieldCheck, label: 'Verified Business', desc: 'Registered scrap buyer' },
  { icon: Leaf, label: 'Eco-Friendly', desc: '100% recycled' },
  { icon: Wallet, label: 'Instant Payment', desc: 'UPI / Cash on spot' },
  { icon: CalendarCheck, label: 'Same-Day Pickup', desc: 'When you need it' },
];

const stats = [
  { end: 10000, suffix: '+', label: 'Pickups Completed' },
  { end: 500, suffix: 'T+', label: 'Tons Recycled' },
  { end: 98, suffix: '%', label: 'Happy Customers' },
  { end: 50, suffix: '+', label: 'Areas Covered' },
];

const howItWorks = [
  {
    icon: Phone, step: '01', title: 'Book Online',
    desc: 'Tell us what scrap you have and pick your preferred time slot in under 60 seconds.',
  },
  {
    icon: Truck, step: '02', title: 'Free Pickup',
    desc: 'Our team arrives at your doorstep at the scheduled time. We weigh your scrap digitally.',
  },
  {
    icon: IndianRupee, step: '03', title: 'Get Paid Instantly',
    desc: 'Receive payment via UPI, bank transfer, or cash. No delays, no hidden deductions.',
  },
];

const faqs = [
  {
    q: 'Is scrap pickup really free?',
    a: 'Yes, we offer completely free doorstep pickup across Coimbatore for orders above 10 kg. No hidden charges, no transportation fees.',
  },
  {
    q: 'How do you determine scrap prices?',
    a: 'Our rates are based on current market prices and updated daily. We use digital weighing scales for accurate measurement and pay you instantly.',
  },
  {
    q: 'Do you offer same-day pickup?',
    a: 'Yes, same-day pickup is available subject to slot availability. Book early in the day for best availability.',
  },
  {
    q: 'What types of scrap do you accept?',
    a: 'We accept Iron, Steel, Copper, Aluminum, Plastic, Paper, Cardboard, E-Waste, and Brass. Contact us if you are unsure about a specific item.',
  },
  {
    q: 'How do I get paid for my scrap?',
    a: 'Payment is made instantly on the spot via UPI (GPay, PhonePe, Paytm), bank transfer, or cash. You choose the method.',
  },
  {
    q: 'Do you serve my area in Coimbatore?',
    a: 'We serve all major areas including Peelamedu, Gandhipuram, RS Puram, Singanallur, Saravanampatti, Ukkadam, Vadavalli, and more. Contact us if you are outside these areas.',
  },
];

function FloatingOrb({ className, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
      animate={{ y: [0, -40, 0], x: [0, 25, 0], scale: [1, 1.15, 1] }}
      transition={{ duration: 10, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

function SectionHeading({ title, subtitle, gradient = 'from-scrap-green to-scrap-gold' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      className="text-center mb-12 sm:mb-16 lg:mb-20"
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
        <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {title}
        </span>
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

function HeroSection() {
  const [currentBg, setCurrentBg] = useState(0);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 600], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroBgImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y: heroParallax }} className="absolute inset-0">
        {heroBgImages.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-110"
            style={{
              backgroundImage: `url(${img})`,
              opacity: i === currentBg ? 1 : 0,
              transform: `scale(${i === currentBg ? 1.1 : 1.2})`,
              transition: 'opacity 1.5s ease, transform 8s ease',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 via-40% to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </motion.div>

      <FloatingParticles count={30} />

      <FloatingOrb className="w-96 h-96 bg-scrap-green/10 top-1/4 -left-48" delay={0} />
      <FloatingOrb className="w-80 h-80 bg-scrap-gold/10 bottom-1/4 -right-40" delay={3} />

      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <motion.div style={{ opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-32 sm:py-40 lg:py-48">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 sm:mb-8"
          >
            <Star className="w-3.5 h-3.5 text-scrap-green fill-scrap-green" />
            <span className="text-xs sm:text-sm text-scrap-green font-medium">
              #1 Scrap Pickup Service in Coimbatore
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6 text-balance"
          >
            <span className="bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent">
              Book Free Scrap Pickup
            </span>
            <br />
            <span className="bg-gradient-to-r from-scrap-green via-emerald-300 to-scrap-gold bg-clip-text text-transparent">
              in Coimbatore
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
          >
            Turn old scrap into instant cash with fast doorstep pickup.
            <span className="block sm:inline"> Best rates guaranteed. Same-day service available.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-16"
          >
            <Link
              to="/book"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-full bg-scrap-green text-black overflow-hidden shadow-glow-green hover:shadow-glow-green transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Book Free Pickup
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-scrap-green/80 to-emerald-400"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ type: 'tween', duration: 0.3 }}
              />
            </Link>

            <Link
              to="/#pricing"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-full glass-strong text-white hover:bg-white/[0.08] transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Check Scrap Prices
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            {stats.slice(0, 3).map((stat) => (
              <div
                key={stat.label}
                className="px-4 sm:px-5 py-3 rounded-2xl glass"
              >
                <AnimatedCounter end={stat.end} suffix={stat.suffix} label={stat.label} duration={2} />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 text-slate-600"
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function TrustBadges() {
  return (
    <section className="relative py-12 sm:py-16 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {trustBadges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group p-4 sm:p-6 rounded-2xl glass hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-scrap-green/10 flex items-center justify-center shrink-0 group-hover:bg-scrap-green/20 transition-colors">
                  <badge.icon className="w-5 h-5 sm:w-6 sm:h-6 text-scrap-green" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-semibold text-white">{badge.label}</div>
                  <div className="text-xs sm:text-sm text-slate-500">{badge.desc}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section id="services" className="relative py-section sm:py-section-lg overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <FloatingOrb className="w-80 h-80 bg-scrap-green/5 top-1/3 left-1/4" delay={2} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="We Buy All Types of Scrap"
          subtitle="From household items to industrial waste. Get the best market rates for every type of scrap."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            const isHovered = hoveredId === service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.05 }}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isHovered ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-80 transition-opacity duration-300`} />
                  <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative p-5 sm:p-6 lg:p-8 min-h-[240px] sm:min-h-[280px] flex flex-col justify-end">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-scrap-green/20 transition-colors">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-scrap-green" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mb-3 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-semibold text-scrap-green">{service.price}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-white/60 group-hover:text-white transition-colors">
                      Book Now <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 border-2 border-scrap-green/30 rounded-2xl sm:rounded-3xl pointer-events-none"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="relative py-section sm:py-section-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-scrap-dark/50 to-black" />
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <FloatingOrb className="w-96 h-96 bg-scrap-gold/5 -left-48 top-0" delay={1} />
      <FloatingOrb className="w-72 h-72 bg-scrap-green/5 -right-36 bottom-0" delay={4} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="YourScrap in Numbers"
          subtitle="Trusted by thousands across Coimbatore. Here's our impact so far."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl glass text-center"
            >
              <AnimatedCounter end={stat.end} suffix={stat.suffix} label={stat.label} duration={2.5} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="relative py-section sm:py-section-lg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="How It Works"
          subtitle="Three simple steps to turn your scrap into cash. No hassle, no waiting."
        />

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-scrap-green/20 via-scrap-green/40 to-scrap-green/20 -translate-y-1/2" />

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {howItWorks.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: i * 0.2 }}
                  className="relative flex flex-col items-center text-center p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl glass hover:bg-white/[0.03] transition-all duration-300"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-scrap-green/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-scrap-green" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-scrap-green text-black text-xs font-bold flex items-center justify-center">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const prices = [
    { category: 'Iron / Steel', price: '₹18-25/kg', color: 'from-slate-500 to-slate-700' },
    { category: 'Aluminum', price: '₹80-120/kg', color: 'from-cyan-500 to-blue-600' },
    { category: 'Copper', price: '₹350-450/kg', color: 'from-amber-500 to-orange-600' },
    { category: 'Brass', price: '₹250-320/kg', color: 'from-yellow-600 to-orange-700' },
    { category: 'Plastic (PET)', price: '₹8-15/kg', color: 'from-emerald-500 to-green-600' },
    { category: 'Paper', price: '₹6-12/kg', color: 'from-stone-500 to-neutral-600' },
    { category: 'E-Waste', price: 'Varies', color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <section id="pricing" className="relative py-section sm:py-section-lg overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Today's Scrap Rates"
          subtitle="Real-time market prices updated daily at 9 AM. Best rates guaranteed in Coimbatore."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {prices.map((rate, i) => (
            <motion.div
              key={rate.category}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="relative group p-4 sm:p-6 rounded-2xl glass hover:bg-white/[0.03] transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rate.color} opacity-50`} />
              <h3 className="text-xs sm:text-sm text-slate-400 mb-2">{rate.category}</h3>
              <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-scrap-green to-scrap-gold bg-clip-text text-transparent">
                {rate.price}
              </p>
              <div className="mt-3">
                <Link
                  to="/book"
                  className="text-xs text-slate-600 group-hover:text-scrap-green transition-colors inline-flex items-center gap-1"
                >
                  Sell now <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-section sm:py-section-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-scrap-dark/30 to-black" />
      <FloatingOrb className="w-96 h-96 bg-scrap-green/5 right-0 top-1/3" delay={5} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="What Our Customers Say"
          subtitle="Join 10,000+ happy customers who trust YourScrap for their scrap pickup needs."
        />

        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[280px] sm:min-h-[240px]">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 100 }}
                animate={i === activeIndex ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 ${i === activeIndex ? 'relative' : 'absolute pointer-events-none'}`}
              >
                <div className="p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl glass">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 sm:w-5 sm:h-5 fill-scrap-green text-scrap-green" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div>
                      <div className="text-sm sm:text-base font-semibold text-white">{t.name}</div>
                      <div className="text-xs sm:text-sm text-slate-500">{t.location}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-6 sm:mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'bg-scrap-green w-6' : 'bg-slate-700 hover:bg-slate-600'
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="relative py-section sm:py-section-lg overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about selling scrap with YourScrap."
        />

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl glass overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left"
                >
                  <span className="text-sm sm:text-base font-medium text-white pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>


      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-section sm:py-section-lg overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-scrap-green/20 via-scrap-dark to-black" />
        <div className="absolute inset-0 bg-grid pointer-events-none" />
      </div>

      <FloatingOrb className="w-96 h-96 bg-scrap-green/10 left-1/3 top-0" delay={0} />
      <FloatingOrb className="w-72 h-72 bg-scrap-gold/10 right-1/4 bottom-0" delay={3} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6">
            <TrendingUp className="w-4 h-4 text-scrap-green" />
            <span className="text-sm text-scrap-green font-medium">10,000+ Pickups Completed</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 text-balance">
            Ready to Turn Your Scrap
            <br />
            <span className="bg-gradient-to-r from-scrap-green to-scrap-gold bg-clip-text text-transparent">
              Into Instant Cash?
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Join 10,000+ happy customers in Coimbatore. First pickup free above 10 kg.
            <br className="hidden sm:block" />
            Same-day service available. No hidden charges.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/book"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-full bg-scrap-green text-black overflow-hidden shadow-glow-green hover:shadow-glow-green transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Book Free Pickup Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-scrap-green/80 to-emerald-400"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ type: 'tween', duration: 0.3 }}
              />
            </Link>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-full glass-strong text-white hover:bg-white/[0.08] transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-black/90 backdrop-blur-xl border-t border-white/[0.03] px-4 py-3">
      <div className="flex gap-3">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <Link
          to="/book"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-scrap-green text-black text-sm font-semibold"
        >
          Book Free Pickup
        </Link>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="bg-black min-h-screen pb-16 md:pb-0">
      <SeoHead />
      <Navbar />
      <HeroSection />
      <TrustBadges />
      <ServicesSection />
      <StatsSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
      <WhatsAppButton />
      <StickyMobileCTA />
    </div>
  );
}
