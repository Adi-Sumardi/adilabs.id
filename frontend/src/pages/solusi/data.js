// Isi halaman solusi/produk. Hanya tulis kemampuan yang memang bisa didemokan/dikerjakan.
export const SOLUTIONS = {
  "tagihan-spp": {
    "slug": "tagihan-spp",
    "demoId": "karya-spp",
    "wa": "https://wa.me/6285121379697?text=Halo%20AdiLabs%2C%20saya%20ingin%20membahas%20tagihan%20SPP%20dan%20pengingat%20WhatsApp%20untuk%20%5Bnama%20instansi%5D.%20Proses%20yang%20ingin%20kami%20rapikan%3A%20%5Bmasalah%20utama%5D.%20Saat%20ini%20kami%20memakai%20%5Bcara/sistem%20saat%20ini%5D.%20Apakah%20bisa%20dijadwalkan%20diskusi%20kebutuhan%3F",
    "title": "Aplikasi Tagihan SPP & Pengingat WhatsApp untuk Sekolah dan Yayasan | AdiLabs",
    "desc": "Tagihan SPP terbit otomatis, pengingat lewat WhatsApp, dan rekap tunggakan untuk bendahara. Dikembangkan sesuai alur keuangan sekolah dan yayasan Anda.",
    "kick": "Solusi · Sekolah & yayasan",
    "h1": "Tagihan SPP dan pengingat WhatsApp yang tertib",
    "lead": "Tagihan terbit otomatis setiap periode, orang tua diingatkan lewat WhatsApp, dan bendahara langsung melihat rekap tunggakan, tanpa menyusun spreadsheet dan mengirim pesan satu per satu.",
    "who": [
      [
        "Bendahara",
        "Menerbitkan tagihan, mencatat pembayaran, dan memantau tunggakan."
      ],
      [
        "Kepala sekolah & pengurus",
        "Melihat laporan penerimaan dan tunggakan per periode."
      ],
      [
        "Orang tua / wali",
        "Menerima tagihan dan pengingat lewat WhatsApp."
      ]
    ],
    "problems": [
      "Tagihan dibuat manual setiap bulan di spreadsheet.",
      "Pengingat dikirim satu per satu lewat chat pribadi.",
      "Sulit melihat siapa yang menunggak dan sudah berapa lama.",
      "Pencocokan bukti transfer memakan waktu bendahara."
    ],
    "flow": [
      [
        "Data siswa & tarif",
        "Data siswa, kelas, dan tarif disiapkan, bisa diimpor dari spreadsheet yang sudah ada."
      ],
      [
        "Tagihan terbit otomatis",
        "Tagihan dibuat sendiri setiap periode sesuai tarif masing-masing siswa."
      ],
      [
        "Pengingat WhatsApp terjadwal",
        "Pengingat dikirim lewat Sendago sebelum dan sesudah jatuh tempo."
      ],
      [
        "Pembayaran dicatat",
        "Otomatis bila terhubung payment gateway (VA/QRIS), atau dikonfirmasi bendahara."
      ],
      [
        "Rekap & laporan",
        "Rekap tunggakan per siswa dan laporan penerimaan untuk pengurus."
      ]
    ],
    "outputs": [
      "Daftar tagihan per kelas lengkap dengan status",
      "Rekap tunggakan per siswa",
      "Riwayat pengingat yang terkirim",
      "Laporan penerimaan bulanan"
    ],
    "needs": [
      "Data siswa dan tarif (spreadsheet sudah cukup).",
      "Nomor WhatsApp pengirim untuk Sendago.",
      "Opsional: payment gateway (VA/QRIS) dengan akun merchant atas nama lembaga.",
      "Server atau hosting: bisa milik Anda, atau kami bantu siapkan."
    ],
    "limits": [
      "Pengingat WhatsApp bergantung pada nomor orang tua yang valid dan aturan WhatsApp.",
      "Status lunas otomatis hanya bila terhubung payment gateway; tanpa itu, konfirmasi dilakukan bendahara.",
      "Keputusan keringanan atau dispensasi tetap di tangan pihak sekolah/yayasan."
    ],
    "faq": [
      [
        "Berapa biayanya?",
        "Biaya ditentukan setelah diskusi kebutuhan, berdasarkan jumlah modul, integrasi, dan pengguna, lalu dituangkan dalam penawaran tertulis."
      ],
      [
        "Bisa dipakai tanpa payment gateway?",
        "Bisa. Pembayaran dicatat oleh bendahara, sedangkan tagihan, pengingat, dan rekap tetap berjalan otomatis."
      ],
      [
        "Bisa terhubung dengan sistem yang sudah ada (SIAKAD/PMB)?",
        "Bisa dibahas. Tergantung akses data dari sistem tersebut."
      ],
      [
        "Apakah data siswa aman?",
        "Data disimpan di server yang disepakati, akses dibatasi sesuai peran, dan hanya dipakai untuk menjalankan aplikasi Anda."
      ]
    ],
    "demo": "Tagihan SPP + Sendago"
  },
  "approval-anggaran": {
    "slug": "approval-anggaran",
    "demoId": "karya-approval",
    "liveDemo": {
      "name": "SIANGGAR",
      "url": "https://sianggar.adilabs.id",
      "waUrl": "https://wa.me/6285121379697?text=Halo%20AdiLabs%2C%20saya%20ingin%20mencoba%20demo%20SIANGGAR%20%28aplikasi%20pengajuan%20%26%20persetujuan%20anggaran%29%20untuk%20%5Bnama%20instansi%5D.%20Mohon%20dikirimkan%20akun%20demonya.",
      "page": "/sianggar"
    },
    "wa": "https://wa.me/6285121379697?text=Halo%20AdiLabs%2C%20saya%20ingin%20membahas%20pengajuan%20dan%20persetujuan%20anggaran%20untuk%20%5Bnama%20instansi%5D.%20Proses%20yang%20ingin%20kami%20rapikan%3A%20%5Bmasalah%20utama%5D.%20Saat%20ini%20kami%20memakai%20%5Bcara/sistem%20saat%20ini%5D.%20Apakah%20bisa%20dijadwalkan%20diskusi%20kebutuhan%3F",
    "title": "Aplikasi Pengajuan & Persetujuan Anggaran untuk Kantor dan Yayasan | AdiLabs",
    "desc": "Pengajuan anggaran dicek kelengkapannya, disetujui berjenjang, dan setiap tahap dikabarkan lewat WhatsApp & email. Dikembangkan sesuai alur persetujuan organisasi Anda.",
    "kick": "Solusi · Kantor & yayasan",
    "h1": "Pengajuan dan persetujuan anggaran yang jelas jejaknya",
    "lead": "Setiap pengajuan diperiksa kelengkapannya, disetujui berjenjang sesuai matriks organisasi Anda, dan setiap tahapnya dikabarkan lewat WhatsApp & email, sehingga semua pihak tahu posisi pengajuan dan sisa anggaran.",
    "who": [
      [
        "Staf / unit pengaju",
        "Mengajukan anggaran beserta lampiran dan memantau statusnya."
      ],
      [
        "Manajer & finance",
        "Meninjau, memberi catatan, dan menyetujui sesuai kewenangan."
      ],
      [
        "Pimpinan / pengurus yayasan",
        "Melihat realisasi dan sisa anggaran per divisi atau unit."
      ]
    ],
    "problems": [
      "Pengajuan lewat chat atau kertas sulit dilacak.",
      "Lampiran sering kurang sehingga harus bolak-balik.",
      "Tidak jelas pengajuan sedang menunggu di meja siapa.",
      "Sisa anggaran per divisi baru ketahuan di akhir periode."
    ],
    "flow": [
      [
        "Pengajuan dibuat",
        "Staf mengisi pengajuan dan melampirkan dokumen pendukung."
      ],
      [
        "Pemeriksaan otomatis",
        "Sistem menandai lampiran yang kurang, nominal di atas plafon, atau kemungkinan pengajuan ganda. Sistem hanya menandai, tidak memutuskan."
      ],
      [
        "Persetujuan berjenjang",
        "Pengajuan bergerak sesuai matriks, misalnya manajer → finance → pimpinan."
      ],
      [
        "Notifikasi tiap tahap",
        "Pemohon dan penyetuju dikabari lewat WhatsApp & email (Sendago)."
      ],
      [
        "Realisasi & laporan",
        "Pemakaian dan sisa anggaran per divisi tercatat untuk laporan periode."
      ]
    ],
    "outputs": [
      "Status pengajuan yang bisa dipantau kapan saja",
      "Riwayat persetujuan: siapa, kapan, dan catatannya",
      "Sisa anggaran per divisi atau unit",
      "Laporan realisasi per periode"
    ],
    "needs": [
      "Struktur divisi/unit dan matriks persetujuan.",
      "Pos anggaran dan plafon per periode.",
      "Nomor WhatsApp atau email pengirim notifikasi.",
      "Opsional: integrasi ke sistem akuntansi yang dipakai."
    ],
    "limits": [
      "Pemeriksaan otomatis menandai hal yang perlu dicek; keputusan tetap pada pejabat yang berwenang.",
      "Ketepatan pemeriksaan bergantung pada kelengkapan data plafon dan pos anggaran.",
      "Integrasi akuntansi bergantung pada akses ke sistem yang Anda pakai."
    ],
    "faq": [
      [
        "Berapa biayanya?",
        "Biaya ditentukan setelah diskusi kebutuhan, berdasarkan jumlah modul, integrasi, dan pengguna, lalu dituangkan dalam penawaran tertulis."
      ],
      [
        "Bisakah alur persetujuan berbeda per jenis atau nominal?",
        "Bisa. Matriks persetujuan dirancang sesuai aturan organisasi Anda."
      ],
      [
        "Apakah AI yang menyetujui pengajuan?",
        "Tidak. Sistem hanya membantu memeriksa dan menandai; persetujuan tetap dilakukan orang yang berwenang."
      ],
      [
        "Bisa dibuka dari HP?",
        "Bisa. Aplikasi berbasis web dan dapat dibuka dari HP maupun komputer."
      ]
    ],
    "demo": "Budget Flow + Sendago"
  },
  "sianggar": {
    "slug": "sianggar",
    "path": "/sianggar",
    "demoId": "karya-approval",
    "wa": "https://wa.me/6285121379697?text=Halo%20AdiLabs%2C%20saya%20tertarik%20dengan%20SIANGGAR%20untuk%20%5Bnama%20yayasan/sekolah%5D.%20Saat%20ini%20pengajuan%20anggaran%20kami%20dilakukan%20dengan%20%5Bcara/sistem%20saat%20ini%5D.%20Apakah%20bisa%20dijadwalkan%20diskusi%20dan%20demo%3F",
    "title": "SIANGGAR – Aplikasi Anggaran, RAPBS & LPJ Yayasan Pendidikan",
    "desc": "Pengajuan anggaran per unit, persetujuan berjenjang, RAPBS/APBS, LPJ, serta notifikasi WhatsApp & email dalam satu aplikasi untuk yayasan pendidikan. Coba demonya.",
    "kick": "Aplikasi · Yayasan pendidikan",
    "h1": "SIANGGAR: pengajuan anggaran, persetujuan, dan LPJ yayasan dalam satu aplikasi",
    "lead": "Setiap unit mengajukan dana sesuai RAPBS, pengajuan diperiksa keuangan dan disetujui berjenjang sesuai nominal dan bidang, lalu dipertanggungjawabkan lewat LPJ, dengan notifikasi WhatsApp & email di setiap tahap.",
    "status": "Status: <b>aplikasi sudah tersedia</b> dan dikonfigurasi sesuai struktur unit, bidang, dan aturan persetujuan yayasan Anda. Demo memakai data demo.",
    "who": [
      [
        "Unit sekolah & bagian",
        "Menyusun RAPBS, mengajukan dana beserta lampiran, merevisi bila diminta, dan membuat LPJ."
      ],
      [
        "Staf keuangan",
        "Memeriksa kelengkapan, kesesuaian mata anggaran, serta kewajaran volume dan harga sebelum diteruskan."
      ],
      [
        "Direktur & pimpinan yayasan",
        "Menyetujui sesuai kewenangan dan nominal, serta memantau pemakaian anggaran per unit."
      ]
    ],
    "problems": [
      "Pengajuan dana dari banyak unit lewat kertas atau chat sulit dilacak.",
      "Sulit memastikan pengajuan sesuai RAPBS dan sisa anggaran mata anggarannya.",
      "Jalur persetujuan yang berbeda per nominal dan bidang sering membingungkan.",
      "LPJ terlambat dan bukti pengeluaran tercecer."
    ],
    "flow": [
      [
        "Perencanaan RAPBS/APBS",
        "Mata anggaran, plafon, dan program prioritas per unit disusun, disahkan, dan bisa dicetak."
      ],
      [
        "Pengajuan dana",
        "Unit mengisi pengajuan (5W+1H) dengan lampiran; saldo dan persentase pemakaian anggaran terlihat langsung."
      ],
      [
        "Pemeriksaan keuangan",
        "Checklist kelengkapan dan kesesuaian; pengajuan bisa diminta revisi atau ditolak dengan catatan, dan saldo dikembalikan bila ditolak."
      ],
      [
        "Persetujuan berjenjang",
        "Pengajuan bergerak ke penyetuju sesuai alur yang diatur Admin (misalnya berdasarkan nominal dan bidang); setiap tahap dikabarkan lewat WhatsApp & email."
      ],
      [
        "Pencairan & LPJ",
        "Surat permohonan dan voucher pencairan dicetak, jurnal pencairan tercatat, lalu kegiatan dipertanggungjawabkan lewat LPJ."
      ]
    ],
    "features": [
      [
        "Alur approval bisa diatur Admin",
        "Tahap dan penyetuju diatur sendiri oleh Admin sesuai aturan yayasan, tanpa mengubah kode."
      ],
      [
        "Peta Antrian Approval",
        "Pimpinan dan pengendali melihat di mana setiap pengajuan & LPJ sedang menunggu."
      ],
      [
        "Notifikasi WhatsApp & email",
        "Pengaju dan penyetuju dikabari di setiap tahap."
      ],
      [
        "Cetak surat & voucher",
        "Surat Permohonan dengan kop per unit, RAPBS/APBS, dan voucher pencairan."
      ],
      [
        "Perubahan anggaran",
        "Perubahan anggaran diajukan dan disetujui lewat antrian approval."
      ],
      [
        "Tur fitur & panduan",
        "Setiap dashboard dilengkapi tur singkat supaya pengguna baru cepat paham."
      ]
    ],
    "outputs": [
      "Status setiap pengajuan & LPJ per unit",
      "Jejak persetujuan dan catatan revisi per pengajuan",
      "Realisasi dan sisa anggaran per mata anggaran",
      "Dokumen cetak: surat permohonan, RAPBS/APBS, voucher"
    ],
    "needs": [
      "Struktur unit/bagian dan bidang di yayasan.",
      "Aturan persetujuan: siapa menyetujui apa, dan batas nominalnya.",
      "Data RAPBS atau mata anggaran yang berjalan.",
      "Nomor WhatsApp dan email pengirim notifikasi.",
      "Server/hosting: milik yayasan atau kami bantu siapkan."
    ],
    "limits": [
      "Jalur persetujuan mengikuti aturan yang dikonfigurasi; perubahan aturan perlu diperbarui di sistem.",
      "Keputusan persetujuan tetap di tangan pejabat yang berwenang.",
      "Notifikasi WhatsApp bergantung pada nomor penerima yang valid dan layanan pengirim WhatsApp."
    ],
    "faq": [
      [
        "Berapa biayanya?",
        "Biaya ditentukan setelah diskusi, berdasarkan jumlah unit, pengguna, penyesuaian alur, dan integrasi, lalu dituangkan dalam penawaran tertulis."
      ],
      [
        "Bisakah disesuaikan dengan struktur yayasan kami?",
        "Bisa. Unit dan bidang disiapkan sesuai struktur Anda, dan alur persetujuan dapat diatur Admin langsung di aplikasi."
      ],
      [
        "Apakah bisa dicoba dulu?",
        "Bisa. Minta akun demo lewat WhatsApp, lalu coba langsung di sianggar.adilabs.id dengan data demo."
      ],
      [
        "Apakah bisa dipakai di luar sekolah?",
        "SIANGGAR dikembangkan untuk yayasan pendidikan dengan banyak unit. Untuk organisasi lain, penyesuaiannya bisa dibahas."
      ]
    ],
    "demo": "SIANGGAR",
    "liveDemo": {
      "name": "SIANGGAR",
      "url": "https://sianggar.adilabs.id",
      "waUrl": "https://wa.me/6285121379697?text=Halo%20AdiLabs%2C%20saya%20ingin%20mencoba%20demo%20SIANGGAR%20%28aplikasi%20pengajuan%20%26%20persetujuan%20anggaran%29%20untuk%20%5Bnama%20instansi%5D.%20Mohon%20dikirimkan%20akun%20demonya."
    }
  }
};
