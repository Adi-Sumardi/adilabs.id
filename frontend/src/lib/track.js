// Pelacakan klik CTA (audit P0/ukuran keberhasilan): whatsapp_click, email_click, demo_click.
// Elemen cukup diberi data-track="nama_event" (opsional data-loc="lokasi").
// Dikirim ke GA4 (G-EQE6D6DT4D, dipasang di index.html); tidak mengirim isi pesan atau data pribadi.
export function initClickTracking() {
  document.addEventListener('click', (e) => {
    const el = e.composedPath().find((n) => n instanceof Element && n.hasAttribute('data-track'));
    if (!el) return;
    const params = { location: el.getAttribute('data-loc') || 'unknown', page: location.pathname };
    // kind: bedakan klik ke ilustrasi/contoh tampilan dari demo aplikasi sungguhan
    if (el.hasAttribute('data-kind')) params.kind = el.getAttribute('data-kind');
    const name = el.getAttribute('data-track');
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
    else if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...params });
  }, { capture: true });
}
