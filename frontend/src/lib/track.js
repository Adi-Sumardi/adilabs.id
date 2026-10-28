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

// Salin parameter dasar dari permintaan gtag yang sebenarnya (endpoint, gtm, consent, dsb.),
// supaya hit kita identik dengan hit gtag dan pasti diterima GA4.
let gtagBase = null;
const PER_EVENT = new Set(['en', '_s', '_fv', '_nsi', '_ss', '_ee', 'tfd', '_et', '_c', 'epn', 'dr', 'ir']);
function remember(url) {
  try {
    const u = new URL(url, location.href);
    // hanya hit Analytics sungguhan (bukan ping iklan doubleclick) yang punya sesi
    if (!/(^|\.)(google-analytics\.com|analytics\.google\.com)$/.test(u.hostname)) return;
    if (!/\/g\/collect$/.test(u.pathname) || u.searchParams.get('tid') !== GA_ID || !u.searchParams.get('sid')) return;
    const base = new URLSearchParams();
    for (const [k, v] of u.searchParams) if (!PER_EVENT.has(k) && !k.startsWith('ep.') && !k.startsWith('epn.') && !k.startsWith('up.')) base.set(k, v);
    gtagBase = { origin: u.origin + u.pathname, params: base };
  } catch { /* abaikan */ }
}
if (typeof window !== 'undefined') {
  const f = window.fetch;
  if (f) window.fetch = function (input, init) { remember(typeof input === 'string' ? input : input && input.url); return f.apply(this, arguments); };
  const sb = navigator.sendBeacon && navigator.sendBeacon.bind(navigator);
  if (sb) navigator.sendBeacon = function (url, data) { remember(url); return sb(url, data); };
}

function sendNow(name, params) {
  if (!navigator.sendBeacon) return false;
  if (gtagBase) {
    const q = new URLSearchParams(gtagBase.params);
    q.set('en', name); q.set('_et', '1');
    q.set('dl', location.href); q.set('dt', document.title);
    for (const [k, v] of Object.entries(params)) q.set(`ep.${k}`, v);
    return navigator.sendBeacon(`${gtagBase.origin}?${q}`);
  }
  const { cid, sid, sct } = gaIds();
  if (!cid) return false;
  const q = new URLSearchParams({
    v: '2', tid: GA_ID, cid, en: name, seg: '1',
    dl: location.href, dt: document.title, ul: (navigator.language || '').toLowerCase(),
    sr: `${screen.width}x${screen.height}`, _p: String(Math.floor(Math.random() * 1e9)),
  });
  if (sid) q.set('sid', sid);
  if (sct) q.set('sct', sct);
  for (const [k, v] of Object.entries(params)) q.set(`ep.${k}`, v);
  return navigator.sendBeacon(`https://analytics.google.com/g/collect?${q}`);
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
