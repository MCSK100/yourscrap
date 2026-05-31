import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronRight } from 'lucide-react';

const WHATSAPP_NUMBER = '9080405581';

const footerLinks = {
  services: [
    { label: 'Iron Scrap', href: '/iron-scrap-buyers-coimbatore' },
    { label: 'Paper Scrap', href: '/paper-scrap-buyers-coimbatore' },
    { label: 'E-Waste', href: '/ewaste-collection-coimbatore' },
    { label: 'Scrap Buyers', href: '/scrap-buyers-coimbatore' },
  ],
  areas: [
    { label: 'Peelamedu', href: '/scrap-pickup-peelamedu' },
    { label: 'RS Puram', href: '/scrap-pickup-rs-puram' },
    { label: 'Gandhipuram', href: '/scrap-buyers-coimbatore' },
    { label: 'Saravanampatti', href: '/scrap-buyers-coimbatore' },
  ],
  company: [
    { label: 'Home', href: '/' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/[0.03] overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src="/scraplogo.png" alt="YourScrap" className="h-14 w-auto" />
            </Link>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Coimbatore's most trusted scrap pickup platform. Turn your old scrap into instant cash with free doorstep pickup.
            </p>
            <div className="space-y-2 text-sm text-slate-500">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="flex items-center gap-2 hover:text-scrap-green transition-colors">
                <Phone className="w-3.5 h-3.5" />
                +91 {WHATSAPP_NUMBER}
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                Coimbatore, Tamilnadu
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-slate-500 hover:text-scrap-green transition-colors flex items-center gap-1 group">
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Areas We Serve</h4>
            <ul className="space-y-2.5">
              {footerLinks.areas.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-slate-500 hover:text-scrap-green transition-colors flex items-center gap-1 group">
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-slate-500 hover:text-scrap-green transition-colors flex items-center gap-1 group">
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} YourScrap. All rights reserved. | Coimbatore, Tamilnadu
          </p>
          <div className="flex gap-4 text-xs text-slate-600">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
