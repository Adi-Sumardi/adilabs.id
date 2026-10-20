export default function ContactSection() {
  return (
    <section id="kontak" className="public-section">
      <h2>Hubungi Kami</h2>
      <p>Punya ide produk atau butuh solusi digital? Ceritakan kebutuhan Anda ke tim kami.</p>

      <div className="contact-row">
        <a href="mailto:adisumardi888@gmail.com" className="btn btn-primary" data-track="email_click" data-loc="kontak">Email Kami</a>
        <a href="https://wa.me/6285121379697?text=Halo%20AdiLabs%2C%20saya%20ingin%20membahas%20aplikasi%20untuk%20%5Bnama%20instansi%5D.%20Proses%20yang%20ingin%20kami%20rapikan%3A%20%5Bmasalah%20utama%5D.%20Saat%20ini%20kami%20memakai%20%5Bcara/sistem%20saat%20ini%5D.%20Apakah%20bisa%20dijadwalkan%20diskusi%20kebutuhan%3F" target="_blank" rel="noreferrer" className="btn btn-outline" data-track="whatsapp_click" data-loc="kontak">Chat WhatsApp</a>
      </div>
    </section>
  );
}
