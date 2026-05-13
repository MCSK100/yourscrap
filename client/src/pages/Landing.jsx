import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AuroraBackground from '../components/ui/aurora-background.jsx';

const BRAND_NAME = 'YourScrap';
const TAGLINE = {
  en: 'Your Scrap, Our Green Future.',
  ta: 'குப்பையை காசாக்குங்கள்',
};

const stats = [
  { value: '10K+', label: 'Pickups Completed' },
  { value: '500+', label: 'Tons Recycled' },
  { value: '98%', label: 'Customer Satisfaction' },
];

const scrapCategories = [
  { icon: '🔩', title: 'Iron & Steel', description: 'Old pipes, utensils, construction waste', color: 'from-orange-500 to-red-500' },
  { icon: '🔌', title: 'Copper', description: 'Wires, pipes, electrical components', color: 'from-amber-600 to-yellow-500' },
  { icon: '⚙️', title: 'Aluminum', description: 'Cans, foil, kitchenware', color: 'from-blue-400 to-cyan-400' },
  { icon: '🎺', title: 'Brass', description: 'Fittings, decorative items, old jewelry', color: 'from-yellow-500 to-orange-500' },
  { icon: '🧴', title: 'Plastic', description: 'PET bottles, containers, wrappers', color: 'from-green-400 to-emerald-500' },
  { icon: '📰', title: 'Paper', description: 'Newspapers, cardboard, books', color: 'from-stone-400 to-neutral-400' },
];

const features = [
  { icon: '⚡', title: 'Instant Booking', description: 'Book your pickup in under 60 seconds. No calls, no waiting.', ta: 'உடனடி முன்பதிவு' },
  { icon: '💰', title: 'Fair Prices', description: 'Get real-time market rates for your scrap. No hidden fees.', ta: 'சரியான விலை' },
  { icon: '🌱', title: 'Eco Impact', description: 'Every pickup saves 2.5kg CO₂. Track your contribution.', ta: 'சூழல் பாதுகாப்பு' },
  { icon: '🚛', title: 'Free Pickup', description: 'We come to your doorstep. Free for orders above 10kg.', ta: ' இலவசம் pickup' },
];

const steps = [
  { num: '01', title: 'Snap & Upload', description: 'Take a photo of your scrap. Our AI instantly identifies the type and value.', ta: 'படம் எடுத்து அப்லோட்' },
  { num: '02', title: 'Pick Your Slot', description: 'Choose Saturday or Sunday for pickup.', ta: 'சனி அல்லது ஞாயிறு' },
  { num: '03', title: 'Get Paid', description: 'Receive payment instantly via UPI or bank transfer.', ta: 'பணம் பெறுங்கள்' },
];

const priceRates = [
  { category: 'Iron / Steel', price: '₹18-25/kg', color: 'from-orange-500 to-red-500' },
  { category: 'Aluminum', price: '₹80-120/kg', color: 'from-blue-500 to-cyan-500' },
  { category: 'Copper', price: '₹350-450/kg', color: 'from-amber-600 to-yellow-500' },
  { category: 'Brass', price: '₹250-320/kg', color: 'from-yellow-600 to-orange-500' },
  { category: 'Plastic (PET)', price: '₹8-15/kg', color: 'from-green-500 to-emerald-500' },
  { category: 'Paper', price: '₹6-12/kg', color: 'from-stone-500 to-neutral-500' },
];

const LeafIcon = () => (
  <img src="./src/scraplogo.png" alt="YourScrap" className="w-14 md:w-16" />
);

const whatsAppIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 6 6v.5z"/>
  </svg>
);

function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [trailing, setTrailing] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const requestRef = useRef();

  useEffect(() => {
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    const animate = () => {
      setTrailing((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.15,
        y: prev.y + (pos.y - prev.y) * 0.15,
      }));
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [pos]);

  useEffect(() => {
    const handleMouseOver = (e) => {
      const t = e.target;
      if (t.tagName === 'A' || t.tagName === 'BUTTON' || t.closest('a') || t.closest('button')) {
        setIsHovering(true);
      } else setIsHovering(false);
    };
    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, []);

  return (
    <motion.div className="fixed inset-0 pointer-events-none z-[9999]" style={{ x: trailing.x, y: trailing.y }}
      animate={{ scale: isHovering ? 1.5 : 1, opacity: isHovering ? 0.8 : 0.3 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    >
      <div className="absolute rounded-full bg-[#98FF98]" style={{ width: 20, height: 20, transform: 'translate(-50%, -50%)', boxShadow: '0 0 20px rgba(152, 255, 152, 0.5)' }} />
    </motion.div>
  );
}

function FloatingOrb({ className, delay = 0 }) {
  return (
    <motion.div className={`absolute rounded-full blur-3xl opacity-40 ${className}`}
      animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 8, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

function Navbar({ lang, setLang }) {
  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-transparent">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <LeafIcon />
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-300 hover:text-white transition-colors text-sm font-medium px-3 py-2">
            {lang === 'en' ? 'Login' : 'உள்'}
          </Link>
          <Link to="/book" className="px-5 py-2.5 rounded-full bg-[#98FF98] text-black text-sm font-semibold hover:bg-[#7bdc78] transition-colors">
            {lang === 'en' ? 'Book' : 'முன்'}
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

function Hero({ lang, setLang }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1a0d] via-[#1a2e1a] to-[#0a150a]" />

      <AuroraBackground className="opacity-95" intensity={1} enableMouseFollow={true} />

      <FloatingOrb className="w-64 md:w-96 h-64 md:h-96 bg-[#98FF98]/10 -top-10 md:-top-20 -left-20" delay={0} />
      <FloatingOrb className="w-56 md:w-80 h-56 md:h-80 bg-[#B2AC88]/10 top-1/3 right-10" delay={2} />
      <FloatingOrb className="w-48 md:w-72 h-48 md:h-72 bg-[#98FF98]/10 bottom-20 left-1/4" delay={4} />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto py-20 md:py-32 text-center">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#98FF98]/10 backdrop-blur-md border border-[#98FF98]/20 mb-6 md:mb-8">
          <button onClick={() => setLang('en')} className={`text-xs md:text-sm font-medium transition-colors ${lang === 'en' ? 'text-[#98FF98]' : 'text-slate-400 hover:text-white'}`}>EN</button>
          <span className="text-slate-600">|</span>
          <button onClick={() => setLang('ta')} className={`text-xs md:text-sm font-medium transition-colors ${lang === 'ta' ? 'text-[#98FF98]' : 'text-slate-400 hover:text-white'}`}>TA</button>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-6">
          <span className="bg-gradient-to-r from-white via-[#98FF98] to-[#B2AC88] bg-clip-text text-transparent">{BRAND_NAME}</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-base md:text-xl text-[#B2AC88] mb-3 md:mb-4 font-medium">{TAGLINE[lang]}</motion.p>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-sm md:text-lg text-slate-400 max-w-lg mx-auto mb-6 md:mb-10">
          {lang === 'en' ? "Schedule your pickup for Saturday or Sunday." : "சனி அல்லது ஞாயிறு அன்று pickupக்கு முன்பதிவு செய்யுங்கள்."}
        </motion.p>

<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-col sm:flex-row gap-3 justify-center mb-8 md:mb-16">
          <Link to="/book" className="group relative inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-semibold rounded-full bg-[#98FF98] text-black overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">{lang === 'en' ? 'Book Pickup 🚛' : 'முன்பதிவு 🚛'}</span>
            <motion.div className="absolute inset-0 bg-[#B2AC88]" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ type: 'tween', duration: 0.3 }} />
          </Link>
          <Link to="/register" className="inline-flex items-center justify-center gap-2 px-6 md:py-4 text-sm md:text-base font-semibold rounded-full border border-[#98FF98]/30 bg-[#98FF98]/5 backdrop-blur-md text-[#98FF98] hover:bg-[#98FF98]/10 transition-all">
            {lang === 'en' ? 'Get Started ↗' : 'துவக்கு ↗'}
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="flex flex-wrap justify-center gap-4 md:gap-10">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }} className="text-center px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="text-xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <motion.div className="w-1.5 h-1.5 rounded-full bg-white/60" animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
          </div>
        </div>
      </section>
  );
}

function ScrapCarousel({ lang }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % scrapCategories.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-12 md:py-20 bg-black overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
            {lang === 'en' ? 'We Accept All Scrap' : 'எல்லாவிதமான குப்பைகளையும் வாங்குவோம்'}
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            {lang === 'en' 
              ? 'From household items to industrial waste. Schedule a pickup and earn money while saving the environment.'
              : 'வீட்டு பொருட்கள் முதல் தொழிற்பட்டை வரை. pickupக்கு முன்பதிவு செய்து பணம் சம்பாதித்து சுற்றுச்சூழலை பாதுகாக்கவும்.'
            }
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <motion.div 
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {scrapCategories.map((category, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className={`p-8 md:p-16 rounded-3xl bg-gradient-to-br ${category.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10 flex flex-col items-center justify-center text-center">
                      <div className="text-6xl md:text-8xl mb-4">{category.icon}</div>
                      <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">{category.title}</h3>
                      <p className="text-white/80 text-sm md:text-lg max-w-md">{category.description}</p>
                      <Link 
                        to="/book"
                        className="mt-6 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold hover:bg-white/30 transition-colors"
                      >
                        {lang === 'en' ? 'Book Now' : 'முன்பதிவு செய்'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {scrapCategories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-[#98FF98] w-8' : 'bg-slate-600'}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mt-8 md:mt-12">
          {scrapCategories.map((category, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-3 md:p-4 rounded-2xl bg-[#0a150a] border border-[#98FF98]/10 hover:border-[#98FF98]/30 transition-all text-center cursor-pointer"
              onClick={() => setCurrentIndex(i)}
            >
              <div className="text-2xl md:text-3xl mb-1">{category.icon}</div>
              <div className="text-xs md:text-sm font-medium text-white">{category.title}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnvironmentalImpact({ lang }) {
  const impacts = [
    { value: '75%', label: 'Energy Saved', desc: 'Recycling steel saves 75% energy vs new production', icon: '⚡' },
    { value: '95%', label: 'Aluminum Saved', desc: 'Recycling aluminum saves 95% energy', icon: '🔄' },
    { value: '86%', label: 'Less Pollution', desc: 'Air pollution reduced by 86%', icon: '🌿' },
    { value: '40%', label: 'Water Saved', desc: 'Water usage reduced by 40%', icon: '💧' },
  ];

  return (
    <section className="relative py-12 md:py-20 bg-[#051005]">
      <FloatingOrb className="w-48 md:w-72 h-48 md:h-72 bg-[#98FF98]/10 top-1/4 -left-20 md:-left-36" delay={2} />
      <FloatingOrb className="w-40 md:w-56 h-40 md:h-56 bg-[#B2AC88]/10 bottom-1/4 -right-20 md:-right-36" delay={4} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
            {lang === 'en' ? 'Why Recycle?' : 'ஏன் மறுசுழற்ற வேண்டும்?'}
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Every ton of recycled scrap helps conserve natural resources and reduces environmental impact.'
              : 'ஒரு டன் மறுசுழற்றப்பட்ட குப்பை சுற்றுச்சூழல் தாக்கத்தைக் குறைக்க உதவுகிறது.'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {impacts.map((impact, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-4 md:p-6 rounded-2xl bg-[#0a150a] border border-[#98FF98]/20 hover:border-[#98FF98]/40 transition-all text-center"
            >
              <div className="text-3xl md:text-4xl mb-2">{impact.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-[#98FF98] mb-1">{impact.value}</div>
              <div className="text-sm md:text-base font-semibold text-white mb-1">{impact.label}</div>
              <div className="text-xs md:text-sm text-slate-400">{impact.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features({ lang }) {
  return (
    <section className="relative py-12 md:py-20 lg:py-32 bg-black">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
            {lang === 'en' ? 'Why Choose' : 'ஏன் தேர்வு'} <span className="bg-gradient-to-r from-[#98FF98] to-[#B2AC88] bg-clip-text text-transparent">{BRAND_NAME}</span>?
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {features.map((feature, i) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}
              className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-[#0a150a] border border-[#98FF98]/10 hover:border-[#98FF98]/30 transition-all"
            >
              <div className="text-2xl md:text-4xl mb-2 md:mb-4">{feature.icon}</div>
              <h3 className="text-sm md:text-xl font-semibold text-white mb-1 md:mb-2">{feature.title}</h3>
              <p className="text-xs md:text-sm text-slate-400 mb-1">{feature.description}</p>
              <p className="text-[#B2AC88] text-xs">{feature.ta}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ lang }) {
  return (
    <section className="relative py-12 md:py-20 lg:py-32 bg-black">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
            {lang === 'en' ? 'How It Works' : 'இது எப்படி'}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {steps.map((step, i) => (
            <motion.div key={step.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
              className="p-6 md:p-10 rounded-2xl md:rounded-3xl bg-[#0a150a] border border-[#98FF98]/10 hover:border-[#98FF98]/30 transition-all text-center"
            >
              <div className="text-4xl md:text-6xl font-black text-[#98FF98]/10 mb-3 md:mb-4">{step.num}</div>
              <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3">{step.title}</h3>
              <p className="text-xs md:text-base text-slate-400 mb-2">{step.description}</p>
              <p className="text-[#B2AC88] text-xs md:text-sm">{step.ta}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ lang }) {
  return (
    <section className="relative py-12 md:py-20 lg:py-32 bg-[#051005]">
      <FloatingOrb className="w-48 md:w-72 h-48 md:h-72 bg-[#98FF98]/10 top-1/4 -left-20 md:-left-36" delay={2} />
      <FloatingOrb className="w-40 md:w-56 h-40 md:h-56 bg-[#B2AC88]/10 bottom-1/4 -right-20 md:-right-36" delay={4} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
            {lang === 'en' ? "Today's Rates" : 'இன்றைய விலை'}
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            {lang === 'en' ? 'Real-time market rates. Updated daily at 9 AM.' : 'நிகழ் நேர விலை.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
          {priceRates.map((rate, i) => (
            <motion.div key={rate.category} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.02 }}
              className="p-4 md:p-6 rounded-xl md:rounded-3xl bg-[#0a150a] border border-[#98FF98]/10 hover:border-[#98FF98]/30 transition-all"
            >
              <h3 className="text-xs md:text-lg font-semibold text-white mb-1 md:mb-2">{rate.category}</h3>
              <p className="text-sm md:text-2xl font-bold bg-gradient-to-r from-[#98FF98] to-[#B2AC88] bg-clip-text text-transparent">{rate.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ lang }) {
  return (
    <section className="relative py-12 md:py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#98FF98] via-[#B2AC88] to-[#98FF98] opacity-95" />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 20%, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 40px, rgba(0,0,0,0.12) 42px, rgba(0,0,0,0) 55px), radial-gradient(circle at 70% 30%, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 38px, rgba(0,0,0,0.10) 40px, rgba(0,0,0,0) 53px), radial-gradient(circle at 40% 80%, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 48px, rgba(0,0,0,0.10) 50px, rgba(0,0,0,0) 64px)",
            filter: "blur(0.2px)",
            opacity: 0.9,
            backgroundSize: "140% 140%",
            animation: "bbw-drift 10s linear infinite",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.0) 0px, rgba(255,255,255,0.0) 22px, rgba(255,255,255,0.18) 24px, rgba(255,255,255,0.0) 28px)",
            opacity: 0.35,
            filter: "blur(1px)",
            backgroundSize: "220px 100%",
            animation: "bbw-scan 6s ease-in-out infinite",
          }}
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute -left-1/4 top-0 h-full w-2/3 rotate-6 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-70 animate-[bbw-shine_4.5s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @keyframes bbw-drift {
          0% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(-2%, 1.5%, 0) scale(1.02); }
          100% { transform: translate3d(0,0,0) scale(1); }
        }
        @keyframes bbw-scan {
          0%, 100% { transform: translate3d(0,0,0); opacity: 0.28; }
          50% { transform: translate3d(3%,0,0); opacity: 0.42; }
        }
        @keyframes bbw-shine {
          0% { transform: translateX(-30%) rotate(6deg); opacity: 0.0; }
          25% { opacity: 0.65; }
          50% { transform: translateX(40%) rotate(6deg); opacity: 0.55; }
          75% { opacity: 0.25; }
          100% { transform: translateX(90%) rotate(6deg); opacity: 0.0; }
        }
      `}</style>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-black mb-4 md:mb-6">
            {lang === 'en' ? 'Ready to Start Earning? 🎉' : 'பணம் சம்பாதிக்கத் தயாரா? 🎉'}
          </h2>
          <p className="text-sm md:text-xl text-black/70 mb-6 md:mb-10 max-w-md mx-auto">
            {lang === 'en' ? 'Join 10,000+ users. First pickup FREE above 10kg!' : '10,000+ பயனர்கள். முதல் pickup இலவசம்!'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              to="/book"
              className="group relative inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-bold rounded-full bg-gradient-to-r from-[#98FF98] to-[#B2AC88] text-black shadow-[0_0_30px_rgba(152,255,152,0.45)] hover:shadow-[0_0_45px_rgba(152,255,152,0.6)] transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                {lang === 'en' ? 'Book Pickup Now 🚛' : 'முன்பதிவு 🚛'}
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/35 to-white/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 rounded-full" />
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 md:py-4 py-3 md:px-8 text-sm md:text-base font-bold rounded-full border border-white/40 bg-white/10 text-black hover:bg-white/20 transition-all shadow-[0_0_18px_rgba(152,255,152,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50"
            >
              {lang === 'en' ? 'Create Account' : 'கணக்கு உருவாக்கு'}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-6 md:py-10 bg-black border-t border-white/10">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <LeafIcon />
          </div>
          <div className="flex gap-4 md:gap-6 text-xs md:text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-xs md:text-sm text-slate-600">© 2026 {BRAND_NAME}</p>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  const [lang, setLang] = useState('en');
  
  return (
    <div className="bg-black min-h-screen">
      <Cursor />
      <Navbar lang={lang} setLang={setLang} />
      
      <Link to="https://wa.me/8610499863" target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 rounded-full bg-[#98FF98] p-4 shadow-lg hover:bg-[#7bdc78] flex items-center justify-center animate-pulse"
        aria-label="Chat on WhatsApp"
      >
        {whatsAppIcon}
      </Link>

      <Hero lang={lang} setLang={setLang} />
      <ScrapCarousel lang={lang} />
      <EnvironmentalImpact lang={lang} />
      <Features lang={lang} />
      <HowItWorks lang={lang} />
      <Pricing lang={lang} />
      <CTA lang={lang} />
      <Footer />
    </div>
  );
}