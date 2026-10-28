// Pelacakan klik CTA (audit P0/ukuran keberhasilan): whatsapp_click, email_click, demo_click, dll.
// Elemen cukup diberi data-track="nama_event" (opsional data-loc="lokasi", data-kind="jenis").
// Dikirim ke GA4 (G-EQE6D6DT4D, dipasang di index.html); tidak mengirim isi pesan atau data pribadi.
//
// Kenapa ada jalur "beacon langsung": gtag menampung event ±5 detik sebelum dikirim. Tautan
// WhatsApp/email membuka aplikasi lain (di HP sekaligus meninggalkan halaman), sehingga event yang
// masih tertahan ikut hilang. Untuk tautan seperti itu, event dikirim saat itu juga lewat
// navigator.sendBeacon ke endpoint yang sama dengan gtag (/g/collect), lalu baru berpindah.
const GA_ID = 'G-EQE6D6DT4D';
const LEAVES_APP = /^(https?:\/\/(wa\.me|api\.whatsapp\.com)\/|mailto:)/i;

function cookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
}

// client id dari cookie _ga ("GA1.1.123.456" -> "123.456"); sesi dari cookie _ga_<ID>
function gaIds() {
  const ga = cookie('_ga').split('.');
  const cid = ga.length >= 4 ? ga.slice(-2).join('.') : '';
  const s = cookie('_ga_' + GA_ID.slice(2));
  let sid = '', sct = '';
  if (s.startsWith('GS2.')) {
    sid = (s.match(/[.$]s(\d+)/) || [])[1] || '';
    sct = (s.match(/\$o(\d+)/) || [])[1] || '';
  } else if (s.startsWith('GS1.')) {
    const p = s.split('.');
    sid = p[2] || ''; sct = p[3] || '';
  }
  return { cid, sid, sct };
}

function sendNow(name, params) {
  const { cid, sid, sct } = gaIds();
  if (!cid || !navigator.sendBeacon) return false;
  const q = new URLSearchParams({
    v: '2', tid: GA_ID, cid, en: name, seg: '1',
    dl: location.href, dt: document.title, ul: (navigator.language || '').toLowerCase(),
    sr: `${screen.width}x${screen.height}`, _p: String(Math.floor(Math.random() * 1e9)),
  });
  if (sid) q.set('sid', sid);
  if (sct) q.set('sct', sct);
  for (const [k, v] of Object.entries(params)) q.set(`ep.${k}`, v);
  return navigator.sendBeacon(`https://region1.google-analytics.com/g/collect?${q}`);
}

export function initClickTracking() {
  document.addEventListener('click', (e) => {
    const el = e.composedPath().find((n) => n instanceof Element && n.hasAttribute('data-track'));
    if (!el) return;
    const params = { location: el.getAttribute('data-loc') || 'unknown', page: location.pathname };
    // kind: bedakan klik ke ilustrasi/contoh tampilan dari demo aplikasi sungguhan
    if (el.hasAttribute('data-kind')) params.kind = el.getAttribute('data-kind');
    const name = el.getAttribute('data-track');
    const href = el.getAttribute('href') || '';

    // Tautan yang meninggalkan situs (WhatsApp/email): kirim langsung, jangan lewat antrean gtag
    if (LEAVES_APP.test(href) && sendNow(name, params)) return;

    if (typeof window.gtag === 'function') window.gtag('event', name, params);
    else if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...params });
  }, { capture: true });
}
