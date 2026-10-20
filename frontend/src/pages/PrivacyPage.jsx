import PageShell, { usePageMeta } from '../components/PageShell';

export default function PrivacyPage() {
  usePageMeta('Kebijakan Privasi | AdiLabs', 'Bagaimana AdiLabs mengumpulkan, memakai, dan menjaga data saat Anda mengunjungi situs atau menghubungi kami.');
  return (
    <PageShell>
      <article className="sol-hero sol-doc">
        <nav className="sol-crumb" aria-label="Breadcrumb"><a href="/">Beranda</a> / <span>Kebijakan Privasi</span></nav>
        <h1>Kebijakan Privasi</h1>
        <p className="sol-status">Berlaku sejak 20 Oktober 2026.</p>

        <h2>Data yang kami terima</h2>
        <ul className="sol-list">
          <li><b>Data yang Anda kirim sendiri</b> saat menghubungi kami lewat WhatsApp atau email, misalnya nama, nama instansi, nomor kontak, dan gambaran kebutuhan.</li>
          <li><b>Data teknis kunjungan</b> seperti halaman yang dibuka dan tombol yang diklik, bila layanan analitik diaktifkan. Data ini tidak mencakup isi pesan Anda.</li>
        </ul>

        <h2>Cara kami memakainya</h2>
        <ul className="sol-list">
          <li>Membalas pertanyaan dan menyiapkan diskusi kebutuhan serta penawaran.</li>
          <li>Memahami halaman mana yang berguna supaya situs bisa diperbaiki.</li>
        </ul>
        <p className="sol-p">Kami tidak menjual data Anda dan tidak membagikannya kepada pihak lain untuk kepentingan pemasaran mereka.</p>

        <h2>Layanan pihak ketiga</h2>
        <p className="sol-p">Percakapan lewat WhatsApp dan email diproses oleh penyedia layanan tersebut sesuai kebijakan privasi masing-masing. Bila analitik diaktifkan, data kunjungan diproses oleh penyedia analitik yang kami gunakan.</p>

        <h2>Data dalam proyek aplikasi</h2>
        <p className="sol-p">Data organisasi yang diolah di dalam aplikasi yang kami kembangkan (misalnya data siswa, karyawan, atau keuangan) diatur dalam penawaran atau perjanjian kerja sama dengan masing-masing klien, termasuk lokasi penyimpanan dan hak aksesnya.</p>

        <h2>Penyimpanan dan hak Anda</h2>
        <p className="sol-p">Data kontak disimpan selama diperlukan untuk komunikasi dan kerja sama. Anda dapat meminta kami menunjukkan, memperbaiki, atau menghapus data kontak Anda dengan menghubungi kami.</p>

        <h2>Kontak</h2>
        <p className="sol-p">Pertanyaan tentang kebijakan ini dapat dikirim ke <a href="mailto:adisumardi888@gmail.com">adisumardi888@gmail.com</a> atau lewat WhatsApp di tombol pada halaman ini.</p>
        <p className="sol-p">Kebijakan ini dapat diperbarui. Versi terbaru selalu tersedia di halaman ini.</p>
      </article>
    </PageShell>
  );
}
