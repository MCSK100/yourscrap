import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone } from 'lucide-react';

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches;
const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const DISMISSED_KEY = 'pwa-install-dismissed';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);

    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) {
      return () => mq.removeEventListener('change', handler);
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (isIOS() && isSafari() && !dismissed) {
      setShow(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      mq.removeEventListener('change', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShow(false);
      }
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, 'true');
  };

  const isIOSDevice = isIOS() && isSafari();

  return (
    <AnimatePresence>
      {show && isMobile && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <div className="relative rounded-2xl bg-scrap-surface/95 backdrop-blur-xl border border-scrap-border p-4 shadow-glow-green">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 rounded-full text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-scrap-green/20 flex items-center justify-center">
                {isIOSDevice ? (
                  <Smartphone className="w-5 h-5 text-scrap-green" />
                ) : (
                  <Download className="w-5 h-5 text-scrap-green" />
                )}
              </div>

              <div className="flex-1 min-w-0 pr-6">
                <p className="text-sm font-semibold text-white">Install YourScrap</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isIOSDevice
                    ? 'Tap the Share button and select "Add to Home Screen"'
                    : 'Install the app for a faster, offline-ready experience'}
                </p>
              </div>

              {!isIOSDevice && deferredPrompt && (
                <button
                  onClick={handleInstall}
                  className="shrink-0 px-4 py-2 rounded-full bg-scrap-green text-black text-xs font-semibold hover:shadow-glow-green transition-all duration-300"
                >
                  Install
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
