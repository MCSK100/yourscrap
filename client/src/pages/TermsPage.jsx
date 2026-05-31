import SeoHead from '../components/SeoHead';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function TermsPage() {
  return (
    <div className="bg-black min-h-screen">
      <SeoHead
        title="Terms of Service - YourScrap"
        description="YourScrap terms of service. Understand the terms and conditions for using our scrap pickup and recycling services in Coimbatore."
        canonical="/terms"
      />
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Terms of Service</h1>
          <div className="space-y-6 text-sm sm:text-base text-slate-400 leading-relaxed">
            <p>Last updated: January 2026</p>
            {[
              { title: 'Service Description', content: 'YourScrap provides scrap pickup and recycling services in Coimbatore. By booking a pickup, you agree to these terms and conditions.' },
              { title: 'Booking and Cancellation', content: 'Pickups can be booked through our website or WhatsApp. You may cancel or reschedule a booking at no charge up to 2 hours before the scheduled time.' },
              { title: 'Pricing and Payment', content: 'Scrap prices are determined based on current market rates and the quality of items. Prices are quoted at the time of pickup after inspection. Payment is made instantly via UPI or cash.' },
              { title: 'Pickup Process', content: 'Our team will arrive at the scheduled time. Items will be weighed digitally in your presence. You will receive payment immediately after weighing.' },
              { title: 'Item Eligibility', content: 'We accept most types of scrap including iron, steel, copper, aluminum, brass, plastic, paper, and e-waste. Hazardous materials and certain restricted items may not be accepted.' },
              { title: 'Limitation of Liability', content: 'YourScrap shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability is limited to the value of the scrap being collected.' },
              { title: 'Changes to Terms', content: 'We reserve the right to modify these terms at any time. Changes will be effective upon posting to our website. Continued use of our services constitutes acceptance of updated terms.' },
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
