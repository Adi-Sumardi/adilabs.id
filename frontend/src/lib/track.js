// Pelacakan klik CTA (audit P0/ukuran keberhasilan): whatsapp_click, email_click, demo_click, dll.
// Elemen cukup diberi data-track="nama_event" (opsional data-loc="lokasi", data-kind="jenis").
// Dikirim ke GA4 (G-EQE6D6DT4D, dipasang di index.html); tidak mengirim isi pesan atau data pribadi.
//
// Di HP, tautan WhatsApp/email langsung membuka aplikasi lain dan browser dibekukan sebelum GA4
// sempat mengirim event (GA4 menampung event beberapa detik). Karena itu, untuk tautan wa.me/mailto
// di perangkat sentuh, navigasi ditahan sampai GA4 mengonfirmasi event terkirim (maks. ±0,8 detik).
const LEAVES_APP = /^(https?:\/\/(wa\.me|api\.whatsapp\.com)\/|mailto:)/i;

export function initClickTracking() {
  document.addEventListener('click', (e) => {
    const el = e.composedPath().find((n) => n instanceof Element && n.hasAttribute('data-track'));
    if (!el) return;
    const params = { location: el.getAttribute('data-loc') || 'unknown', page: location.pathname };
    // kind: bedakan klik ke ilustrasi/contoh tampilan dari demo aplikasi sungguhan
    if (el.hasAttribute('data-kind')) params.kind = el.getAttribute('data-kind');
    const name = el.getAttribute('data-track');

    if (typeof window.gtag !== 'function') {
      if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...params });
      return;
    }

    const href = el.getAttribute('href') || '';
    const touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    if (touch && !modified && LEAVES_APP.test(href)) {
      e.preventDefault();
      let done = false;
      const go = () => { if (done) return; done = true; window.location.href = href; };
      window.gtag('event', name, { ...params, transport_type: 'beacon', event_callback: go, event_timeout: 800 });
      setTimeout(go, 900);
      return;
    }

    window.gtag('event', name, { ...params, transport_type: 'beacon' });
  }, { capture: true });
}
