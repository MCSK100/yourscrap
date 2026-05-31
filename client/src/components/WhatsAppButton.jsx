import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

const WHATSAPP_NUMBER = '9080405581';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const quickMessages = [
  { label: 'Book a Pickup', message: 'Hi! I want to book a scrap pickup.' },
  { label: 'Check Prices', message: 'Hi! What are your current scrap rates?' },
  { label: 'Same-Day Pickup', message: 'Hi! Is same-day pickup available?' },
];

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleQuickMessage = (msg) => {
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-2 w-72"
          >
            <div className="glass rounded-2xl p-4 shadow-glow-green">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-scrap-green/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-scrap-green" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">YourScrap</p>
                  <p className="text-xs text-slate-500">We reply instantly</p>
                </div>
              </div>
              <div className="space-y-2">
                {quickMessages.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleQuickMessage(item.message)}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-sm text-slate-400 hover:text-white transition-all border border-white/[0.03]"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-center py-2.5 rounded-xl bg-scrap-green text-black text-sm font-semibold hover:bg-scrap-green/90 transition-all"
              >
                Chat with us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-slate-800 rotate-45' : 'bg-scrap-green'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Chat on WhatsApp'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-black" />
        )}
      </motion.button>
    </div>
  );
}
