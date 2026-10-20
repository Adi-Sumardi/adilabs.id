import { Link } from 'react-router-dom';
import CostBreakdown from '../CostBreakdown';

const WA_URL = 'https://wa.me/6285121379697?text=Halo%20AdiLabs%2C%20saya%20ingin%20membahas%20aplikasi%20untuk%20%5Bnama%20instansi%5D.%20Proses%20yang%20ingin%20kami%20rapikan%3A%20%5Bmasalah%20utama%5D.%20Saat%20ini%20kami%20memakai%20%5Bcara/sistem%20saat%20ini%5D.%20Apakah%20bisa%20dijadwalkan%20diskusi%20kebutuhan%3F';

const TERMS = [
  {
    q: 'Bagaimana biaya ditentukan?',
    a: 'Setelah diskusi kebutuhan, kami menyusun rancangan alur dan cakupan pekerjaan. Biaya dihitung dari jumlah modul, integrasi (misalnya WhatsApp atau payment gateway), dan jumlah pengguna, lalu dituangkan dalam penawaran tertulis sebelum pekerjaan dimulai.',
  },
  {
    q: 'Apa saja cakupan pendampingan?',
    a: 'Pelatihan untuk admin dan pengguna, perbaikan bug, serta penyesuaian kecil selama masa dukungan yang disepakati di penawaran. Bantuan dilakukan lewat WhatsApp.',
  },
  {
    q: 'Bagaimana data kami dikelola?',
    a: 'Data organisasi disimpan di server yang disepakati (bisa milik Anda sendiri), dengan akses sesuai peran pengguna, dan hanya dipakai untuk menjalankan aplikasi Anda.',
  },
];

export default function ContactSection() {
  return (
    <section id="kontak" className="public-section">
      <h2>Hubungi Kami</h2>
      <p>Ceritakan proses di kantor atau yayasan Anda yang ingin dirapikan. Kami bahas kebutuhannya dulu, baru menyusun solusi yang sesuai.</p>

      <div className="contact-row">
        <a href={WA_URL} target="_blank" rel="noreferrer" className="btn btn-primary" data-track="whatsapp_click" data-loc="kontak">Diskusikan Kebutuhan</a>
        <a href="mailto:adisumardi888@gmail.com" className="btn btn-outline" data-track="email_click" data-loc="kontak">Email Kami</a>
      </div>

      <div className="terms-grid" aria-label="Cara kerja sama">
        {TERMS.map((t) => (
          <div className="terms-item" key={t.q}>
            <h3>{t.q}</h3>
            <p>{t.a}</p>
          </div>
        ))}
      </div>
      <CostBreakdown />
      <p className="terms-note">
        Setiap solusi dikembangkan dan dikonfigurasi sesuai alur kerja organisasi Anda. Baca juga <Link to="/kebijakan-privasi">Kebijakan Privasi</Link>.
      </p>
    </section>
  );
}
