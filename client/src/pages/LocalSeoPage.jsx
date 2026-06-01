import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Phone, Star, CheckCircle, ChevronRight } from 'lucide-react';

import SeoHead from '../components/SeoHead';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getSeoPage } from '../data/localSeoPages';
import WhatsAppButton from '../components/WhatsAppButton';

const WHATSAPP_NUMBER = '9080405581';

function FAQSchema({ faqs }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }),
      }}
    />
  );
}

const areas = [
  { name: 'Peelamedu', slug: '/scrap-pickup-peelamedu' },
  { name: 'RS Puram', slug: '/scrap-pickup-rs-puram' },
  { name: 'Gandhipuram', slug: '/scrap-buyers-coimbatore' },
  { name: 'Singanallur', slug: '/scrap-buyers-coimbatore' },
  { name: 'Saravanampatti', slug: '/scrap-buyers-coimbatore' },
  { name: 'Ukkadam', slug: '/scrap-buyers-coimbatore' },
];

export default function LocalSeoPage() {
  const { slug } = useParams();
  const page = getSeoPage(slug);

  if (!page) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Page Not Found</h1>
          <Link to="/" className="text-scrap-green hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'YourScrap',
    description: page.description,
    url: `https://yourscrap.vercel.app/${page.slug}`,
    telephone: `+91${WHATSAPP_NUMBER}`,
    areaServed: {
      '@type': 'City',
      name: page.area,
      sameAs: `https://en.wikipedia.org/wiki/Coimbatore`,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: page.area,
      addressRegion: 'Tamilnadu',
      addressCountry: 'IN',
    },
    priceRange: '₹',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://yourscrap.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: page.h1, item: `https://yourscrap.vercel.app/${page.slug}` },
    ],
  };

  return (
    <div className="bg-black min-h-screen">
      <SeoHead
        title={page.title}
        description={page.description}
        keywords={page.keywords}
        canonical={`/${page.slug}`}
        schema={[localBusinessSchema, breadcrumbSchema]}
      />

      <Navbar />

      <FAQSchema faqs={page.faqs} />

      <section className="relative pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-scrap-green/5 via-transparent to-transparent" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-400">{page.h1}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {page.h1}
            </h1>

            <div className="flex items-center gap-2 text-scrap-green mb-6">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Serving all areas in {page.area}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {page.areasServed.slice(0, 8).map((area) => (
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
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-invert max-w-none"
          >
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl glass mb-8 sm:mb-10">
              <div className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
                {page.content}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-16"
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {page.faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 sm:p-6 rounded-2xl glass"
                >
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-2">{faq.question}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl sm:rounded-3xl glass"
          >
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-5 h-5 text-scrap-green fill-scrap-green" />
              <h2 className="text-lg sm:text-xl font-bold text-white">Why Choose YourScrap?</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 sm:mt-16"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Areas We Serve</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {areas.map((area) => (
                <Link
                  key={area.name}
                  to={area.slug}
                  className="p-3 sm:p-4 rounded-xl glass hover:bg-white/[0.05] transition-all text-sm text-slate-400 hover:text-white"
                >
                  {area.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
