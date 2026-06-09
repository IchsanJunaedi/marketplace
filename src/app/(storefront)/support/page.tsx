import Navbar from "@/components/Navbar";

export const metadata = {
  title: "HerbalStore - Support",
  description: "Layanan bantuan pelanggan HerbalStore.",
};

const faqs = [
  { q: "How do I track my order?", a: "You can track your order from your Account page under 'My Orders'. A tracking link will also be emailed to you once your order is dispatched." },
  { q: "What is the return policy?", a: "We offer a 30-day hassle-free return policy. Items must be in original packaging. Contact our support team to initiate a return request." },
  { q: "Berapa lama waktu pengiriman?", a: "Pengiriman standar memakan waktu 3–7 hari kerja. Pilihan pengiriman cepat (1–2 hari) tersedia saat checkout. Gratis ongkos kirim untuk pesanan di atas Rp500.000." },
  { q: "Apakah Anda menawarkan harga grosir?", a: "Ya! Kami menawarkan diskon volume untuk pesanan grosir (minimal 10 unit). Hubungi tim penjualan kami di sales@herbalstore.com untuk penawaran khusus." },
  { q: "How do I cancel an order?", a: "Orders can be cancelled within 1 hour of placement. After that, please wait for delivery and initiate a return." },
];

export default function SupportPage() {
  return (
    <div className="bg-background text-on-background antialiased min-h-screen flex flex-col">
      <Navbar active="Support" />
      <main className="flex-1 pt-24 pb-16 px-6 w-full max-w-[1440px] mx-auto flex flex-col gap-12">
        {/* Hero */}
        <section className="text-center flex flex-col items-center gap-4 mt-4">
          <span className="bg-secondary-container text-surface-tint font-label-caps text-label-caps uppercase px-3 py-1 rounded-sm tracking-wider">Help Center</span>
          <h1 className="font-h1 text-h1 text-on-background text-4xl font-black">How can we help you?</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[32rem]">Cari di pusat bantuan kami atau hubungi langsung tim layanan pelanggan kami.</p>
          <div className="relative w-full max-w-[32rem] mt-2">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all placeholder:text-on-surface-variant shadow-sm" placeholder="Search for help articles..." type="text" />
          </div>
        </section>

        {/* Contact Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "chat", title: "Live Chat", desc: "Available Mon–Fri, 9am–6pm WIB. Average response time: 2 min.", action: "Start Chat", actionClass: "bg-primary text-on-primary hover:bg-surface-tint" },
            { icon: "mail", title: "Email Support", desc: "Send us a detailed message. We respond within 24 hours.", action: "Send Email", actionClass: "border border-outline text-on-surface hover:bg-surface-container" },
            { icon: "phone_in_talk", title: "Phone Support", desc: "Call us at +62-800-1234-5678. Enterprise & Premium members get priority.", action: "Call Now", actionClass: "border border-outline text-on-surface hover:bg-surface-container" },
          ].map((card) => (
            <div key={card.title} className="bg-surface-container-lowest border border-surface-variant rounded-lg p-6 flex flex-col gap-4 hover:border-outline transition-colors">
              <div className="bg-secondary-container w-12 h-12 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-surface-tint text-[24px]">{card.icon}</span>
              </div>
              <div>
                <h3 className="font-h2 text-h2 text-on-background">{card.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{card.desc}</p>
              </div>
              <button className={`mt-auto px-4 py-2 rounded font-body-sm text-body-sm font-medium transition-colors ${card.actionClass}`}>{card.action}</button>
            </div>
          ))}
        </section>

        {/* FAQ */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-surface-variant pb-4">
            <h2 className="font-h2 text-h2 text-on-background text-xl font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-surface-container-lowest border border-surface-variant rounded-lg group open:border-primary transition-colors">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-body-md text-body-md font-medium text-on-background list-none select-none">
                  {faq.q}
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform duration-200">expand_more</span>
                </summary>
                <div className="px-6 pb-5 font-body-md text-body-md text-on-surface-variant border-t border-surface-variant pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
