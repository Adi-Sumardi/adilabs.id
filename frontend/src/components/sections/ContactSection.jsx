export default function ContactSection() {
  return (
    <section id="kontak" className="public-section">
      <h2>Hubungi Kami</h2>
      <p>Punya ide produk atau butuh solusi digital? Ceritakan kebutuhan Anda ke tim kami.</p>

      <div className="contact-row">
        <a href="mailto:adisumardi888@gmail.com" className="btn btn-primary">Email Kami</a>
        <a href="https://wa.me/6285121379697" target="_blank" rel="noreferrer" className="btn btn-outline">Chat WhatsApp</a>
      </div>
    </section>
  );
}
