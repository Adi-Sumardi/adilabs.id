import { useParams } from 'react-router-dom';
import PageShell, { usePageMeta } from '../../components/PageShell';
import NotFound from '../NotFound';
import { SOLUTIONS } from './data';
import CostBreakdown from '../../components/CostBreakdown';
import '../../styles/sections.css';

const STEPS = ['Diskusi kebutuhan', 'Rancangan alur & cakupan', 'Penawaran tertulis (biaya & jadwal)', 'Pengembangan & uji coba', 'Pelatihan & mulai dipakai'];

export default function SolutionPage() {
  const { slug } = useParams();
  const s = SOLUTIONS[slug];
  usePageMeta(s ? s.title : 'Halaman tidak ditemukan – AdiLabs', s ? s.desc : '');
  if (!s) return <NotFound />;

  return (
    <PageShell waUrl={s.wa}>
      <section className="sol-hero">
        <nav className="sol-crumb" aria-label="Breadcrumb"><a href="/">Beranda</a> / <a href="/#karya">Solusi</a> / <span>{s.h1}</span></nav>
        <span className="sol-kick">{s.kick}</span>
        <h1>{s.h1}</h1>
        <p className="sol-lead">{s.lead}</p>
        <div className="sol-cta">
          <a className="sol-btn" href={s.wa} target="_blank" rel="noreferrer" data-track="whatsapp_click" data-loc={`solusi-${s.slug}`}>Diskusikan Kebutuhan</a>
          <a className="sol-btn sol-btn-ghost" href={`/#${s.demoId}`} data-track="demo_click" data-loc={`solusi-${s.slug}`} data-kind="ilustrasi">Lihat contoh tampilan</a>
        </div>
        <p className="sol-status">Status: <b>dikembangkan dan dikonfigurasi sesuai kebutuhan</b> organisasi Anda. Contoh tampilan memakai data contoh.</p>
      </section>

      {s.liveDemo && (
        <section className="sol-demo" aria-labelledby="demo-h">
          <div>
            <span className="sol-kick">Aplikasi demo</span>
            <h2 id="demo-h">Coba langsung: {s.liveDemo.name}</h2>
            <p>{s.liveDemo.name} adalah aplikasi pengajuan &amp; persetujuan anggaran yang sudah berjalan, berisi <b>data demo</b> khusus untuk calon klien. Minta akun demo lewat WhatsApp, lalu masuk di <b>{s.liveDemo.url.replace('https://', '')}</b>.</p>
          </div>
          <div className="sol-demo-cta">
            <a className="sol-btn" href={s.liveDemo.waUrl} target="_blank" rel="noreferrer" data-track="demo_request_click" data-loc={`solusi-${s.slug}`}>Minta akun demo via WhatsApp</a>
            <a className="sol-btn sol-btn-ghost" href={s.liveDemo.url} target="_blank" rel="noopener" data-track="demo_click" data-loc={`solusi-${s.slug}`} data-kind="aplikasi">Buka {s.liveDemo.name} ↗</a>
          </div>
        </section>
      )}

      <section className="sol-sec">
        <h2>Untuk siapa</h2>
        <div className="sol-grid3">
          {s.who.map(([t, d]) => <div className="sol-card" key={t}><h3>{t}</h3><p>{d}</p></div>)}
        </div>
      </section>

      <section className="sol-sec">
        <h2>Masalah yang sering terjadi</h2>
        <ul className="sol-list sol-list-x">{s.problems.map((p) => <li key={p}>{p}</li>)}</ul>
      </section>

      <section className="sol-sec">
        <h2>Alur kerja</h2>
        <ol className="sol-flow">
          {s.flow.map(([t, d], i) => <li key={t}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{t}</h3><p>{d}</p></div></li>)}
        </ol>
      </section>

      <section className="sol-sec sol-split">
        <div>
          <h2>Contoh keluaran</h2>
          <ul className="sol-list sol-list-ok">{s.outputs.map((o) => <li key={o}>{o}</li>)}</ul>
        </div>
        <div>
          <h2>Yang perlu disiapkan</h2>
          <ul className="sol-list">{s.needs.map((n) => <li key={n}>{n}</li>)}</ul>
        </div>
      </section>

      <section className="sol-sec">
        <h2>Batasan yang perlu diketahui</h2>
        <ul className="sol-list sol-list-warn">{s.limits.map((l) => <li key={l}>{l}</li>)}</ul>
      </section>

      <section className="sol-sec sol-split">
        <div>
          <h2>Proses penawaran</h2>
          <ol className="sol-steps">{STEPS.map((t) => <li key={t}>{t}</li>)}</ol>
        </div>
        <div>
          <h2>Dukungan</h2>
          <p className="sol-p">Pelatihan untuk admin dan pengguna, perbaikan bug, serta penyesuaian kecil selama masa dukungan yang disepakati di penawaran. Bantuan dilakukan lewat WhatsApp.</p>
        </div>
      </section>

      <section className="sol-sec">
        <h2>Komponen biaya</h2>
        <CostBreakdown className="cost-in-page" />
      </section>

      <section className="sol-sec">
        <h2>Pertanyaan umum</h2>
        <div className="sol-faq">
          {s.faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </section>

      <section className="sol-final">
        <h2>Ingin membahas alur di organisasi Anda?</h2>
        <p>Ceritakan proses yang berjalan sekarang. Kami bantu memetakan bagian yang bisa dirapikan.</p>
        <a className="sol-btn" href={s.wa} target="_blank" rel="noreferrer" data-track="whatsapp_click" data-loc={`solusi-${s.slug}-akhir`}>Diskusikan Kebutuhan via WhatsApp</a>
      </section>
    </PageShell>
  );
}
