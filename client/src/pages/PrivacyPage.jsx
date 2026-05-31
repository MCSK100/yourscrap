import SeoHead from '../components/SeoHead';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function PrivacyPage() {
  return (
    <div className="bg-black min-h-screen">
      <SeoHead
        title="Privacy Policy - YourScrap"
        description="YourScrap privacy policy. Learn how we collect, use, and protect your personal information when you use our scrap pickup service in Coimbatore."
        canonical="/privacy"
      />
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          <div className="space-y-6 text-sm sm:text-base text-slate-400 leading-relaxed">
            <p>Last updated: January 2026</p>
            {[
              { title: 'Information We Collect', content: 'We collect information you provide when booking a pickup including your name, phone number, email address, and pickup address. We also collect information about the scrap items you wish to sell.' },
              { title: 'How We Use Your Information', content: 'We use your information to schedule and manage scrap pickups, communicate with you about your bookings, process payments, and improve our services. We may also use your contact information to send service-related updates.' },
              { title: 'Data Protection', content: 'We implement appropriate security measures to protect your personal information. Your data is stored securely and accessed only by authorized personnel for service delivery purposes.' },
              { title: 'Information Sharing', content: 'We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our platform and delivering services, subject to confidentiality agreements.' },
              { title: 'Data Retention', content: 'We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your data by contacting us.' },
              { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal information held by us. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us.' },
              { title: 'Contact Us', content: 'If you have any questions about this privacy policy, please contact us via WhatsApp at +91 9080405581.' },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-semibold text-white mb-2">{section.title}</h2>
                <p>{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
