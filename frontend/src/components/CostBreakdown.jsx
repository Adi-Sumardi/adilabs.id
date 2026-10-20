// Komponen biaya & persiapan estimasi (audit marketing 20 Okt, P2).
// Sengaja tanpa angka: kisaran harga baru dicantumkan setelah ditetapkan internal.
const ONCE = [
  'Perancangan alur & desain tampilan',
  'Pengembangan aplikasi & integrasi',
  'Penyiapan server dan akun layanan',
  'Migrasi data dari spreadsheet/sistem lama, bila ada',
  'Pelatihan admin dan pengguna',
];
const RECURRING = [
  'Server/hosting, bila tidak memakai server Anda sendiri',
  'Pengiriman WhatsApp & email (Sendago), sesuai volume',
  'Biaya transaksi payment gateway, dibayar ke penyedianya',
  'Pemeliharaan & dukungan setelah masa dukungan awal',
];
const PREP = [
  'Jenis instansi dan perkiraan jumlah pengguna',
  'Proses yang ingin dirapikan dan cara kerja saat ini',
  'Contoh dokumen atau spreadsheet yang dipakai sekarang',
  'Integrasi yang dibutuhkan (WhatsApp, payment gateway, sistem lain)',
  'Target waktu mulai dipakai',
];

export default function CostBreakdown({ className = '' }) {
  return (
    <div className={`cost-box ${className}`}>
      <div className="cost-col">
        <h3>Biaya sekali bayar</h3>
        <ul>{ONCE.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
      <div className="cost-col">
        <h3>Biaya berulang <small>(bila dipakai)</small></h3>
        <ul>{RECURRING.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
      <div className="cost-col cost-prep">
        <h3>Untuk mendapat estimasi, siapkan</h3>
        <ul>{PREP.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
      <p className="cost-note">Komponen yang berlaku dan nilainya dirinci dalam penawaran tertulis setelah diskusi kebutuhan. Tidak semua komponen dibutuhkan di setiap proyek.</p>
    </div>
  );
}
